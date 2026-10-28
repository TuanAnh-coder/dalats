import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
  staffProcedure,
} from "~/server/api/trpc";
import { rooms, bookings } from "~/server/db/schema";
import { seedRooms } from "~/server/db/seed";
import { redisCache } from "~/server/redis";
import {
  calculateBookingPrice,
  calculateStayNights,
  formatDateVi,
  getRoomTodayOccupancy,
  getTodayIsoDate,
  isBookingActive,
  isDateRangeOverlapping,
} from "~/server/business/booking-rules";

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await redisCache.getOrSet(
      "rooms:all:enriched",
      async () => {
        let allRooms = await ctx.db.select().from(rooms);
        if (allRooms.length === 0) {
          await seedRooms();
          allRooms = await ctx.db.select().from(rooms);
        }

        const allBookings = await ctx.db.select().from(bookings);
        const today = getTodayIsoDate();

        return allRooms.map((room) => {
          const occupancy = getRoomTodayOccupancy(room, allBookings, today);
          return {
            ...room,
            occupancy,
            isOccupiedToday: occupancy.status === "occupied",
            todayStatusLabel: occupancy.statusLabel,
            todayBadgeBg: occupancy.badgeBg,
            bookedUntil: occupancy.bookedUntil || null,
          };
        });
      },
      60 // Cache for 1 minute
    );
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [room] = await ctx.db
        .select()
        .from(rooms)
        .where(eq(rooms.slug, input.slug))
        .limit(1);

      if (!room) return null;

      const roomBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.roomId, room.id));

      const today = getTodayIsoDate();
      const occupancy = getRoomTodayOccupancy(room, roomBookings, today);

      const activeBookedRanges = roomBookings
        .filter((b) => isBookingActive(b.status) && b.checkOut >= today)
        .map((b) => ({
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
          display: `${formatDateVi(b.checkIn)} → ${formatDateVi(b.checkOut)}`,
        }));

      return {
        ...room,
        occupancy,
        isOccupiedToday: occupancy.status === "occupied",
        activeBookedRanges,
      };
    }),

  // Strictly retrieves ONLY rooms enrolled in the Flash Sale program
  getFlashSale: publicProcedure.query(async ({ ctx }) => {
    const allRooms = await ctx.db.select().from(rooms);

    // STRICT: Only rooms that are currently flagged isFlashSale === true and available
    const flashSaleRooms = allRooms.filter((r) => Boolean(r.isFlashSale) && r.isAvailable);

    return flashSaleRooms.map((room) => {
      const discount = room.flashSaleDiscount || 20;
      const originalPrice = room.originalPrice || Math.round(room.pricePerNight * 1.25);
      const flashSalePrice = room.pricePerNight;
      const savings = originalPrice - flashSalePrice;

      return {
        ...room,
        discountPercent: discount,
        originalPrice,
        flashSalePrice,
        savings,
        claimedPercent: 75 + ((room.id * 6) % 20), // 75% - 95% claimed
        stockRemaining: (room.id % 2) + 1, // 1-2 slots remaining
      };
    });
  }),

  search: publicProcedure
    .input(
      z.object({
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        adults: z.number().default(2),
        children: z.number().default(0),
        floor: z.string().optional(),
        bedType: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z
          .enum(["default", "price-asc", "price-desc", "area-desc", "rating-desc", "popular"])
          .default("default"),
      })
    )
    .query(async ({ ctx, input }) => {
      let allRooms = await ctx.db.select().from(rooms);
      if (allRooms.length === 0) {
        await seedRooms();
        allRooms = await ctx.db.select().from(rooms);
      }

      const allBookings = await ctx.db.select().from(bookings);

      let totalNights = 1;
      if (input.checkIn && input.checkOut) {
        const d1 = new Date(input.checkIn);
        const d2 = new Date(input.checkOut);
        const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        totalNights = Math.max(1, diffDays);
      }

      const enriched = allRooms.map((room) => {
        // Floor match
        let matchesFloor = true;
        if (input.floor && input.floor !== "all") {
          if (input.floor === "0") matchesFloor = room.roomNumber.startsWith("00") || room.roomNumber.startsWith("0");
          else if (input.floor === "1") matchesFloor = room.roomNumber.startsWith("1");
          else if (input.floor === "2") matchesFloor = room.roomNumber.startsWith("2");
        }

        // Bed type match (Agoda style filter)
        let matchesBed = true;
        if (input.bedType && input.bedType !== "all") {
          matchesBed = room.bedType.toLowerCase().includes(input.bedType.toLowerCase());
        }

        // Price range match (Agoda style filter)
        let matchesPrice = true;
        if (input.minPrice && room.pricePerNight < input.minPrice) matchesPrice = false;
        if (input.maxPrice && room.pricePerNight > input.maxPrice) matchesPrice = false;

        // Capacity match
        const fitsCapacity = room.maxAdults >= input.adults && (room.maxAdults + room.maxChildren) >= (input.adults + input.children);

        // Date conflict check
        let isBooked = false;
        let conflictingBooking: (typeof allBookings)[0] | null = null;
        if (input.checkIn && input.checkOut) {
          for (const b of allBookings) {
            if (b.roomId === room.id && isBookingActive(b.status)) {
              if (isDateRangeOverlapping(b.checkIn, b.checkOut, input.checkIn, input.checkOut)) {
                isBooked = true;
                conflictingBooking = b;
                break;
              }
            }
          }
        }

        const isAvailableForDates = room.isAvailable && !isBooked;

        // Today occupancy check
        const today = getTodayIsoDate();
        const occupancy = getRoomTodayOccupancy(room, allBookings, today);

        // Agoda-style pricing & promotion intelligence
        const pricing =
          input.checkIn && input.checkOut
            ? calculateBookingPrice({
                pricePerNight: room.pricePerNight,
                maxAdults: room.maxAdults,
                maxChildren: room.maxChildren,
                checkIn: input.checkIn,
                checkOut: input.checkOut,
                adults: input.adults,
                children: input.children,
              })
            : null;

        const originalPrice = room.originalPrice || Math.round(room.pricePerNight * 1.25);
        const discountPercent = Math.max(0, Math.round(((originalPrice - room.pricePerNight) / originalPrice) * 100));

        // Agoda urgency & social proof badges
        const recentBookingsCount = ((room.id * 3) % 7) + 1; // 1-7 bookings in 24h
        const reviewScore = Number((9.2 + ((room.id * 7) % 7) * 0.1).toFixed(1)); // 9.2 - 9.8
        const reviewCount = 85 + ((room.id * 17) % 95); // 85-180 reviews

        return {
          ...room,
          occupancy,
          isOccupiedToday: occupancy.status === "occupied",
          matchesFloor,
          matchesBed,
          matchesPrice,
          fitsCapacity,
          isBooked,
          conflictingBookingDisplay: conflictingBooking
            ? `${formatDateVi(conflictingBooking.checkIn)} → ${formatDateVi(conflictingBooking.checkOut)}`
            : null,
          isAvailableForDates,
          totalNights: pricing?.nights ?? totalNights,
          totalEstimatedPrice: pricing?.totalPrice ?? room.pricePerNight * totalNights,
          pricingBreakdown: pricing,
          originalPrice,
          discountPercent,
          reviewScore,
          reviewCount,
          ratingText: reviewScore >= 9.5 ? "Xuất sắc" : "Tuyệt vời",
          recentBookingsCount,
          freeCancellation: true,
          breakfastIncluded: true,
          urgencyBadge: isBooked
            ? `Đã hết phòng (${conflictingBooking ? formatDateVi(conflictingBooking.checkIn) + " - " + formatDateVi(conflictingBooking.checkOut) : "đã có khách"})`
            : !room.isAvailable
            ? "Đang bảo trì"
            : occupancy.status === "occupied"
            ? `Đang có khách lưu trú (trả phòng ${formatDateVi(occupancy.bookedUntil || "")})`
            : "Chỉ còn 1 phòng duy nhất với giá này!",
        };
      });

      // Filter by floor, bed, price
      let results = enriched.filter((r) => r.matchesFloor && r.matchesBed && r.matchesPrice);

      // Sort
      if (input.sortBy === "price-asc") {
        results.sort((a, b) => a.pricePerNight - b.pricePerNight);
      } else if (input.sortBy === "price-desc") {
        results.sort((a, b) => b.pricePerNight - a.pricePerNight);
      } else if (input.sortBy === "area-desc") {
        results.sort((a, b) => b.area - a.area);
      } else if (input.sortBy === "rating-desc") {
        results.sort((a, b) => b.reviewScore - a.reviewScore);
      } else if (input.sortBy === "popular") {
        results.sort((a, b) => b.recentBookingsCount - a.recentBookingsCount);
      }

      return results;
    }),

  create: staffProcedure
    .input(
      z.object({
        name: z.string().min(2, "Tên phòng tối thiểu 2 ký tự"),
        roomNumber: z.string().min(1, "Số phòng không được để trống"),
        slug: z.string().nullish(),
        area: z.number().min(10, "Diện tích tối thiểu 10m²"),
        maxAdults: z.number().min(1).default(2),
        maxChildren: z.number().default(2),
        bedType: z.string().default("1 Giường Queen"),
        viewType: z.string().default("Sân vườn"),
        pricePerNight: z
          .union([z.number(), z.string()])
          .transform((v) => (typeof v === "string" ? Number(v.replace(/,/g, "")) : v))
          .pipe(z.number().min(100000, "Đơn giá tối thiểu 100.000₫")),
        originalPrice: z
          .union([z.number(), z.string()])
          .nullish()
          .transform((v) => (typeof v === "string" ? (v ? Number(v.replace(/,/g, "")) : null) : v)),
        image: z.string().min(1, "Đường dẫn ảnh chính không được để trống"),
        gallery: z.array(z.string()).nullish(),
        shortDescription: z.string().nullish(),
        description: z.string().nullish(),
        amenities: z.array(z.string()).nullish(),
        isAvailable: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const generatedSlug =
        input.slug ||
        `mdalats-${input.roomNumber.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

      const [newRoom] = await ctx.db
        .insert(rooms)
        .values({
          name: input.name,
          slug: generatedSlug,
          roomNumber: input.roomNumber,
          area: input.area,
          maxAdults: input.maxAdults,
          maxChildren: input.maxChildren,
          bedType: input.bedType,
          viewType: input.viewType,
          pricePerNight: input.pricePerNight,
          originalPrice: input.originalPrice ?? Math.round(input.pricePerNight * 1.25),
          image: input.image,
          gallery: input.gallery ? JSON.stringify(input.gallery) : JSON.stringify([input.image]),
          shortDescription: input.shortDescription || `Phòng nghỉ sang trọng ${input.name} tại M_Dalats Villa.`,
          description: input.description || `Trải nghiệm kỳ nghỉ tuyệt vời tại M_Dalats Villa với không gian ấm cúng, view thiên nhiên và dịch vụ cao cấp.`,
          amenities: input.amenities
            ? JSON.stringify(input.amenities)
            : JSON.stringify([
                "Khóa từ hiện đại",
                "Nước nóng 24/7",
                "Máy sấy tóc",
                "Tivi thông minh",
                "Wifi tốc độ cao",
                "Trà & Cà phê miễn phí",
              ]),
          isAvailable: input.isAvailable,
        })
        .returning();

      // Invalidate room cache in Redis
      await redisCache.delPrefix("rooms:*");

      return newRoom;
    }),

  update: staffProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        roomNumber: z.string().optional(),
        area: z.number().optional(),
        maxAdults: z.number().optional(),
        maxChildren: z.number().optional(),
        bedType: z.string().optional(),
        viewType: z.string().optional(),
        pricePerNight: z
          .union([z.number(), z.string()])
          .optional()
          .transform((v) => (typeof v === "string" ? Number(v.replace(/,/g, "")) : v)),
        originalPrice: z
          .union([z.number(), z.string()])
          .nullish()
          .transform((v) => (typeof v === "string" ? (v ? Number(v.replace(/,/g, "")) : null) : v)),
        image: z.string().optional(),
        gallery: z.array(z.string()).nullish(),
        shortDescription: z.string().nullish(),
        description: z.string().nullish(),
        amenities: z.array(z.string()).nullish(),
        isAvailable: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, gallery, amenities, ...data } = input;
      const updatePayload: Record<string, unknown> = { ...data };

      if (gallery !== undefined) {
        updatePayload.gallery = JSON.stringify(gallery);
      }
      if (amenities !== undefined) {
        updatePayload.amenities = JSON.stringify(amenities);
      }

      await ctx.db
        .update(rooms)
        .set(updatePayload)
        .where(eq(rooms.id, id));

      // Invalidate room cache in Redis
      await redisCache.delPrefix("rooms:*");

      return { success: true };
    }),

  toggleAvailability: staffProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [room] = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id)).limit(1);
      if (!room) throw new Error("Không tìm thấy phòng");

      await ctx.db
        .update(rooms)
        .set({ isAvailable: !room.isAvailable })
        .where(eq(rooms.id, input.id));

      // Invalidate room cache in Redis
      await redisCache.delPrefix("rooms:*");

      return { success: true, isAvailable: !room.isAvailable };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if room has active bookings
      const activeBookings = await ctx.db
        .select()
        .from(bookings)
        .where(eq(bookings.roomId, input.id));

      if (activeBookings.some((b) => b.status === "confirmed" || b.status === "pending")) {
        // Soft delete / deactivate instead of hard delete to preserve booking references
        await ctx.db
          .update(rooms)
          .set({ isAvailable: false })
          .where(eq(rooms.id, input.id));

        // Invalidate room cache in Redis
        await redisCache.delPrefix("rooms:*");

        return { success: true, message: "Phòng có đơn đặt, đã chuyển sang trạng thái tạm ngưng bán." };
      }

      await ctx.db.delete(rooms).where(eq(rooms.id, input.id));

      // Invalidate room cache in Redis
      await redisCache.delPrefix("rooms:*");

      return { success: true, message: "Đã xóa phòng thành công." };
    }),
});

