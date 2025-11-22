/**
 * 간단한 메모리 캐시 미들웨어
 */

import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: unknown;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

// 기본 캐시 시간: 5분
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * 캐시 미들웨어 생성
 * @param ttl 캐시 유효 시간 (ms)
 */
export function cacheMiddleware(ttl: number = DEFAULT_TTL) {
  return (req: Request, res: Response, next: NextFunction) => {
    // GET 요청만 캐싱
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    // 캐시 히트
    if (cached && cached.expiry > Date.now()) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // 캐시 미스 - 응답 가로채기
    const originalJson = res.json.bind(res);
    res.json = (data: unknown) => {
      cache.set(key, {
        data,
        expiry: Date.now() + ttl,
      });
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

/**
 * 캐시 무효화
 * @param pattern URL 패턴 (정규식)
 */
export function invalidateCache(pattern?: string | RegExp) {
  if (!pattern) {
    cache.clear();
    return;
  }

  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * 캐시 통계
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

export default cacheMiddleware;
