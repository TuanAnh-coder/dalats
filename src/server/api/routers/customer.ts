import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  adminProcedure,
  createTRPCRouter,
  staffProcedure,
} from "~/server/api/trpc";
import { bookings, rooms, user, account } from "~/server/db/schema";
import { auth } from "~/server/better-auth";

export const customerRouter = createTRPCRouter({
  // Get all customers (aggregates registered users & guest booking contacts)
  getAll: staffProcedure.query(async ({ ctx }) => {
    // 1. Get all registered users
    const registeredUsers = await ctx.db.query.user.findMany({
      orderBy: [desc(user.createdAt)],
    });

    // 2. Get all bookings to calculate spend and history
    const allBookings = await ctx.db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
    });

    // Group bookings by email and phone
    const customerMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        isRegistered: boolean;
        banned: boolean;
        createdAt: Date;
        totalBookings: number;
        totalSpent: number;
        lastBookingDate: string | null;
        vipTier: "VIP Kim Cương" | "VIP Vàng" | "Khách Thân Thiết" | "Khách Mới" | "Thành Viên";
        bookingCodes: string[];
      }
    >();

    // Add registered users first
    for (const u of registeredUsers) {
      const emailKey = u.email.toLowerCase().trim();
      customerMap.set(emailKey, {
        id: u.id,
        name: u.name || "Khách Hàng",
        email: u.email,
        phone: u.phone || "",
        role: u.role || "user",
        isRegistered: true,
        banned: Boolean(u.banned),
        createdAt: u.createdAt,
        totalBookings: 0,
        totalSpent: 0,
        lastBookingDate: null,
        vipTier: "Thành Viên",
        bookingCodes: [],
      });
    }

    // Process all bookings
    for (const b of allBookings) {
      const emailKey = b.customerEmail.toLowerCase().trim();
      let customer = customerMap.get(emailKey);

      if (!customer) {
        // Customer booked as guest without an account
        customer = {
          id: `guest_${b.id}`,
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          role: "guest",
          isRegistered: false,
          banned: false,
          createdAt: b.createdAt,
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
          vipTier: "Khách Mới",
          bookingCodes: [],
        };
        customerMap.set(emailKey, customer);
      } else {
        if (!customer.phone && b.customerPhone) {
          customer.phone = b.customerPhone;
        }
      }

      customer.totalBookings += 1;
      customer.bookingCodes.push(b.bookingCode);
      if (b.status !== "cancelled") {
        customer.totalSpent += b.totalPrice;
      }
      if (!customer.lastBookingDate || b.checkIn > customer.lastBookingDate) {
        customer.lastBookingDate = b.checkIn;
      }
    }

    // Calculate VIP tiers
    const list = Array.from(customerMap.values()).map((c) => {
      let vipTier: "VIP Kim Cương" | "VIP Vàng" | "Khách Thân Thiết" | "Khách Mới" | "Thành Viên" = "Khách Mới";
      if (c.totalSpent >= 10000000) {
        vipTier = "VIP Kim Cương";
      } else if (c.totalSpent >= 5000000) {
        vipTier = "VIP Vàng";
      } else if (c.totalSpent >= 2000000 || c.totalBookings >= 2) {
        vipTier = "Khách Thân Thiết";
      } else if (c.isRegistered && c.totalBookings === 0) {
        vipTier = "Thành Viên";
      }
      return {
        ...c,
        vipTier,
      };
    });

    // Sort by total spent descending, then by total bookings
    return list.sort((a, b) => b.totalSpent - a.totalSpent || b.totalBookings - a.totalBookings);
  }),

  // Update user role (promote to admin/staff, demote to user)
  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "staff", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Security Guard: Prevent active admin from accidentally locking out themselves
      if (input.userId === ctx.session.user.id && input.role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Không thể tự hạ quyền Quản trị viên của chính mình. Vui lòng nhờ một Quản trị viên khác thực hiện nếu cần thiết.",
        });
      }

      await ctx.db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  // Update customer contact info
  updateInfo: staffProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().min(2),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          name: input.name,
          phone: input.phone || null,
        })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  // Toggle user ban status
  toggleBan: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banned: z.boolean(),
        banReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Security Guard: Prevent active admin from accidentally banning their own account
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Không thể tự khóa tài khoản Quản trị viên đang đăng nhập.",
        });
      }

      await ctx.db
        .update(user)
        .set({
          banned: input.banned,
          banReason: input.banned ? input.banReason || "Vi phạm quy định villa" : null,
        })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),
});
