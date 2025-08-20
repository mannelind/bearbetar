interface CacheEntry {
  data: any
  expiry: number
}

class CacheSystem {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly defaultTTL = 24 * 60 * 60 * 1000 // 24 hours

  set(key: string, data: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { data, expiry })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  generateKey(type: string, url: string): string {
    // Normalize URL for consistent caching
    try {
      const normalizedUrl = new URL(url).toString()
      return `${type}:${normalizedUrl}`
    } catch {
      // Fallback for invalid URLs
      return `${type}:${url}`
    }
  }

  getStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0

    for (const entry of this.cache.values()) {
      if (now > entry.expiry) {
        expiredEntries++
      } else {
        validEntries++
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries
    }
  }
}

export const cacheSystem = new CacheSystem()

// Cleanup expired entries every hour
setInterval(() => {
  cacheSystem.cleanup()
}, 60 * 60 * 1000)