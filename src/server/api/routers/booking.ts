import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bookings, rooms } from "~/server/db/schema";

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        customerName: z.string().min(2, "Họ tên phải từ 2 ký tự"),
        customerEmail: z.string().email("Email không hợp lệ"),
        customerPhone: z.string().min(9, "Số điện thoại không hợp lệ"),
        checkIn: z.string(),
        checkOut: z.string(),
        adults: z.number().min(1).default(2),
        children: z.number().default(0),
        totalNights: z.number().min(1).default(1),
        totalPrice: z.number(),
        specialRequests: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate date sequence
      if (input.checkIn >= input.checkOut) {
        throw new Error("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày.");
      }

      // Check room status
      const room = await ctx.db
        .select()
        .from(rooms)
        .where(eq(rooms.id, input.roomId))
        .get();

      if (!room || !room.isAvailable) {
        throw new Error("Phòng này hiện đang tạm ngừng nhận khách hoặc đang bảo trì.");
      }

      // Check for overlapping bookings
      const existingBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.roomId, input.roomId));

      const hasConflict = existingBookings.some((b) => {
        if (b.status === "cancelled") return false;
        return b.checkIn < input.checkOut && b.checkOut > input.checkIn;
      });

      if (hasConflict) {
        throw new Error("Phòng này đã có khách đặt trong khoảng thời gian quý khách chọn. Vui lòng chọn ngày khác hoặc chọn phòng khác.");
      }

      const codeSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const bookingCode = `MDALAT-${Date.now().toString().slice(-4)}${codeSuffix}`;

      const userId = ctx.session?.user?.id ?? null;

      const [newBooking] = await ctx.db
        .insert(bookings)
        .values({
          bookingCode,
          userId,
          roomId: input.roomId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          adults: input.adults,
          children: input.children,
          totalNights: input.totalNights,
          totalPrice: input.totalPrice,
          specialRequests: input.specialRequests,
          status: "confirmed",
        })
        .returning();

      if (!newBooking) {
        throw new Error("Không thể khởi tạo đơn đặt phòng, vui lòng thử lại.");
      }

      return newBooking;
    }),

  getMyBookings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.bookings.findMany({
      where: eq(bookings.userId, ctx.session.user.id),
      with: {
        room: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });
  }),

  getByCode: publicProcedure
    .input(z.object({ bookingCode: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.bookings.findFirst({
        where: eq(bookings.bookingCode, input.bookingCode.trim().toUpperCase()),
        with: {
          room: true,
        },
      });
    }),

  lookupByPhone: publicProcedure
    .input(z.object({ customerPhone: z.string() }))
    .query(async ({ ctx, input }) => {
      const cleanPhone = input.customerPhone.trim();
      if (!cleanPhone || cleanPhone.length < 8) return [];
      return ctx.db.query.bookings.findMany({
        where: eq(bookings.customerPhone, cleanPhone),
        with: {
          room: true,
        },
        orderBy: [desc(bookings.createdAt)],
      });
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .get();

      if (!booking || booking.userId !== ctx.session.user.id) {
        throw new Error("Không tìm thấy đơn đặt phòng hoặc bạn không có quyền huỷ.");
      }

      await ctx.db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(eq(bookings.id, input.id));

      return { success: true };
    }),

  // Admin Procedures
  getAll: publicProcedure.query(async ({ ctx }) => {
    let all = await ctx.db.query.bookings.findMany({
      with: {
        room: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    // If database is brand new, seed realistic sample bookings for demonstration
    if (all.length === 0) {
      const allRooms = await ctx.db.select().from(rooms);
      if (allRooms.length > 0) {
        const r1 = allRooms[0]?.id ?? 1;
        const r2 = allRooms[1]?.id ?? 2;
        const r3 = allRooms[2]?.id ?? 3;

        await ctx.db.insert(bookings).values([
          {
            bookingCode: "MDALAT-8921A",
            roomId: r1,
            customerName: "Nguyễn Thành Long",
            customerEmail: "thanhlong.nguyen@gmail.com",
            customerPhone: "0912 345 678",
            checkIn: "2026-10-25",
            checkOut: "2026-10-27",
            adults: 2,
            children: 1,
            totalNights: 2,
            totalPrice: 1700000,
            status: "confirmed",
            specialRequests: "Chuẩn bị set tiệc BBQ ngoài trời tối 25/10 và nôi em bé.",
          },
          {
            bookingCode: "MDALAT-5412B",
            roomId: r2,
            customerName: "Trần Mai Chi",
            customerEmail: "maichi.tran@yahoo.com",
            customerPhone: "0988 776 655",
            checkIn: "2026-10-28",
            checkOut: "2026-10-31",
            adults: 2,
            children: 0,
            totalNights: 3,
            totalPrice: 2550000,
            status: "pending",
            specialRequests: "Check-in sớm lúc 11:30 sáng nếu phòng trống.",
          },
          {
            bookingCode: "MDALAT-3390C",
            roomId: r3,
            customerName: "Lê Hoàng Minh",
            customerEmail: "minh.lehoang@outlook.com",
            customerPhone: "0903 112 233",
            checkIn: "2026-11-02",
            checkOut: "2026-11-04",
            adults: 4,
            children: 2,
            totalNights: 2,
            totalPrice: 2700000,
            status: "confirmed",
            specialRequests: "Kỷ niệm 5 năm ngày cưới, nhờ villa chuẩn bị bình hoa hồng.",
          },
          {
            bookingCode: "MDALAT-1204D",
            roomId: r1,
            customerName: "Phạm Quỳnh Anh",
            customerEmail: "quynhanh.pham@gmail.com",
            customerPhone: "0934 998 877",
            checkIn: "2026-10-18",
            checkOut: "2026-10-19",
            adults: 2,
            children: 0,
            totalNights: 1,
            totalPrice: 850000,
            status: "completed",
            specialRequests: "Trải nghiệm rất tuyệt vời!",
          },
        ]);

        all = await ctx.db.query.bookings.findMany({
          with: {
            room: true,
          },
          orderBy: [desc(bookings.createdAt)],
        });
      }
    }

    return all;
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["confirmed", "pending", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(bookings).where(eq(bookings.id, input.id));
      return { success: true };
    }),
});

