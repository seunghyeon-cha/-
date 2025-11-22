/**
 * Rate Limiting 미들웨어
 * IP 기반 요청 제한으로 API 남용 방지
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitEntry>();

// 기본 설정
const DEFAULT_WINDOW_MS = 60 * 1000; // 1분
const DEFAULT_MAX_REQUESTS = 100; // 분당 100회

// 인증 API 설정 (더 엄격)
const AUTH_WINDOW_MS = 60 * 1000; // 1분
const AUTH_MAX_REQUESTS = 10; // 분당 10회

/**
 * Rate Limiter 미들웨어 생성
 */
export function rateLimiter(
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetTime) {
      // 새 윈도우 시작
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });

      // 헤더 설정
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

      return next();
    }

    if (entry.count >= maxRequests) {
      // 제한 초과
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));
      res.setHeader('Retry-After', retryAfter);

      return res.status(429).json({
        error: '너무 많은 요청',
        message: `요청 제한을 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
        retryAfter,
      });
    }

    // 카운트 증가
    entry.count++;
    requestCounts.set(key, entry);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - entry.count);
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    next();
  };
}

/**
 * 인증 API용 엄격한 Rate Limiter
 */
export const authRateLimiter = rateLimiter(AUTH_MAX_REQUESTS, AUTH_WINDOW_MS);

/**
 * 일반 API용 Rate Limiter
 */
export const apiRateLimiter = rateLimiter(DEFAULT_MAX_REQUESTS, DEFAULT_WINDOW_MS);

/**
 * Rate Limit 상태 초기화 (테스트용)
 */
export function resetRateLimits() {
  requestCounts.clear();
}

/**
 * 주기적 정리 (메모리 관리)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60 * 1000); // 1분마다 정리

export default rateLimiter;
