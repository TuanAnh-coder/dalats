import Redis from "ioredis";
import { env } from "../../env.js";

/**
 * Global Redis Client Singleton (prevents connection leaks in dev hot-reload)
 */
const globalForRedis = globalThis as unknown as {
  redisClient: Redis | null | undefined;
};

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisInstance) return redisInstance;
  if (globalForRedis.redisClient) return globalForRedis.redisClient;

  const redisUrl = env.REDIS_URL || process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  try {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 5) return null; // stop retrying after 5 attempts to avoid flooding logs
        return Math.min(times * 100, 2000);
      },
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    client.on("error", (err) => {
      // Soft warning in dev/test, prevents app crash
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Redis] Connection notice:", err.message);
      }
    });

    // Connect asynchronously
    client.connect().catch((err) => {
      console.warn("[Redis] Initial connect warning:", err.message);
    });

    if (process.env.NODE_ENV !== "production") {
      globalForRedis.redisClient = client;
    }

    redisInstance = client;
    return client;
  } catch (error) {
    console.warn("[Redis] Initialization failed:", error);
    return null;
  }
}

/**
 * Cache-aside & Key-Value Utilities
 */
export const redisCache = {
  /**
   * Get parsed JSON or string from Redis
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (!client || client.status !== "ready") return null;

    try {
      const data = await client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  /**
   * Set value in Redis with optional TTL (in seconds)
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    const client = getRedisClient();
    if (!client || client.status !== "ready") return false;

    try {
      const payload = typeof value === "string" ? value : JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await client.set(key, payload, "EX", ttlSeconds);
      } else {
        await client.set(key, payload);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Delete one or more keys
   */
  async del(...keys: string[]): Promise<number> {
    const client = getRedisClient();
    if (!client || client.status !== "ready" || keys.length === 0) return 0;

    try {
      return await client.del(...keys);
    } catch {
      return 0;
    }
  },

  /**
   * Cache-Aside Helper:
   * Returns cached value if exists; otherwise executes `fetcher()`, stores in Redis for `ttlSeconds`, and returns.
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds = 300 // default 5 minutes
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const fresh = await fetcher();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  },

  /**
   * Invalidate all keys matching a prefix (e.g. "rooms:*")
   */
  async delPrefix(pattern: string): Promise<number> {
    const client = getRedisClient();
    if (!client || client.status !== "ready") return 0;

    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        return await client.del(...keys);
      }
      return 0;
    } catch {
      return 0;
    }
  },

  /**
   * Distributed Lock with auto-expiration (Prevents race conditions / double booking)
   */
  async withLock<T>(
    lockKey: string,
    ttlSeconds: number,
    action: () => Promise<T>
  ): Promise<T> {
    const client = getRedisClient();
    if (!client || client.status !== "ready") {
      // If Redis is not connected, run action directly (safe fallback)
      return await action();
    }

    const lockValue = Math.random().toString(36).slice(2);
    try {
      // NX: set only if not exists, EX: expire time
      const acquired = await client.set(lockKey, lockValue, "EX", ttlSeconds, "NX");
      if (!acquired) {
        throw new Error("Phòng này đang có người thao tác đặt cùng lúc. Vui lòng thử lại sau vài giây.");
      }
    } catch (lockErr) {
      if (lockErr instanceof Error && lockErr.message.includes("Phòng này đang")) {
        throw lockErr;
      }
      // If redis errors during set, proceed
      return await action();
    }

    try {
      return await action();
    } finally {
      try {
        const val = await client.get(lockKey);
        if (val === lockValue) {
          await client.del(lockKey);
        }
      } catch {
        // Ignore lock release error
      }
    }
  },

  /**
   * Check connection status
   */
  isReady(): boolean {
    const client = getRedisClient();
    return !!client && client.status === "ready";
  },
};
