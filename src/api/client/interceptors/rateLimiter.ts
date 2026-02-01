// 请求频率限制器
// 用于防止过多的API请求导致服务器压力过大

/**
 * 请求频率限制配置
 */
export interface RateLimitConfig {
  // 时间窗口（毫秒）
  windowMs: number;
  // 时间窗口内允许的最大请求数
  maxRequests: number;
  // 超过限制时的处理方式
  onLimitExceeded: (url: string) => void;
}

/**
 * 请求记录
 */
interface RequestRecord {
  // 请求时间戳
  timestamp: number;
  // 请求URL
  url: string;
}

/**
 * 请求频率限制器类
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private requests: RequestRecord[] = [];
  private lastCleanup: number = Date.now();

  /**
   * 构造函数
   * @param config 频率限制配置
   */
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || 60000, // 默认1分钟
      maxRequests: config.maxRequests || 60, // 默认60次/分钟
      onLimitExceeded: config.onLimitExceeded || ((url) => {
        console.warn(`Rate limit exceeded for ${url}`);
      }),
    };
  }

  /**
   * 检查请求是否超过频率限制
   * @param url 请求URL
   * @returns 是否允许请求
   */
  public check(url: string): boolean {
    // 清理过期的请求记录
    this.cleanupExpiredRequests();

    // 检查请求次数
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // 统计时间窗口内的请求数
    const recentRequests = this.requests.filter(
      (req) => req.timestamp >= windowStart && req.url === url
    );

    // 检查是否超过限制
    if (recentRequests.length >= this.config.maxRequests) {
      this.config.onLimitExceeded(url);
      return false;
    }

    // 记录新请求
    this.requests.push({ timestamp: now, url });
    return true;
  }

  /**
   * 清理过期的请求记录
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // 只保留时间窗口内的请求
    this.requests = this.requests.filter(
      (req) => req.timestamp >= windowStart
    );

    // 记录最后清理时间
    this.lastCleanup = now;
  }

  /**
   * 重置请求记录
   */
  public reset(): void {
    this.requests = [];
  }

  /**
   * 获取当前请求统计
   * @returns 请求统计信息
   */
  public getStats(): {
    totalRequests: number;
    windowMs: number;
    maxRequests: number;
  } {
    this.cleanupExpiredRequests();
    return {
      totalRequests: this.requests.length,
      windowMs: this.config.windowMs,
      maxRequests: this.config.maxRequests,
    };
  }
}

// 创建全局速率限制器实例
export const globalRateLimiter = new RateLimiter();

/**
 * 速率限制中间件
 * @param config 速率限制配置
 * @returns 请求拦截器函数
 */
export const rateLimitMiddleware = (config: Partial<RateLimitConfig> = {}) => {
  const limiter = new RateLimiter(config);

  return (url: string): boolean => {
    return limiter.check(url);
  };
};
