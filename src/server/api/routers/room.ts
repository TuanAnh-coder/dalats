import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { rooms, bookings } from "~/server/db/schema";
import { seedRooms } from "~/server/db/seed";

export const roomRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    let allRooms = await ctx.db.select().from(rooms);
    if (allRooms.length === 0) {
      await seedRooms();
      allRooms = await ctx.db.select().from(rooms);
    }
    return allRooms;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db
        .select()
        .from(rooms)
        .where(eq(rooms.slug, input.slug))
        .get();

      return room ?? null;
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
        if (input.checkIn && input.checkOut) {
          isBooked = allBookings.some((b) => {
            if (b.roomId !== room.id || b.status === "cancelled") return false;
            return b.checkIn < input.checkOut! && b.checkOut > input.checkIn!;
          });
        }

        const isAvailableForDates = room.isAvailable && !isBooked;

        // Agoda-style pricing & promotion intelligence
        const originalPrice = room.originalPrice || Math.round(room.pricePerNight * 1.25);
        const discountPercent = Math.max(0, Math.round(((originalPrice - room.pricePerNight) / originalPrice) * 100));

        // Agoda urgency & social proof badges
        const recentBookingsCount = (room.id * 3) % 7 + 1; // 1-7 bookings in 24h
        const reviewScore = Number((9.2 + ((room.id * 7) % 7) * 0.1).toFixed(1)); // 9.2 - 9.8
        const reviewCount = 85 + (room.id * 17) % 95; // 85-180 reviews

        return {
          ...room,
          matchesFloor,
          matchesBed,
          matchesPrice,
          fitsCapacity,
          isBooked,
          isAvailableForDates,
          totalNights,
          totalEstimatedPrice: room.pricePerNight * totalNights,
          originalPrice,
          discountPercent,
          reviewScore,
          reviewCount,
          ratingText: reviewScore >= 9.5 ? "Xuất sắc" : "Tuyệt vời",
          recentBookingsCount,
          freeCancellation: true,
          breakfastIncluded: true,
          urgencyBadge: isBooked
            ? "Đã hết phòng trong ngày chọn"
            : !room.isAvailable
            ? "Đang bảo trì"
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

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Tên phòng tối thiểu 2 ký tự"),
        roomNumber: z.string().min(1, "Số phòng không được để trống"),
        slug: z.string().optional(),
        area: z.number().min(10, "Diện tích tối thiểu 10m²"),
        maxAdults: z.number().min(1).default(2),
        maxChildren: z.number().default(2),
        bedType: z.string().default("1 Giường Queen"),
        viewType: z.string().default("Sân vườn"),
        pricePerNight: z.number().min(100000, "Đơn giá tối thiểu 100.000₫"),
        originalPrice: z.number().optional(),
        image: z.string().min(1, "Đường dẫn ảnh chính không được để trống"),
        gallery: z.array(z.string()).optional(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        amenities: z.array(z.string()).optional(),
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

      return newRoom;
    }),

  update: publicProcedure
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
        pricePerNight: z.number().optional(),
        originalPrice: z.number().optional(),
        image: z.string().optional(),
        gallery: z.array(z.string()).optional(),
        shortDescription: z.string().optional(),
        description: z.string().optional(),
        amenities: z.array(z.string()).optional(),
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

      return { success: true };
    }),

  toggleAvailability: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.select().from(rooms).where(eq(rooms.id, input.id)).get();
      if (!room) throw new Error("Không tìm thấy phòng");

      await ctx.db
        .update(rooms)
        .set({ isAvailable: !room.isAvailable })
        .where(eq(rooms.id, input.id));

      return { success: true, isAvailable: !room.isAvailable };
    }),

  delete: publicProcedure
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
        return { success: true, message: "Phòng có đơn đặt, đã chuyển sang trạng thái tạm ngưng bán." };
      }

      await ctx.db.delete(rooms).where(eq(rooms.id, input.id));
      return { success: true, message: "Đã xóa phòng thành công." };
    }),
});

