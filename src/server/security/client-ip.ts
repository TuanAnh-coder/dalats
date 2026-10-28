/**
 * M_Dalats Boutique Villa - Client IP Extraction Utility
 * Extracts client IP from proxies, Cloudflare, Nginx, or direct connections.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
