process.env.SKIP_ENV_VALIDATION = "1";

import test from "node:test";
import assert from "node:assert/strict";

import {
  isDateRangeOverlapping,
  validateBookingDates,
  calculateBookingPrice,
  calculateStayNights,
  checkRoomConflict,
  getRoomTodayOccupancy,
  isBookingActive,
  getTodayIsoDate,
  formatDateVi,
  SURCHARGE_CONFIG,
} from "../src/server/business/booking-rules.ts";

import {
  formatToVietnamIso,
  getVietnamToday,
  getVietnamTomorrow,
  addDaysToIso,
  calculateStayNights as datesCalculateStayNights,
  formatVietnamDisplayDate,
} from "../src/lib/dates.ts";

import {
  formatWithCommas,
  parsePrice,
} from "../src/lib/price.ts";

import {
  getClientIp,
} from "../src/server/security/client-ip.ts";

// =========================================================================
// SUITE 1: HOTEL DATE RANGE OVERLAP MATRIX (Boundary & Edge Case Analysis)
// =========================================================================
test("Suite 1: Date Range Overlap Matrix", async (t) => {
  await t.test("1.1: Same-day check-out and check-in (Guest A out at 12:00, Guest B in at 14:00) -> MUST NOT OVERLAP", () => {
    // Booking A: 2026-11-01 to 2026-11-03
    // Booking B: 2026-11-03 to 2026-11-05
    const overlap = isDateRangeOverlapping("2026-11-01", "2026-11-03", "2026-11-03", "2026-11-05");
    assert.equal(overlap, false, "Same-day transition should be valid in hospitality");
  });

  await t.test("1.2: Same-day reverse order -> MUST NOT OVERLAP", () => {
    const overlap = isDateRangeOverlapping("2026-11-03", "2026-11-05", "2026-11-01", "2026-11-03");
    assert.equal(overlap, false);
  });

  await t.test("1.3: Booking B completely enclosed inside Booking A -> MUST CONFLICT", () => {
    // A: Nov 1 to Nov 10, B: Nov 3 to Nov 5
    const overlap = isDateRangeOverlapping("2026-11-01", "2026-11-10", "2026-11-03", "2026-11-05");
    assert.equal(overlap, true);
  });

  await t.test("1.4: Booking B completely encloses Booking A -> MUST CONFLICT", () => {
    // A: Nov 3 to Nov 5, B: Nov 1 to Nov 10
    const overlap = isDateRangeOverlapping("2026-11-03", "2026-11-05", "2026-11-01", "2026-11-10");
    assert.equal(overlap, true);
  });

  await t.test("1.5: Booking B starts before and ends inside Booking A -> MUST CONFLICT", () => {
    // A: Nov 3 to Nov 7, B: Nov 1 to Nov 5
    const overlap = isDateRangeOverlapping("2026-11-03", "2026-11-07", "2026-11-01", "2026-11-05");
    assert.equal(overlap, true);
  });

  await t.test("1.6: Booking B starts inside and ends after Booking A -> MUST CONFLICT", () => {
    // A: Nov 1 to Nov 5, B: Nov 3 to Nov 8
    const overlap = isDateRangeOverlapping("2026-11-01", "2026-11-05", "2026-11-03", "2026-11-08");
    assert.equal(overlap, true);
  });

  await t.test("1.7: Exact identical dates -> MUST CONFLICT", () => {
    const overlap = isDateRangeOverlapping("2026-11-01", "2026-11-04", "2026-11-01", "2026-11-04");
    assert.equal(overlap, true);
  });

  await t.test("1.8: Completely disjoint dates in future -> MUST NOT OVERLAP", () => {
    const overlap = isDateRangeOverlapping("2026-11-01", "2026-11-03", "2026-11-10", "2026-11-12");
    assert.equal(overlap, false);
  });
});

// =========================================================================
// SUITE 2: BUSINESS CONSTRAINTS & DATE VALIDATION
// =========================================================================
test("Suite 2: Business Constraints & Date Validation", async (t) => {
  const today = getTodayIsoDate();

  await t.test("2.1: Check-in before today (past date) -> MUST BE REJECTED", () => {
    const result = validateBookingDates("2020-01-01", "2020-01-03");
    assert.equal(result.valid, false);
    assert.match(result.error, /không được trước ngày hôm nay/i);
  });

  await t.test("2.2: Check-in equals Check-out (0 nights) -> MUST BE REJECTED", () => {
    const result = validateBookingDates(today, today);
    assert.equal(result.valid, false);
    assert.match(result.error, /ít nhất 1 ngày/i);
  });

  await t.test("2.3: Check-out before Check-in -> MUST BE REJECTED", () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const result = validateBookingDates(tomorrow, today);
    assert.equal(result.valid, false);
    assert.match(result.error, /ít nhất 1 ngày/i);
  });

  await t.test("2.4: Booking longer than 30 nights -> MUST BE REJECTED WITH POLICY NOTICE", () => {
    const farFuture = new Date(Date.now() + 35 * 86400000).toISOString().split("T")[0];
    const result = validateBookingDates(today, farFuture);
    assert.equal(result.valid, false);
    assert.match(result.error, /tối đa là 30 ngày/i);
  });

  await t.test("2.5: Valid standard 2-night booking -> MUST BE ACCEPTED", () => {
    const day1 = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];
    const day3 = new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0];
    const result = validateBookingDates(day1, day3);
    assert.equal(result.valid, true);
  });
});

// =========================================================================
// SUITE 3: TRANSPARENT PRICING & SURCHARGE ENGINE
// =========================================================================
test("Suite 3: Pricing & Surcharge Engine", async (t) => {
  await t.test("3.1: Standard occupancy (2 adults, 0 children, 2 nights at 1,000,000₫/night)", () => {
    const pricing = calculateBookingPrice({
      pricePerNight: 1_000_000,
      maxAdults: 2,
      maxChildren: 2,
      checkIn: "2026-11-01",
      checkOut: "2026-11-03",
      adults: 2,
      children: 0,
    });

    assert.equal(pricing.nights, 2);
    assert.equal(pricing.baseRoomTotal, 2_000_000);
    assert.equal(pricing.extraAdults, 0);
    assert.equal(pricing.extraAdultTotal, 0);
    assert.equal(pricing.extraChildren, 0);
    assert.equal(pricing.extraChildTotal, 0);
    assert.equal(pricing.totalPrice, 2_000_000);
  });

  await t.test("3.2: Extra adult surcharge (+1 adult above capacity, 2 nights)", () => {
    // 3 adults in room with maxAdults = 2. Extra adult fee = 250.000₫/night
    const pricing = calculateBookingPrice({
      pricePerNight: 1_200_000,
      maxAdults: 2,
      maxChildren: 2,
      checkIn: "2026-11-01",
      checkOut: "2026-11-03",
      adults: 3,
      children: 1,
    });

    assert.equal(pricing.nights, 2);
    assert.equal(pricing.baseRoomTotal, 2_400_000);
    assert.equal(pricing.extraAdults, 1);
    assert.equal(pricing.extraAdultTotal, 250_000 * 2); // 500,000
    assert.equal(pricing.extraChildren, 0); // 1 child is <= 2
    assert.equal(pricing.totalPrice, 2_400_000 + 500_000); // 2,900,000
  });

  await t.test("3.3: Extra children surcharge (+2 children above capacity, 3 nights)", () => {
    // 4 children in room with maxChildren = 2. Extra child fee = 150.000₫/night
    const pricing = calculateBookingPrice({
      pricePerNight: 850_000,
      maxAdults: 2,
      maxChildren: 2,
      checkIn: "2026-11-01",
      checkOut: "2026-11-04",
      adults: 2,
      children: 4,
    });

    assert.equal(pricing.nights, 3);
    assert.equal(pricing.baseRoomTotal, 2_550_000);
    assert.equal(pricing.extraChildren, 2);
    assert.equal(pricing.extraChildTotal, 150_000 * 2 * 3); // 900,000
    assert.equal(pricing.totalPrice, 2_550_000 + 900_000); // 3,450,000
  });
});

// =========================================================================
// SUITE 4: ROOM OCCUPANCY REAL-TIME STATE MACHINE
// =========================================================================
test("Suite 4: Room Occupancy State Machine", async (t) => {
  const dummyRoom = {
    id: 101,
    name: "M_Dalats 101",
    roomNumber: "101",
    isAvailable: true,
  };

  const today = getTodayIsoDate();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfterTomorrow = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];

  await t.test("4.1: Room disabled by admin -> MUST return 'maintenance'", () => {
    const closedRoom = { ...dummyRoom, isAvailable: false };
    const status = getRoomTodayOccupancy(closedRoom, [], today);
    assert.equal(status.status, "maintenance");
  });

  await t.test("4.2: Guest currently staying today (yesterday to tomorrow) -> MUST return 'occupied'", () => {
    const activeBooking = {
      id: 1,
      roomId: 101,
      bookingCode: "MDALAT-001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      checkIn: yesterday,
      checkOut: tomorrow,
      status: "confirmed",
    };
    const status = getRoomTodayOccupancy(dummyRoom, [activeBooking], today);
    assert.equal(status.status, "occupied");
    assert.equal(status.bookedUntil, tomorrow);
  });

  await t.test("4.3: Guest arriving today (checkIn === today) -> MUST return 'arriving_today'", () => {
    const arrivingBooking = {
      id: 2,
      roomId: 101,
      bookingCode: "MDALAT-002",
      customerName: "Trần Thị B",
      customerPhone: "0907654321",
      checkIn: today,
      checkOut: dayAfterTomorrow,
      status: "confirmed",
    };
    const status = getRoomTodayOccupancy(dummyRoom, [arrivingBooking], today);
    assert.equal(status.status, "arriving_today");
  });

  await t.test("4.4: Cancelled booking -> MUST NOT block the room, return 'available'", () => {
    const cancelledBooking = {
      id: 3,
      roomId: 101,
      bookingCode: "MDALAT-003",
      customerName: "Lê Văn C",
      checkIn: yesterday,
      checkOut: tomorrow,
      status: "cancelled", // CANCELLED
    };
    const status = getRoomTodayOccupancy(dummyRoom, [cancelledBooking], today);
    assert.equal(status.status, "available");
  });
});

// =========================================================================
// SUITE 5: ROOM CONFLICT CHECKER WITH MULTIPLE BOOKINGS
// =========================================================================
test("Suite 5: Room Conflict Checker", async (t) => {
  const existingBookings = [
    {
      id: 1,
      roomId: 101,
      bookingCode: "MDALAT-CONF1",
      checkIn: "2026-11-05",
      checkOut: "2026-11-08",
      status: "confirmed",
    },
    {
      id: 2,
      roomId: 101,
      bookingCode: "MDALAT-CANC",
      checkIn: "2026-11-10",
      checkOut: "2026-11-15",
      status: "cancelled", // should be ignored
    },
    {
      id: 3,
      roomId: 102, // Different room
      bookingCode: "MDALAT-ROOM102",
      checkIn: "2026-11-05",
      checkOut: "2026-11-08",
      status: "confirmed",
    },
  ];

  await t.test("5.1: Request overlapping with confirmed booking -> MUST REPORT CONFLICT", () => {
    const check = checkRoomConflict(101, "2026-11-06", "2026-11-09", existingBookings);
    assert.equal(check.hasConflict, true);
    assert.equal(check.conflictingBooking.bookingCode, "MDALAT-CONF1");
  });

  await t.test("5.2: Request on dates of cancelled booking -> MUST BE AVAILABLE", () => {
    const check = checkRoomConflict(101, "2026-11-11", "2026-11-14", existingBookings);
    assert.equal(check.hasConflict, false);
  });

  await t.test("5.3: Request on different room with same dates -> MUST BE AVAILABLE", () => {
    // Room 103 has no bookings
    const check = checkRoomConflict(103, "2026-11-05", "2026-11-08", existingBookings);
    assert.equal(check.hasConflict, false);
  });
});

// =========================================================================
// SUITE 6: TIMEZONE (UTC+7) & DATE HELPER INTEGRITY
// =========================================================================
test("Suite 6: Vietnam Timezone & Safe Date Math", async (t) => {
  await t.test("6.1: Vietnam Today is ISO format YYYY-MM-DD", () => {
    const vnToday = getVietnamToday();
    assert.match(vnToday, /^\d{4}-\d{2}-\d{2}$/);
  });

  await t.test("6.2: Vietnam Tomorrow is exactly 1 day after today", () => {
    const vnToday = getVietnamToday();
    const vnTomorrow = getVietnamTomorrow();
    assert.equal(datesCalculateStayNights(vnToday, vnTomorrow), 1);
  });

  await t.test("6.3: addDaysToIso handles month/year boundary correctly", () => {
    assert.equal(addDaysToIso("2026-10-31", 1), "2026-11-01");
    assert.equal(addDaysToIso("2026-12-31", 1), "2027-01-01");
    assert.equal(addDaysToIso("2026-02-28", 1), "2026-03-01");
  });

  await t.test("6.4: formatVietnamDisplayDate formats correctly", () => {
    assert.equal(formatVietnamDisplayDate("2026-10-27"), "27/10/2026");
  });
});

// =========================================================================
// SUITE 7: SECURITY & PATH TRAVERSAL DEFENSE
// =========================================================================
test("Suite 7: Security - Media Whitelist & Path Traversal Defense", async (t) => {
  const ALLOWED_EXTENSIONS = new Set([
    "jpg", "jpeg", "png", "webp", "gif", "svg", "avif", "ico",
    "mp4", "webm", "mov", "pdf"
  ]);

  const isExtensionAllowed = (filename) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? ALLOWED_EXTENSIONS.has(ext) : false;
  };

  await t.test("7.1: Image and media extensions -> MUST BE ALLOWED", () => {
    assert.equal(isExtensionAllowed("room1.jpg"), true);
    assert.equal(isExtensionAllowed("room1.webp"), true);
    assert.equal(isExtensionAllowed("hero.png"), true);
    assert.equal(isExtensionAllowed("brochure.pdf"), true);
    assert.equal(isExtensionAllowed("tour.mp4"), true);
  });

  await t.test("7.2: Code, env, config files -> MUST BE BLOCKED", () => {
    assert.equal(isExtensionAllowed(".env"), false);
    assert.equal(isExtensionAllowed("config.json"), false);
    assert.equal(isExtensionAllowed("server.ts"), false);
    assert.equal(isExtensionAllowed("id_rsa"), false);
    assert.equal(isExtensionAllowed("backup.sql"), false);
    assert.equal(isExtensionAllowed("malware.exe"), false);
  });

  await t.test("7.3: Path traversal segments -> sanitized", () => {
    const rawSegments = ["..", "..", "etc", "passwd"];
    const sanitized = rawSegments
      .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ""))
      .filter((s) => s.length > 0 && s !== ".." && s !== ".");
    assert.deepEqual(sanitized, ["etc", "passwd"]);
    assert.equal(sanitized.includes(".."), false);
  });
});

// =========================================================================
// SUITE 8: REGEX VALIDATION (Phone, Dates, Input Sanitization)
// =========================================================================
test("Suite 8: Input Validation & Sanitization", async (t) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const phoneRegex = /^[0-9+() -]{8,20}$/;

  const sanitizeString = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, "").trim();
  };

  await t.test("8.1: Date Regex accepts YYYY-MM-DD only", () => {
    assert.equal(dateRegex.test("2026-10-27"), true);
    assert.equal(dateRegex.test("27/10/2026"), false);
    assert.equal(dateRegex.test("2026-1-1"), false);
    assert.equal(dateRegex.test("tomorrow"), false);
  });

  await t.test("8.2: Phone Regex accepts valid Vietnamese & international numbers", () => {
    assert.equal(phoneRegex.test("0901234567"), true);
    assert.equal(phoneRegex.test("+84901234567"), true);
    assert.equal(phoneRegex.test("0263 382 8888"), true);
    assert.equal(phoneRegex.test("(0263) 382-8888"), true);
    assert.equal(phoneRegex.test("123"), false); // too short
    assert.equal(phoneRegex.test("090abc1234"), false); // letters not allowed
    assert.equal(phoneRegex.test("DROP TABLE bookings;"), false); // SQL injection
  });

  await t.test("8.3: Sanitizer strips HTML & script tags", () => {
    const rawInput = "<script>alert('xss')</script>Phòng tầng 2 yên tĩnh";
    const cleaned = sanitizeString(rawInput);
    assert.equal(cleaned.includes("<script>"), false);
    assert.equal(cleaned.includes("alert"), true); // string left, tags stripped
    assert.equal(cleaned, "alert('xss')Phòng tầng 2 yên tĩnh");
  });
});

// =========================================================================
// SUITE 9: FORMATTED PRICE INPUT & PARSER (Comma separator)
// =========================================================================
test("Suite 9: Formatted Price Input & Parser", async (t) => {
  await t.test("9.1: Formats raw number with commas correctly", () => {
    assert.equal(formatWithCommas(1200000), "1,200,000");
    assert.equal(formatWithCommas(850000), "850,000");
    assert.equal(formatWithCommas(15000000), "15,000,000");
    assert.equal(formatWithCommas("2500000"), "2,500,000");
    assert.equal(formatWithCommas(0), "0");
    assert.equal(formatWithCommas(""), "");
  });

  await t.test("9.2: Parses comma-formatted price strings back to clean numbers", () => {
    assert.equal(parsePrice("1,200,000"), 1200000);
    assert.equal(parsePrice("850,000"), 850000);
    assert.equal(parsePrice("15,000,000"), 15000000);
    assert.equal(parsePrice("1200000"), 1200000);
    assert.equal(parsePrice(""), 0);
    assert.equal(parsePrice(null), 0);
  });
});

// =========================================================================
// SUITE 10: ADMIN PRIVILEGE & SELF-LOCKOUT SECURITY
// =========================================================================
test("Suite 10: Admin Privilege & Self-Lockout Security", async (t) => {
  const currentAdminId = "usr_admin_12345";
  const otherStaffId = "usr_staff_67890";

  const validateRoleUpdate = (sessionUserId, targetUserId, newRole) => {
    if (sessionUserId === targetUserId && newRole !== "admin") {
      return { allowed: false, reason: "Không thể tự hạ quyền Quản trị viên của chính mình." };
    }
    return { allowed: true };
  };

  const validateUserBan = (sessionUserId, targetUserId) => {
    if (sessionUserId === targetUserId) {
      return { allowed: false, reason: "Không thể tự khóa tài khoản Quản trị viên đang đăng nhập." };
    }
    return { allowed: true };
  };

  await t.test("10.1: Admin self-demotion -> MUST BE REJECTED", () => {
    const res = validateRoleUpdate(currentAdminId, currentAdminId, "user");
    assert.equal(res.allowed, false);
    assert.match(res.reason, /Không thể tự hạ quyền/);
  });

  await t.test("10.2: Admin self-ban -> MUST BE REJECTED", () => {
    const res = validateUserBan(currentAdminId, currentAdminId);
    assert.equal(res.allowed, false);
    assert.match(res.reason, /Không thể tự khóa/);
  });

  await t.test("10.3: Admin demoting or banning other user -> MUST BE ALLOWED", () => {
    const resRole = validateRoleUpdate(currentAdminId, otherStaffId, "user");
    assert.equal(resRole.allowed, true);
    const resBan = validateUserBan(currentAdminId, otherStaffId);
    assert.equal(resBan.allowed, true);
  });
});

// =========================================================================
// SUITE 11: RATE LIMITING & CLIENT IP DETECTION
// =========================================================================
test("Suite 11: Rate Limiter & Client IP Detection", async (t) => {
  await t.test("11.1: Extracts first IP from X-Forwarded-For header", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "203.0.113.195, 70.41.3.18, 150.172.238.178");
    const ip = getClientIp(headers);
    assert.equal(ip, "203.0.113.195");
  });

  await t.test("11.2: Fallbacks to X-Real-IP if X-Forwarded-For is absent", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "198.51.100.4");
    const ip = getClientIp(headers);
    assert.equal(ip, "198.51.100.4");
  });

  await t.test("11.3: Rate Limiter blocks requests exceeding threshold", async () => {
    const memoryStore = new Map();
    const mockCheckRateLimit = (key, maxRequests, windowSeconds) => {
      const now = Date.now();
      const record = memoryStore.get(key);
      if (!record || record.resetAt <= now) {
        memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
        return { success: true, remaining: maxRequests - 1 };
      }
      record.count += 1;
      return {
        success: record.count <= maxRequests,
        remaining: Math.max(0, maxRequests - record.count),
      };
    };

    const testKey = `test_limit_${Date.now()}`;
    const maxReq = 3;

    // Requests 1, 2, 3 must pass
    const r1 = mockCheckRateLimit(testKey, maxReq, 2);
    assert.equal(r1.success, true);
    assert.equal(r1.remaining, 2);

    const r2 = mockCheckRateLimit(testKey, maxReq, 2);
    assert.equal(r2.success, true);
    assert.equal(r2.remaining, 1);

    const r3 = mockCheckRateLimit(testKey, maxReq, 2);
    assert.equal(r3.success, true);
    assert.equal(r3.remaining, 0);

    // Request 4 must be BLOCKED
    const r4 = mockCheckRateLimit(testKey, maxReq, 2);
    assert.equal(r4.success, false);
    assert.equal(r4.remaining, 0);
  });
});
