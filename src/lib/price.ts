/**
 * M_Dalats Boutique Villa - Currency & Price Utilities
 * Formatting with thousand separators (comma ',') and robust string parsing.
 */

/**
 * Format a number or numeric string with thousand commas (e.g. 1200000 -> "1,200,000")
 */
export function formatWithCommas(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

/**
 * Cleanly parse a comma-formatted price back to number (e.g. "1,200,000" -> 1200000)
 */
export function parsePrice(value: string | unknown): number {
  if (!value) return 0;
  const cleaned = String(value).replace(/,/g, "").trim();
  return Number(cleaned) || 0;
}
