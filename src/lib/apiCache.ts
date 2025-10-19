/**
 * Simple in-memory cache for API responses
 * Reduces redundant API calls and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get data from cache or fetch from API
   */
  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if valid
    if (cached && now - cached.timestamp < ttl) {
      return cached.data as T;
    }

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: now,
    });

    return data;
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const apiCache = new ApiCache();

/**
 * Helper function to fetch and normalize API responses
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result = await response.json();

  // Normalize response format (handle both direct arrays and {success, data} format)
  if (Array.isArray(result)) {
    return result as T;
  }

  if (result.data !== undefined) {
    return result.data as T;
  }

  return result as T;
}

/**
 * Fetch with caching
 */
export async function fetchCached<T>(
  url: string,
  options?: RequestInit & { ttl?: number }
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options?.body || "")}`;
  const ttl = options?.ttl;

  return apiCache.fetch(cacheKey, () => fetchAPI<T>(url, options), ttl);
}
