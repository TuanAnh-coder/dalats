/**
 * M_Dalats Boutique Villa - Date & Time Utilities
 * Standardized date helpers adhering to Asia/Ho_Chi_Minh (UTC+7) timezone.
 */

const VIETNAM_TZ = "Asia/Ho_Chi_Minh";

/**
 * Format any Date object to 'YYYY-MM-DD' in Vietnam Timezone
 */
export function formatToVietnamIso(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: VIETNAM_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    // Fallback if Intl timeZone is unsupported
    const offset = 7 * 60; // minutes
    const local = new Date(date.getTime() + (offset + date.getTimezoneOffset()) * 60000);
    return local.toISOString().split("T")[0]!;
  }
}

/**
 * Get today's date string in Vietnam timezone ('YYYY-MM-DD')
 */
export function getVietnamToday(): string {
  return formatToVietnamIso(new Date());
}

/**
 * Get tomorrow's date string in Vietnam timezone ('YYYY-MM-DD')
 */
export function getVietnamTomorrow(offsetDays = 1): string {
  return addDaysToIso(getVietnamToday(), offsetDays);
}

/**
 * Add or subtract days from an ISO date ('YYYY-MM-DD') safely
 */
export function addDaysToIso(isoDate: string, days: number): string {
  const parts = isoDate.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().split("T")[0]!;
}

/**
 * Calculate difference in nights between check-in and check-out
 */
export function calculateStayNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut || checkIn >= checkOut) return 1;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * Format an ISO date ('YYYY-MM-DD') into friendly Vietnamese format ('DD/MM/YYYY')
 */
export function formatVietnamDisplayDate(isoDate: string): string {
  if (!isoDate || !isoDate.includes("-")) return isoDate;
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}
