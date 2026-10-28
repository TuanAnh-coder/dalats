import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Better Auth core tables
export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  phone: text("phone"),
  banned: boolean("banned").default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  bookings: many(bookings),
}));

export const account = pgTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
    scope: text("scope"),
    idToken: text("idToken"),
    password: text("password"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => [index("account_user_id_idx").on(t.userId)]
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const session = pgTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    impersonatedBy: text("impersonatedBy"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => [index("session_user_id_idx").on(t.userId)]
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const verification = pgTable(
  "verification",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).$onUpdate(() => new Date()),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

// Villa Rooms table
export const rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 150 }).notNull(),
    roomNumber: varchar("roomNumber", { length: 20 }).notNull(),
    area: integer("area").notNull(), // m2
    maxAdults: integer("maxAdults").notNull().default(2),
    maxChildren: integer("maxChildren").notNull().default(2),
    bedType: varchar("bedType", { length: 100 }).notNull().default("1 Giường Queen"),
    viewType: varchar("viewType", { length: 100 }).notNull().default("Sân vườn"),
    pricePerNight: integer("pricePerNight").notNull(), // VNĐ
    originalPrice: integer("originalPrice"), // VNĐ
    image: text("image").notNull(),
    gallery: text("gallery"), // JSON string
    shortDescription: text("shortDescription"),
    description: text("description"),
    amenities: text("amenities"), // JSON string
    isAvailable: boolean("isAvailable").notNull().default(true),
    isFlashSale: boolean("isFlashSale").notNull().default(false),
    flashSaleDiscount: integer("flashSaleDiscount"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("room_slug_idx").on(t.slug)]
);

export const roomRelations = relations(rooms, ({ many }) => ({
  bookings: many(bookings),
}));

// Villa Bookings table
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    bookingCode: varchar("bookingCode", { length: 50 }).notNull().unique(),
    userId: text("userId").references(() => user.id),
    roomId: integer("roomId")
      .notNull()
      .references(() => rooms.id),
    customerName: varchar("customerName", { length: 150 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 150 }).notNull(),
    customerPhone: varchar("customerPhone", { length: 50 }).notNull(),
    checkIn: varchar("checkIn", { length: 20 }).notNull(), // YYYY-MM-DD
    checkOut: varchar("checkOut", { length: 20 }).notNull(), // YYYY-MM-DD
    adults: integer("adults").notNull().default(2),
    children: integer("children").notNull().default(0),
    totalNights: integer("totalNights").notNull().default(1),
    totalPrice: integer("totalPrice").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("pending"),
    specialRequests: text("specialRequests"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("booking_code_idx").on(t.bookingCode),
    index("booking_user_id_idx").on(t.userId),
    index("booking_room_id_idx").on(t.roomId),
    index("booking_customer_phone_idx").on(t.customerPhone),
    index("booking_customer_email_idx").on(t.customerEmail),
    index("booking_checkout_status_idx").on(t.checkOut, t.status),
  ]
);

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(user, { fields: [bookings.userId], references: [user.id] }),
  room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
}));

// Newsletter Subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .defaultNow()
    .notNull(),
});

// Contact Messages
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
