export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

interface Entry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, Entry>();

  // Cleanup interval
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, Math.max(options.windowMs, 60000));

  // Unref so it doesn't keep process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      let entry = store.get(identifier);

      if (!entry || now > entry.resetAt) {
        entry = {
          count: 0,
          resetAt: now + options.windowMs
        };
      }

      entry.count++;
      store.set(identifier, entry);

      const allowed = entry.count <= options.maxRequests;
      const remaining = Math.max(0, options.maxRequests - entry.count);

      return {
        allowed,
        remaining,
        resetAt: new Date(entry.resetAt)
      };
    }
  };
}
