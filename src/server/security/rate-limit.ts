import { getRedisClient, redisCache } from "~/server/redis";
import { getClientIp } from "./client-ip";

export { getClientIp };

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// In-memory fallback if Redis is unreachable
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup every 2 minutes for expired memory entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 120_000).unref?.();
}

/**
 * Sliding/Fixed Window Rate Limiter (Redis with In-memory Fallback)
 * @param key Unique key e.g. "contact:ip:1.2.3.4"
 * @param maxRequests Maximum requests allowed within the window
 * @param windowSeconds Window length in seconds (default 60s)
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds = 60
): Promise<RateLimitResult> {
  const redisKey = `ratelimit:${key}`;

  // 1. Try Redis first
  if (redisCache.isReady()) {
    try {
      const redis = getRedisClient();
      if (redis) {
        const count = await redis.incr(redisKey);
        if (count === 1) {
          await redis.expire(redisKey, windowSeconds);
        }
        const ttl = await redis.ttl(redisKey);

        const remaining = Math.max(0, maxRequests - count);
        return {
          success: count <= maxRequests,
          limit: maxRequests,
          remaining,
          resetSeconds: Math.max(1, ttl),
        };
      }
    } catch (err) {
      console.warn(`[RateLimit] Redis check failed for ${key}, falling back to memory:`, err);
    }
  }

  // 2. In-memory Fallback
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || record.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetSeconds: windowSeconds,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, maxRequests - record.count);
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  return {
    success: record.count <= maxRequests,
    limit: maxRequests,
    remaining,
    resetSeconds,
  };
}
