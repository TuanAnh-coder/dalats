/**
 * Shared role & route-access rules for both the Edge middleware and the UI.
 * Must stay dependency-free (middleware runs on the Edge runtime).
 */

export type AppRole = "admin" | "staff" | "user";

export const APP_ROLES: readonly AppRole[] = ["admin", "staff", "user"] as const;

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Quản trị viên",
  staff: "Lễ tân",
  user: "Khách hàng",
};

/** Landing page after a successful login, per role. */
export const ROLE_HOME: Record<AppRole, string> = {
  admin: "/admin",
  staff: "/admin",
  user: "/",
};

export function normalizeRole(role: unknown): AppRole {
  if (typeof role !== "string") return "user";
  const r = role.toLowerCase().trim();
  return r === "admin" || r === "staff" ? (r as AppRole) : "user";
}

export function isAdminRole(role: unknown): boolean {
  return normalizeRole(role) === "admin";
}

export function isStaffRole(role: unknown): boolean {
  const normalized = normalizeRole(role);
  return normalized === "admin" || normalized === "staff";
}

export function getRoleHome(role: unknown): string {
  return ROLE_HOME[normalizeRole(role)];
}

function matchesRoute(pathname: string, prefix: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] ?? "";
  return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * Central route policy (used by middleware to guard routes and by the login
 * page to pick a safe post-login destination).
 *
 * - /admin/**      → admin & staff only
 * - /my-bookings   → authentication is checked separately (guest order lookup
 *                    by code stays public), so it is allowed here.
 * - everything else is public.
 */
export function canAccessPath(role: unknown, pathname: string): boolean {
  const normalized = normalizeRole(role);

  if (matchesRoute(pathname, "/admin")) {
    return normalized === "admin" || normalized === "staff";
  }

  return true;
}
