// Simple in-memory cache for GA4 data
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }
  
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMinutes: number = 5): void {
  const now = Date.now();
  const expiresAt = now + (ttlMinutes * 60 * 1000);
  
  cache.set(key, {
    data,
    timestamp: now,
    expiresAt
  });
}

export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

export function getCacheKey(prefix: string, period: string): string {
  return `${prefix}:${period}`;
}