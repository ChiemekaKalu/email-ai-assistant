interface RateLimitConfig {
  maxRequests: number;    // Maximum number of requests
  timeWindow: number;     // Time window in milliseconds
  retryAfter: number;     // Retry delay in milliseconds
}

interface RequestRecord {
  timestamp: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private requests: RequestRecord[] = [];
  private config: RateLimitConfig;

  private constructor() {
    // Default: 20 requests per minute with 3-second retry delay
    this.config = {
      maxRequests: 20,
      timeWindow: 60 * 1000, // 1 minute
      retryAfter: 3000       // 3 seconds
    };
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  configure(config: Partial<RateLimitConfig>) {
    this.config = { ...this.config, ...config };
  }

  private cleanOldRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(req => 
      now - req.timestamp <= this.config.timeWindow
    );
  }

  async waitForCapacity(): Promise<void> {
    this.cleanOldRequests();

    while (this.requests.length >= this.config.maxRequests) {
      await new Promise(resolve => setTimeout(resolve, this.config.retryAfter));
      this.cleanOldRequests();
    }

    this.requests.push({ timestamp: Date.now() });
  }

  // Decorator-like function to rate limit any async function
  async rateLimit<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForCapacity();
    return fn();
  }
}
