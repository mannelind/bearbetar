// Simple in-memory rate limiter
// For production, consider using Redis or similar

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 5, windowMs = 15 * 60 * 1000) { // 5 requests per 15 minutes default
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    // Increment count
    entry.count++
    return true
  }

  getRemainingTime(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry) return 0
    
    const remaining = entry.resetTime - Date.now()
    return Math.max(0, Math.ceil(remaining / 1000)) // Return seconds
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Export singleton instance
export const contactRateLimiter = new RateLimiter(3, 15 * 60 * 1000) // 3 requests per 15 minutes