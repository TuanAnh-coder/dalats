import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "~/server/api/trpc";
import { bookings, rooms } from "~/server/db/schema";
import { redisCache } from "~/server/redis";
import { checkRateLimit, getClientIp } from "~/server/security/rate-limit";
import {
  calculateBookingPrice,
  checkRoomConflict,
  formatDateVi,
  getRoomTodayOccupancy,
  getTodayIsoDate,
  isBookingActive,
  validateBookingDates,
} from "~/server/business/booking-rules";

function sanitizeString(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export const bookingRouter = createTRPCRouter({
  /**
   * Real-time Check Availability for a Room & Date Range
   */
  checkAvailability: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày nhận phòng phải là YYYY-MM-DD"),
        checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày trả phòng phải là YYYY-MM-DD"),
        adults: z.number().min(1).default(2),
        children: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const dateValidation = validateBookingDates(input.checkIn, input.checkOut);
      if (!dateValidation.valid) {
        return {
          isAvailable: false,
          reason: dateValidation.error,
          pricing: null,
          conflictingBooking: null,
        };
      }

      const [room] = await ctx.db
        .select()
        .from(rooms)
        .where(eq(rooms.id, input.roomId))
        .limit(1);

      if (!room) {
        return {
          isAvailable: false,
          reason: "Phòng nghỉ không tồn tại trong hệ thống.",
          pricing: null,
          conflictingBooking: null,
        };
      }

      if (!room.isAvailable) {
        return {
          isAvailable: false,
          reason: `Phòng ${room.name} hiện đang tạm đóng hoặc đang trong quá trình bảo trì kỹ thuật.`,
          pricing: null,
          conflictingBooking: null,
        };
      }

      const existingBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.roomId, input.roomId));

      const conflictCheck = checkRoomConflict(
        input.roomId,
        input.checkIn,
        input.checkOut,
        existingBookings
      );

      const pricing = calculateBookingPrice({
        pricePerNight: room.pricePerNight,
        maxAdults: room.maxAdults,
        maxChildren: room.maxChildren,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        adults: input.adults,
        children: input.children,
      });

      if (conflictCheck.hasConflict) {
        return {
          isAvailable: false,
          reason: conflictCheck.reason,
          pricing,
          conflictingBooking: conflictCheck.conflictingBooking
            ? {
                checkIn: conflictCheck.conflictingBooking.checkIn,
                checkOut: conflictCheck.conflictingBooking.checkOut,
              }
            : null,
        };
      }

      return {
        isAvailable: true,
        reason: "Phòng trống sẵn sàng nhận khách.",
        pricing,
        conflictingBooking: null,
      };
    }),

  /**
   * Get all booked date ranges for a room (for UI calendars & pickers)
   */
  getBookedRanges: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ ctx, input }) => {
      const today = getTodayIsoDate();
      const allRoomBookings = await ctx.db
        .select({
          id: bookings.id,
          checkIn: bookings.checkIn,
          checkOut: bookings.checkOut,
          status: bookings.status,
          customerName: bookings.customerName,
        })
        .from(bookings)
        .where(eq(bookings.roomId, input.roomId));

      // Filter active bookings whose checkout is today or in the future
      return allRoomBookings
        .filter((b) => isBookingActive(b.status) && b.checkOut >= today)
        .map((b) => ({
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
          displayTitle: `Kín phòng: ${formatDateVi(b.checkIn)} → ${formatDateVi(b.checkOut)}`,
        }));
    }),

  /**
   * Create Booking with Concurrency Lock, ACID Transaction & Server-side Validation
   */
  create: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        customerName: z.string().min(2, "Họ tên phải từ 2 ký tự").max(100, "Họ tên không được vượt quá 100 ký tự"),
        customerEmail: z.string().email("Email không hợp lệ"),
        customerPhone: z.string().regex(/^[0-9+() -]{8,20}$/, "Số điện thoại không hợp lệ (tối thiểu 8 ký tự số)"),
        checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày nhận phòng phải là YYYY-MM-DD"),
        checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày trả phòng phải là YYYY-MM-DD"),
        adults: z.number().min(1).default(2),
        children: z.number().default(0),
        totalNights: z.number().min(1).default(1),
        totalPrice: z.number().optional(),
        specialRequests: z.string().max(500, "Yêu cầu đặc biệt không được vượt quá 500 ký tự").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 0. Rate Limiting Check: max 10 booking creation attempts per 5 minutes per IP
      const ip = getClientIp(ctx.headers);
      const rateLimit = await checkRateLimit(`booking:create:${ip}`, 10, 300);
      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Hệ thống phát hiện quá nhiều yêu cầu tạo đơn từ địa chỉ mạng của bạn. Vui lòng chờ ít phút hoặc liên hệ quản gia.",
        });
      }

      // 1. Strict Date Validation
      const dateValidation = validateBookingDates(input.checkIn, input.checkOut);
      if (!dateValidation.valid) {
        throw new Error(dateValidation.error);
      }

      const safeCustomerName = sanitizeString(input.customerName);
      const safeSpecialRequests = input.specialRequests ? sanitizeString(input.specialRequests) : null;

      try {
        // 2. Concurrency Lock: Redis Mutex lock on room id to prevent double booking
        return await redisCache.withLock(
          `booking:room:lock:${input.roomId}`,
          10, // 10 seconds lock timeout
          async () => {
            // 3. PostgreSQL ACID Transaction for atomicity & concurrency protection
            return await ctx.db.transaction(async (tx) => {
              // Verify room existence & availability status
              const [room] = await tx
                .select()
                .from(rooms)
                .where(eq(rooms.id, input.roomId))
                .limit(1);

              if (!room || !room.isAvailable) {
                throw new Error("Phòng này hiện đang tạm ngừng nhận khách hoặc đang bảo trì kỹ thuật.");
              }

              // Strict capacity check
              if (input.adults > room.maxAdults + 2) {
                throw new Error(
                  `Số khách (${input.adults} người lớn) vượt quá giới hạn tối đa cho phép của phòng ${room.name} (Tối đa ${room.maxAdults + 2} người lớn kèm kê nệm phụ).`
                );
              }

              // Check for overlapping bookings inside the transaction
              const existingBookings = await tx
                .select()
                .from(bookings)
                .where(eq(bookings.roomId, input.roomId));

              const conflict = checkRoomConflict(
                input.roomId,
                input.checkIn,
                input.checkOut,
                existingBookings
              );

              if (conflict.hasConflict) {
                throw new Error(conflict.reason || "Phòng này đã có khách đặt trong khoảng ngày bạn chọn.");
              }

              // 4. Server-side Verified Pricing (prevents client price tampering)
              const pricing = calculateBookingPrice({
                pricePerNight: room.pricePerNight,
                maxAdults: room.maxAdults,
                maxChildren: room.maxChildren,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                adults: input.adults,
                children: input.children,
              });

              const codeSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
              const bookingCode = `MDALAT-${Date.now().toString().slice(-4)}${codeSuffix}`;
              const userId = ctx.session?.user?.id ?? null;

              const [newBooking] = await tx
                .insert(bookings)
                .values({
                  bookingCode,
                  userId,
                  roomId: input.roomId,
                  customerName: safeCustomerName,
                  customerEmail: input.customerEmail.trim().toLowerCase(),
                  customerPhone: input.customerPhone.trim(),
                  checkIn: input.checkIn,
                  checkOut: input.checkOut,
                  adults: input.adults,
                  children: input.children,
                  totalNights: pricing.nights,
                  totalPrice: pricing.totalPrice,
                  specialRequests: safeSpecialRequests,
                  status: "confirmed",
                })
                .returning();

              if (!newBooking) {
                throw new Error("Không thể khởi tạo đơn đặt phòng, vui lòng thử lại.");
              }

              return {
                ...newBooking,
                pricingBreakdown: pricing,
              };
            });
          }
        );
      } finally {
        // 5. Invalidate Room & Booking Cache in Redis immediately
        await redisCache.delPrefix("rooms:*");
        await redisCache.delPrefix("bookings:*");
      }
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
      const [booking] = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .limit(1);

      if (!booking || booking.userId !== ctx.session.user.id) {
        throw new Error("Không tìm thấy đơn đặt phòng hoặc bạn không có quyền huỷ.");
      }

      await ctx.db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(eq(bookings.id, input.id));

      // Invalidate room cache in Redis so room is freed immediately
      await redisCache.delPrefix("rooms:*");
      await redisCache.delPrefix("bookings:*");

      return { success: true };
    }),

  // Admin Procedures
  getAll: staffProcedure.query(async ({ ctx }) => {
    const all = await ctx.db.query.bookings.findMany({
      with: {
        room: true,
      },
      orderBy: [desc(bookings.createdAt)],
    });

    return all;
  }),

  /**
   * Live Room Occupancy Dashboard for Staff & Admin
   */
  getRoomOccupancyOverview: staffProcedure.query(async ({ ctx }) => {
    const allRooms = await ctx.db.select().from(rooms);
    const allBookings = await ctx.db.select().from(bookings);
    const today = getTodayIsoDate();

    const roomStatusList = allRooms.map((room) => {
      const occupancy = getRoomTodayOccupancy(room, allBookings, today);
      return {
        room,
        occupancy,
      };
    });

    // Compute KPI stats
    const totalRooms = allRooms.length;
    const occupiedCount = roomStatusList.filter((r) => r.occupancy.status === "occupied").length;
    const arrivingTodayCount = roomStatusList.filter((r) => r.occupancy.status === "arriving_today").length;
    const departingTodayCount = roomStatusList.filter((r) => r.occupancy.status === "departing_today").length;
    const maintenanceCount = roomStatusList.filter((r) => r.occupancy.status === "maintenance").length;
    const availableCount = roomStatusList.filter((r) => r.occupancy.status === "available").length;

    return {
      today,
      totalRooms,
      occupiedCount,
      arrivingTodayCount,
      departingTodayCount,
      maintenanceCount,
      availableCount,
      rooms: roomStatusList,
    };
  }),

  updateStatus: staffProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["confirmed", "checked_in", "completed", "cancelled", "pending"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.id));

      // Invalidate room cache in Redis
      await redisCache.delPrefix("rooms:*");
      await redisCache.delPrefix("bookings:*");

      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(bookings).where(eq(bookings.id, input.id));

      await redisCache.delPrefix("rooms:*");
      await redisCache.delPrefix("bookings:*");

      return { success: true };
    }),
});
