import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

// Better Auth core tables
export const user = sqliteTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: "boolean" }).default(false),
  image: d.text({ length: 255 }),
  role: d.text({ length: 50 }).notNull().default("user"),
  phone: d.text({ length: 50 }),
  banned: d.integer({ mode: "boolean" }).default(false),
  banReason: d.text(),
  banExpires: d.integer({ mode: "timestamp" }),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  bookings: many(bookings),
}));

export const account = sqliteTable(
  "account",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    accountId: d.text({ length: 255 }).notNull(),
    providerId: d.text({ length: 255 }).notNull(),
    accessToken: d.text(),
    refreshToken: d.text(),
    accessTokenExpiresAt: d.integer({ mode: "timestamp" }),
    refreshTokenExpiresAt: d.integer({ mode: "timestamp" }),
    scope: d.text({ length: 255 }),
    idToken: d.text(),
    password: d.text(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const session = sqliteTable(
  "session",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    token: d.text({ length: 255 }).notNull().unique(),
    expiresAt: d.integer({ mode: "timestamp" }).notNull(),
    ipAddress: d.text({ length: 255 }),
    userAgent: d.text({ length: 255 }),
    impersonatedBy: d.text(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)]
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const verification = sqliteTable(
  "verification",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: d.text({ length: 255 }).notNull(),
    value: d.text({ length: 255 }).notNull(),
    expiresAt: d.integer({ mode: "timestamp" }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

// Villa Rooms table
export const rooms = sqliteTable(
  "rooms",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    slug: d.text({ length: 100 }).notNull().unique(),
    name: d.text({ length: 150 }).notNull(),
    roomNumber: d.text({ length: 20 }).notNull(),
    area: d.integer().notNull(), // m2
    maxAdults: d.integer().notNull().default(2),
    maxChildren: d.integer().notNull().default(2),
    bedType: d.text({ length: 100 }).notNull().default("1 Giường Queen"),
    viewType: d.text({ length: 100 }).notNull().default("Sân vườn"),
    pricePerNight: d.integer().notNull(), // VNĐ
    originalPrice: d.integer(), // VNĐ
    image: d.text({ length: 500 }).notNull(),
    gallery: d.text({ mode: "json" }), // array of image urls
    shortDescription: d.text(),
    description: d.text(),
    amenities: d.text({ mode: "json" }), // array of strings
    isAvailable: d.integer({ mode: "boolean" }).notNull().default(true),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [index("room_slug_idx").on(t.slug)]
);

export const roomRelations = relations(rooms, ({ many }) => ({
  bookings: many(bookings),
}));

// Villa Bookings table
export const bookings = sqliteTable(
  "bookings",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    bookingCode: d.text({ length: 50 }).notNull().unique(),
    userId: d.text({ length: 255 }).references(() => user.id),
    roomId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => rooms.id),
    customerName: d.text({ length: 150 }).notNull(),
    customerEmail: d.text({ length: 150 }).notNull(),
    customerPhone: d.text({ length: 50 }).notNull(),
    checkIn: d.text({ length: 20 }).notNull(), // YYYY-MM-DD
    checkOut: d.text({ length: 20 }).notNull(), // YYYY-MM-DD
    adults: d.integer().notNull().default(2),
    children: d.integer().notNull().default(0),
    totalNights: d.integer().notNull().default(1),
    totalPrice: d.integer().notNull(),
    status: d.text({ length: 30 }).notNull().default("pending"), // pending, confirmed, cancelled
    specialRequests: d.text(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [
    index("booking_code_idx").on(t.bookingCode),
    index("booking_user_id_idx").on(t.userId),
    index("booking_room_id_idx").on(t.roomId),
  ]
);

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(user, { fields: [bookings.userId], references: [user.id] }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
}));

// Newsletter Subscribers
export const subscribers = sqliteTable("subscribers", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  email: d.text({ length: 255 }).notNull().unique(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
}));

// Contact Messages
export const contacts = sqliteTable("contacts", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: d.text({ length: 150 }).notNull(),
  email: d.text({ length: 150 }).notNull(),
  phone: d.text({ length: 50 }),
  message: d.text().notNull(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
}));

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
