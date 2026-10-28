#!/usr/bin/env node

/**
 * M_Dalats Boutique Villa - Admin Role & User Management Script (PostgreSQL Edition)
 * 
 * Usage:
 *   node scripts/admin-role.mjs list
 *   node scripts/admin-role.mjs promote <email> [admin|staff|user]
 *   node scripts/admin-role.mjs demote <email>
 *   node scripts/admin-role.mjs create <email> <password> <name> [role]
 *   node scripts/admin-role.mjs reset-password <email> <newPassword>
 */

import postgres from "postgres";
import { hashPassword, generateRandomString } from "better-auth/crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)/);
  if (match) dbUrl = match[1];
}
dbUrl = dbUrl || "postgresql://postgres:postgres@localhost:5432/mdalats_villa";

async function ensureTables(sqlClient) {
  await sqlClient.unsafe(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY,
      "name" text,
      "email" text NOT NULL UNIQUE,
      "emailVerified" boolean DEFAULT false,
      "image" text,
      "role" text NOT NULL DEFAULT 'user',
      "phone" text,
      "banned" boolean DEFAULT false,
      "banReason" text,
      "banExpires" timestamp,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp
    );

    CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accountId" text NOT NULL,
      "providerId" text NOT NULL,
      "accessToken" text,
      "refreshToken" text,
      "accessTokenExpiresAt" timestamp,
      "refreshTokenExpiresAt" timestamp,
      "scope" text,
      "idToken" text,
      "password" text,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp
    );

    CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "token" text NOT NULL UNIQUE,
      "expiresAt" timestamp NOT NULL,
      "ipAddress" text,
      "userAgent" text,
      "impersonatedBy" text,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp
    );

    CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" timestamp NOT NULL,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp
    );

    CREATE TABLE IF NOT EXISTS "rooms" (
      "id" serial PRIMARY KEY,
      "slug" varchar(100) NOT NULL UNIQUE,
      "name" varchar(150) NOT NULL,
      "roomNumber" varchar(20) NOT NULL,
      "area" integer NOT NULL,
      "maxAdults" integer DEFAULT 2 NOT NULL,
      "maxChildren" integer DEFAULT 2 NOT NULL,
      "bedType" varchar(100) DEFAULT '1 Giường Queen' NOT NULL,
      "viewType" varchar(100) DEFAULT 'Sân vườn' NOT NULL,
      "pricePerNight" integer NOT NULL,
      "originalPrice" integer,
      "image" text NOT NULL,
      "gallery" text,
      "shortDescription" text,
      "description" text,
      "amenities" text,
      "isAvailable" boolean DEFAULT true NOT NULL,
      "isFlashSale" boolean DEFAULT false NOT NULL,
      "flashSaleDiscount" integer,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "bookings" (
      "id" serial PRIMARY KEY,
      "bookingCode" varchar(50) NOT NULL UNIQUE,
      "userId" text REFERENCES "user"("id"),
      "roomId" integer NOT NULL REFERENCES "rooms"("id"),
      "customerName" varchar(150) NOT NULL,
      "customerEmail" varchar(150) NOT NULL,
      "customerPhone" varchar(50) NOT NULL,
      "checkIn" varchar(20) NOT NULL,
      "checkOut" varchar(20) NOT NULL,
      "adults" integer DEFAULT 2 NOT NULL,
      "children" integer DEFAULT 0 NOT NULL,
      "totalNights" integer DEFAULT 1 NOT NULL,
      "totalPrice" integer NOT NULL,
      "status" varchar(30) DEFAULT 'pending' NOT NULL,
      "specialRequests" text,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "subscribers" (
      "id" serial PRIMARY KEY,
      "email" varchar(255) NOT NULL UNIQUE,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "contacts" (
      "id" serial PRIMARY KEY,
      "name" varchar(150) NOT NULL,
      "email" varchar(150) NOT NULL,
      "phone" varchar(50),
      "message" text NOT NULL,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );

    -- Auto-fix any credential accounts where accountId was set to email instead of userId
    UPDATE "account" SET "accountId" = "userId" WHERE "providerId" = 'credential' AND "accountId" != "userId";
    -- Ensure role is lowercase 'admin'
    UPDATE "user" SET role = 'admin' WHERE LOWER(role) = 'admin' AND role != 'admin';
    -- Ensure admin email is verified and not banned
    UPDATE "user" SET "emailVerified" = true, banned = false WHERE LOWER(role) = 'admin';
  `);
}

async function getDbConnection() {
  const targetDbMatch = dbUrl.match(/\/([^/?]+)(\?.*)?$/);
  const targetDb = targetDbMatch ? targetDbMatch[1] : "dalats_villa";

  let client;
  try {
    client = postgres(dbUrl, { max: 1, onnotice: () => {} });
    await client`SELECT 1`;
  } catch (err) {
    if (err && err.code === "3D000") {
      console.log(`ℹ️ Cơ sở dữ liệu "${targetDb}" chưa tồn tại.`);
      console.log(`⏳ Đang tự động kết nối hệ thống và tạo database "${targetDb}"...`);
      const maintenanceUrl = dbUrl.replace(/\/[^/?]+(\?.*)?$/, "/postgres$1");
      const rootClient = postgres(maintenanceUrl, { max: 1, onnotice: () => {} });
      await rootClient.unsafe(`CREATE DATABASE "${targetDb}"`);
      await rootClient.end();
      console.log(`✅ Đã tạo cơ sở dữ liệu "${targetDb}" thành công!`);
      client = postgres(dbUrl, { onnotice: () => {} });
    } else {
      throw err;
    }
  }

  await ensureTables(client);
  return client;
}

let sql = null;

const [,, command, ...args] = process.argv;

async function listUsers() {
  console.log("\n========================================================");
  console.log("       DANH SÁCH TÀI KHOẢN HỆ THỐNG M_DALATS VILLA       ");
  console.log("========================================================\n");

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.role, u."createdAt", a."providerId"
    FROM "user" u
    LEFT JOIN "account" a ON u.id = a."userId"
    ORDER BY CASE WHEN u.role = 'admin' THEN 1 WHEN u.role = 'staff' THEN 2 ELSE 3 END, u.email ASC
  `;

  if (rows.length === 0) {
    console.log("Không tìm thấy người dùng nào trong cơ sở dữ liệu.");
    await sql.end();
    return;
  }

  console.table(
    rows.map((r, idx) => ({
      STT: idx + 1,
      "Tên người dùng": r.name || "(Chưa đặt)",
      Email: r.email,
      "Vai trò (Role)": r.role?.toUpperCase(),
      "Loại đăng nhập": r.providerId || "N/A",
      "Ngày tạo": r.createdAt ? new Date(r.createdAt).toLocaleString("vi-VN") : "N/A",
    }))
  );
  console.log(`\nTổng số tài khoản: ${rows.length}\n`);
  await sql.end();
}

async function promoteUser(email, targetRole = "admin") {
  if (!email) {
    console.error("❌ Lỗi: Vui lòng cung cấp email của tài khoản cần phân quyền.");
    console.log("Cú pháp: node scripts/admin-role.mjs promote <email> [admin|staff|user]");
    process.exit(1);
  }

  const validRoles = ["admin", "staff", "user"];
  const role = targetRole.toLowerCase();
  if (!validRoles.includes(role)) {
    console.error(`❌ Lỗi: Vai trò '${targetRole}' không hợp lệ. Chỉ chấp nhận: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  const rows = await sql`SELECT id, name, email, role FROM "user" WHERE LOWER(email) = LOWER(${email})`;

  if (rows.length === 0) {
    console.error(`❌ Không tìm thấy người dùng với email: ${email}`);
    await sql.end();
    process.exit(1);
  }

  const u = rows[0];
  await sql`UPDATE "user" SET role = ${role} WHERE id = ${u.id}`;

  console.log("\n✅ CẬP NHẬT VAI TRÒ THÀNH CÔNG!");
  console.log(`- Người dùng: ${u.name} (${u.email})`);
  console.log(`- Vai trò cũ: ${u.role}`);
  console.log(`- Vai trò mới: 👉 ${role.toUpperCase()}`);
  console.log("- Người dùng hiện có toàn quyền truy cập theo vai trò mới.\n");
  await sql.end();
}

async function createUser(email, password, name = "Quản trị viên", role = "admin") {
  if (!email || !password) {
    console.error("❌ Lỗi: Cần cung cấp đầy đủ email và mật khẩu.");
    console.log("Cú pháp: node scripts/admin-role.mjs create <email> <password> <name> [admin|staff|user]");
    process.exit(1);
  }

  const existing = await sql`SELECT id FROM "user" WHERE LOWER(email) = LOWER(${email})`;

  if (existing.length > 0) {
    console.error(`❌ Email '${email}' đã tồn tại trong hệ thống.`);
    console.log("Để đổi vai trò, dùng lệnh: node scripts/admin-role.mjs promote " + email + " " + role);
    console.log("Để đổi mật khẩu, dùng lệnh: node scripts/admin-role.mjs reset-password " + email + " <newPassword>");
    await sql.end();
    process.exit(1);
  }

  const userId = generateRandomString(32);
  const accountId = generateRandomString(32);
  const hashedPassword = await hashPassword(password);
  const now = new Date();

  // 1. Insert user
  await sql`
    INSERT INTO "user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt")
    VALUES (${userId}, ${name}, ${email}, true, ${role}, ${now}, ${now})
  `;

  // 2. Insert account with password (Better Auth requires accountId === userId for credential provider)
  await sql`
    INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
    VALUES (${accountId}, ${userId}, ${userId}, 'credential', ${hashedPassword}, ${now}, ${now})
  `;

  console.log("\n========================================================");
  console.log("       TẠO TÀI KHOẢN MỚI THÀNH CÔNG (POSTGRESQL)        ");
  console.log("========================================================");
  console.log(`- Tên hiển thị : ${name}`);
  console.log(`- Email        : ${email}`);
  console.log(`- Mật khẩu     : ${password}`);
  console.log(`- Vai trò      : ${role.toUpperCase()}`);
  console.log(`- User ID      : ${userId}`);
  console.log("--------------------------------------------------------");
  console.log("Bạn có thể đăng nhập ngay trên giao diện web.");
  console.log("========================================================\n");
  await sql.end();
}

async function resetPassword(email, newPassword) {
  if (!email || !newPassword) {
    console.error("❌ Lỗi: Cần cung cấp email và mật khẩu mới.");
    console.log("Cú pháp: node scripts/admin-role.mjs reset-password <email> <newPassword>");
    process.exit(1);
  }

  const existing = await sql`SELECT id, name, email FROM "user" WHERE LOWER(email) = LOWER(${email})`;

  if (existing.length === 0) {
    console.error(`❌ Không tìm thấy người dùng với email: ${email}`);
    await sql.end();
    process.exit(1);
  }

  const u = existing[0];
  const hashedPassword = await hashPassword(newPassword);
  const now = new Date();

  // Check if credential account exists
  const acc = await sql`
    SELECT id FROM "account" WHERE "userId" = ${u.id} AND "providerId" = 'credential'
  `;

  if (acc.length > 0) {
    await sql`
      UPDATE "account"
      SET password = ${hashedPassword}, "updatedAt" = ${now}
      WHERE "userId" = ${u.id} AND "providerId" = 'credential'
    `;
  } else {
    const accountId = generateRandomString(32);
    await sql`
      INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
      VALUES (${accountId}, ${u.id}, ${u.id}, 'credential', ${hashedPassword}, ${now}, ${now})
    `;
  }

  console.log("\n✅ ĐẶT LẠI MẬT KHẨU THÀNH CÔNG!");
  console.log(`- Người dùng : ${u.name} (${u.email})`);
  console.log(`- Mật khẩu mới: ${newPassword}\n`);
  await sql.end();
}

function showHelp() {
  console.log(`
Lệnh quản trị tài khoản M_Dalats Boutique Villa (PostgreSQL):
  node scripts/admin-role.mjs list
  node scripts/admin-role.mjs create <email> <password> <name> [admin|staff|user]
  node scripts/admin-role.mjs promote <email> [admin|staff|user]
  node scripts/admin-role.mjs demote <email>
  node scripts/admin-role.mjs reset-password <email> <newPassword>
  `);
}

async function main() {
  try {
    sql = await getDbConnection();

    switch (command) {
      case "fix":
        console.log("✅ Đã tự động cập nhật và đồng bộ toàn bộ tài khoản!");
        await sql.end();
        break;
      case "list":
        await listUsers();
        break;
      case "promote":
        await promoteUser(args[0], args[1] || "admin");
        break;
      case "demote":
        await promoteUser(args[0], "user");
        break;
      case "seed":
      case "seed-default":
        await createUser(
          args[0] || "admin@dalats.vn",
          args[1] || "admin123",
          args[2] || "Quản trị viên",
          "admin"
        );
        break;
      case "create":
        await createUser(
          args[0] || "admin@dalats.vn",
          args[1] || "admin123",
          args[2] || "Quản trị viên",
          args[3] || "admin"
        );
        break;
      case "reset-password":
        await resetPassword(args[0], args[1]);
        break;
      default:
        showHelp();
        await sql.end();
        break;
    }
  } catch (err) {
    console.error("❌ Lỗi thực thi:", err);
    if (sql) {
      try {
        await sql.end();
      } catch {}
    }
    process.exit(1);
  }
}

main();
