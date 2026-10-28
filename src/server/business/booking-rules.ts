import type { Booking, Room } from "~/server/db/schema";

/**
 * M_Dalats Boutique Villa - Core Hospitality Business Logic
 * Production-ready room availability, pricing, conflict detection, and status transitions.
 */

// Surcharge policies
export const SURCHARGE_CONFIG = {
  EXTRA_ADULT_PER_NIGHT: 250_000, // 250.000₫ / người lớn thêm / đêm (kèm nệm phụ & ăn sáng)
  EXTRA_CHILD_PER_NIGHT: 150_000, // 150.000₫ / trẻ em thêm / đêm (kèm ăn sáng)
  CHECK_IN_TIME: "14:00",
  CHECK_OUT_TIME: "12:00",
  MAX_STAY_DAYS: 30,
};

/**
 * Returns current date in YYYY-MM-DD format (respects GMT+7 Indochina Time)
 */
export function getTodayIsoDate(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    const now = new Date();
    // Adjust to Indochina Time (UTC+7)
    const utcOffset = 7 * 60; // 7 hours in minutes
    const localTime = new Date(now.getTime() + (utcOffset + now.getTimezoneOffset()) * 60000);
    return localTime.toISOString().split("T")[0]!;
  }
}

/**
 * Calculates number of nights between check-in and check-out
 */
export function calculateStayNights(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Hotel Industry Standard: Check if two date ranges overlap.
 * Rule: Check-out date does NOT conflict with Check-in date on the same day.
 * (e.g. Guest A check-out at 12:00, Guest B check-in at 14:00 is VALID)
 */
export function isDateRangeOverlapping(
  checkInA: string,
  checkOutA: string,
  checkInB: string,
  checkOutB: string
): boolean {
  return checkInA < checkOutB && checkOutA > checkInB;
}

/**
 * Determines if a booking holds/locks the room
 */
export function isBookingActive(status: string): boolean {
  return status === "confirmed" || status === "checked_in" || status === "pending";
}

export interface PricingBreakdown {
  nights: number;
  pricePerNight: number;
  baseRoomTotal: number;
  extraAdults: number;
  extraAdultFeePerNight: number;
  extraAdultTotal: number;
  extraChildren: number;
  extraChildFeePerNight: number;
  extraChildTotal: number;
  totalPrice: number;
}

/**
 * Transparent 5-star pricing engine
 */
export function calculateBookingPrice(params: {
  pricePerNight: number;
  maxAdults: number;
  maxChildren: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}): PricingBreakdown {
  const nights = calculateStayNights(params.checkIn, params.checkOut);
  const baseRoomTotal = params.pricePerNight * nights;

  const extraAdults = Math.max(0, params.adults - params.maxAdults);
  const extraAdultFeePerNight = extraAdults * SURCHARGE_CONFIG.EXTRA_ADULT_PER_NIGHT;
  const extraAdultTotal = extraAdultFeePerNight * nights;

  const extraChildren = Math.max(0, params.children - params.maxChildren);
  const extraChildFeePerNight = extraChildren * SURCHARGE_CONFIG.EXTRA_CHILD_PER_NIGHT;
  const extraChildTotal = extraChildFeePerNight * nights;

  const totalPrice = baseRoomTotal + extraAdultTotal + extraChildTotal;

  return {
    nights,
    pricePerNight: params.pricePerNight,
    baseRoomTotal,
    extraAdults,
    extraAdultFeePerNight,
    extraAdultTotal,
    extraChildren,
    extraChildFeePerNight,
    extraChildTotal,
    totalPrice,
  };
}

/**
 * Validates check-in & check-out dates against business constraints
 */
export function validateBookingDates(checkIn: string, checkOut: string): { valid: boolean; error?: string } {
  const today = getTodayIsoDate();

  if (checkIn < today) {
    return { valid: false, error: "Ngày nhận phòng không được trước ngày hôm nay." };
  }

  if (checkIn >= checkOut) {
    return { valid: false, error: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày." };
  }

  const nights = calculateStayNights(checkIn, checkOut);
  if (nights > SURCHARGE_CONFIG.MAX_STAY_DAYS) {
    return {
      valid: false,
      error: `Thời gian lưu trú tối đa là ${SURCHARGE_CONFIG.MAX_STAY_DAYS} ngày. Với kỳ nghỉ dài hạn, vui lòng liên hệ quản gia trực tiếp.`,
    };
  }

  return { valid: true };
}

/**
 * Checks if a specific room is available for the given dates
 */
export function checkRoomConflict(
  roomId: number,
  checkIn: string,
  checkOut: string,
  existingBookings: Booking[],
  excludeBookingId?: number
): {
  hasConflict: boolean;
  conflictingBooking: Booking | null;
  reason?: string;
} {
  const roomBookings = existingBookings.filter(
    (b) => b.roomId === roomId && isBookingActive(b.status) && b.id !== excludeBookingId
  );

  for (const b of roomBookings) {
    if (isDateRangeOverlapping(b.checkIn, b.checkOut, checkIn, checkOut)) {
      return {
        hasConflict: true,
        conflictingBooking: b,
        reason: `Phòng đã có khách đặt từ ${formatDateVi(b.checkIn)} đến ${formatDateVi(b.checkOut)} (Đơn: ${b.bookingCode}).`,
      };
    }
  }

  return { hasConflict: false, conflictingBooking: null };
}

export type RoomOccupancyStatus =
  | "maintenance" // Đang khóa / bảo trì
  | "occupied" // Đang có khách lưu trú
  | "arriving_today" // Có khách nhận phòng hôm nay
  | "departing_today" // Có khách trả phòng hôm nay
  | "available"; // Trống, sẵn sàng đón khách

export interface RoomOccupancyInfo {
  status: RoomOccupancyStatus;
  statusLabel: string;
  badgeBg: string;
  badgeText: string;
  currentBooking: Booking | null;
  todayActionHint?: string;
  bookedUntil?: string;
}

/**
 * Computes live room occupancy status for today
 */
export function getRoomTodayOccupancy(
  room: Room,
  allBookings: Booking[],
  today = getTodayIsoDate()
): RoomOccupancyInfo {
  if (!room.isAvailable) {
    return {
      status: "maintenance",
      statusLabel: "Tạm khóa / Bảo trì",
      badgeBg: "bg-stone-200 border-stone-300 text-stone-700",
      badgeText: "Đang bảo trì",
      currentBooking: null,
      todayActionHint: "Phòng đang tạm ngừng nhận khách",
    };
  }

  const roomBookings = allBookings.filter((b) => b.roomId === room.id && isBookingActive(b.status));

  // 1. Check if guest is physically checked-in today
  const checkedInGuest = roomBookings.find((b) => b.status === "checked_in");
  if (checkedInGuest) {
    if (checkedInGuest.checkOut === today) {
      return {
        status: "departing_today",
        statusLabel: "Khách trả phòng hôm nay",
        badgeBg: "bg-blue-100 border-blue-300 text-blue-900",
        badgeText: "Trả phòng hôm nay",
        currentBooking: checkedInGuest,
        todayActionHint: `Khách ${checkedInGuest.customerName} trả phòng trước 12:00`,
        bookedUntil: checkedInGuest.checkOut,
      };
    }
    return {
      status: "occupied",
      statusLabel: "Đang có khách lưu trú",
      badgeBg: "bg-rose-100 border-rose-300 text-rose-800",
      badgeText: `Đang ở (đến ${formatDateVi(checkedInGuest.checkOut)})`,
      currentBooking: checkedInGuest,
      todayActionHint: `Khách: ${checkedInGuest.customerName} (${checkedInGuest.customerPhone})`,
      bookedUntil: checkedInGuest.checkOut,
    };
  }

  // 2. Check if staying across today from a previous date: checkIn < today && today < checkOut
  const stayOverGuest = roomBookings.find((b) => b.checkIn < today && today < b.checkOut);
  if (stayOverGuest) {
    return {
      status: "occupied",
      statusLabel: "Đang có khách lưu trú",
      badgeBg: "bg-rose-100 border-rose-300 text-rose-800",
      badgeText: `Đang có khách (đến ${formatDateVi(stayOverGuest.checkOut)})`,
      currentBooking: stayOverGuest,
      todayActionHint: `Khách: ${stayOverGuest.customerName} (${stayOverGuest.customerPhone})`,
      bookedUntil: stayOverGuest.checkOut,
    };
  }

  // 3. Check if arriving today: checkIn === today (and not checked in yet)
  const arrivingToday = roomBookings.find((b) => b.checkIn === today);
  if (arrivingToday) {
    return {
      status: "arriving_today",
      statusLabel: "Check-in hôm nay",
      badgeBg: "bg-amber-100 border-amber-300 text-amber-900",
      badgeText: "Sắp đón khách hôm nay",
      currentBooking: arrivingToday,
      todayActionHint: `Khách ${arrivingToday.customerName} nhận phòng sau 14:00`,
      bookedUntil: arrivingToday.checkOut,
    };
  }

  // 4. Check if departing today: checkOut === today
  const departingToday = roomBookings.find((b) => b.checkOut === today);
  if (departingToday) {
    return {
      status: "departing_today",
      statusLabel: "Khách trả phòng hôm nay",
      badgeBg: "bg-blue-100 border-blue-300 text-blue-900",
      badgeText: "Trả phòng hôm nay",
      currentBooking: departingToday,
      todayActionHint: `Khách ${departingToday.customerName} trả phòng trước 12:00`,
    };
  }

  return {
    status: "available",
    statusLabel: "Phòng trống sẵn sàng",
    badgeBg: "bg-emerald-100 border-emerald-300 text-emerald-800",
    badgeText: "Sẵn sàng đón khách",
    currentBooking: null,
    todayActionHint: "Sẵn sàng nhận khách mới",
  };
}

/**
 * Format YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDateVi(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}
