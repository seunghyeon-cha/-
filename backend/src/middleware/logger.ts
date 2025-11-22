/**
 * 로깅 미들웨어
 * 구조화된 요청/응답 로깅
 */

import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// 로그 디렉토리
const LOG_DIR = path.join(__dirname, '../../logs');

// 로그 레벨
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

/**
 * 로그 디렉토리 생성
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * 로그 파일에 기록
 */
function writeLog(entry: LogEntry) {
  ensureLogDir();

  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_DIR, `${date}.log`);
  const logLine = JSON.stringify(entry) + '\n';

  fs.appendFileSync(logFile, logLine);

  // 콘솔에도 출력
  const color = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    debug: '\x1b[90m',
  };
  const reset = '\x1b[0m';

  console.log(
    `${color[entry.level]}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`
  );

  if (entry.data) {
    console.log(entry.data);
  }
}

/**
 * Logger 객체
 */
export const logger = {
  info: (message: string, data?: unknown) => {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
    });
  },

  warn: (message: string, data?: unknown) => {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data,
    });
  },

  error: (message: string, data?: unknown) => {
    writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data,
    });
  },

  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      writeLog({
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        data,
      });
    }
  },
};

/**
 * 요청 로깅 미들웨어
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // 응답 완료 시 로깅
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, logData);
    } else {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, logData);
    }
  });

  next();
}

/**
 * 에러 로깅 미들웨어
 */
export function errorLogger(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    ip: req.ip,
  });

  next(err);
}

export default logger;
