import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { bookings, rooms, user, account } from "~/server/db/schema";
import { auth } from "~/server/better-auth";

export const customerRouter = createTRPCRouter({
  // Ensure default demo admin and sample customers exist
  seedAdminIfMissing: publicProcedure.mutation(async ({ ctx }) => {
    const existingAdmin = await ctx.db.query.user.findFirst({
      where: eq(user.role, "admin"),
    });

    if (!existingAdmin) {
      try {
        const res = await auth.api.signUpEmail({
          body: {
            email: "admin@mdalatsvilla.com",
            password: "admin123456",
            name: "Tổng Quản Lý M_Dalats",
          },
        });

        if (res?.user?.id) {
          await ctx.db
            .update(user)
            .set({
              role: "admin",
              phone: "0939014234",
            })
            .where(eq(user.id, res.user.id));
        }
      } catch (err) {
        console.warn("seedAdminIfMissing:", err);
      }
    }

    // Seed a staff and VIP demo user if no other users exist
    const totalUsers = await ctx.db.select({ count: sql<number>`count(*)` }).from(user);
    if ((totalUsers[0]?.count ?? 0) <= 1) {
      try {
        // Staff user
        const staffRes = await auth.api.signUpEmail({
          body: {
            email: "staff@mdalatsvilla.com",
            password: "staff123456",
            name: "Lễ Tân Villa",
          },
        });
        if (staffRes?.user?.id) {
          await ctx.db
            .update(user)
            .set({ role: "staff", phone: "0912345678" })
            .where(eq(user.id, staffRes.user.id));
        }

        // Regular customer
        const guestRes = await auth.api.signUpEmail({
          body: {
            email: "hoangnam.travel@gmail.com",
            password: "khach123456",
            name: "Nguyễn Hoàng Nam",
          },
        });
        if (guestRes?.user?.id) {
          await ctx.db
            .update(user)
            .set({ role: "user", phone: "0987654321" })
            .where(eq(user.id, guestRes.user.id));
        }
      } catch (e) {
        // Ignore if already exists
      }
    }

    return { success: true };
  }),

  // Get all customers (aggregates registered users & guest booking contacts)
  getAll: publicProcedure.query(async ({ ctx }) => {
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
  updateRole: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["admin", "staff", "user"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({ role: input.role })
        .where(eq(user.id, input.userId));

      return { success: true };
    }),

  // Update customer contact info
  updateInfo: publicProcedure
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
  toggleBan: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        banned: z.boolean(),
        banReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
