# Phase 4-1: Frontend 에러 핸들링 시스템 구축

## 작업 개요
에러 바운더리, 토스트 알림 시스템, API 에러 핸들링을 구축하여 사용자 친화적인 에러 처리를 구현합니다.

---

## 1단계: 토스트 알림 시스템 구축

### 1-1. Zustand 토스트 스토어 생성

**파일**: `src/stores/toastStore.ts`

```typescript
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      duration: 3000,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 자동 제거
    if (newToast.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// 편의 함수
export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'error', message, duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'warning', message, duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'info', message, duration }),
};
```

### 1-2. 토스트 컴포넌트 생성

**파일**: `src/components/common/Toast.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useToastStore, Toast as ToastType } from '@/stores/toastStore';

const Toast = ({ toast }: { toast: ToastType }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    // 자동 제거는 스토어에서 처리하므로 여기서는 불필요
  }, []);

  const iconMap = {
    success: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-primary-600',
  };

  return (
    <div
      className={`${colorMap[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[320px] max-w-[400px] animate-slide-in-right`}
    >
      {iconMap[toast.type]}
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
```

### 1-3. Tailwind 애니메이션 추가

**파일**: `tailwind.config.ts` 수정

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  // ... 기존 설정
  theme: {
    extend: {
      // ... 기존 설정
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
      },
    },
  },
};

export default config;
```

### 1-4. RootLayout에 ToastContainer 추가

**파일**: `src/app/layout.tsx` 수정

```typescript
import ToastContainer from '@/components/common/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

---

## 2단계: API 클라이언트 에러 핸들링 강화

### 2-1. API 클라이언트 수정

**파일**: `src/lib/api/client.ts` 수정

```typescript
import axios, { AxiosError } from 'axios';
import { toast } from '@/stores/toastStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string | string[] }>) => {
    const originalRequest = error.config as any;

    // 네트워크 에러
    if (!error.response) {
      toast.error('인터넷 연결을 확인해주세요');
      return Promise.reject(error);
    }

    // 401 에러: 토큰 만료
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          { refreshToken },
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료됨
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403 에러: 권한 없음
    if (error.response.status === 403) {
      toast.error('접근 권한이 없습니다');
    }

    // 404 에러: 리소스 없음
    if (error.response.status === 404) {
      toast.error('요청하신 정보를 찾을 수 없습니다');
    }

    // 500 에러: 서버 에러
    if (error.response.status >= 500) {
      toast.error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
    }

    // 에러 메시지 추출
    const errorMessage = error.response.data?.message;
    if (errorMessage) {
      const message = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage;
      // 이미 토스트를 표시한 경우가 아니면 표시
      if (![401, 403, 404].includes(error.response.status)) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

## 3단계: 에러 바운더리 컴포넌트

### 3-1. 에러 바운더리 생성

**파일**: `src/components/common/ErrorBoundary.tsx`

```typescript
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-red-500 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                오류가 발생했습니다
              </h2>
              <p className="text-gray-600 mb-8">
                페이지를 불러오는 중 문제가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                새로고침
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 3-2. 페이지별 에러 처리 컴포넌트

**파일**: `src/app/error.tsx` (Next.js App Router 전역 에러)

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          일시적인 오류가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-8">
          잠시 후 다시 시도해주세요
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
```

**파일**: `src/app/not-found.tsx` (404 페이지)

```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나
          <br />
          삭제되었을 수 있습니다
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            메인으로 가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 4단계: 기존 코드에 토스트 적용

### 4-1. 로그인 페이지 수정

**파일**: `src/app/(auth)/login/page.tsx` 수정

```typescript
import { toast } from '@/stores/toastStore';

// 기존 alert() 대신 toast 사용
try {
  const response = await login(data.email, data.password);
  toast.success('로그인되었습니다');
  router.push('/');
} catch (error: any) {
  // API 인터셉터에서 이미 토스트 표시함
  // 추가 메시지가 필요한 경우에만 표시
}
```

### 4-2. 회원가입 페이지 수정

**파일**: `src/app/(auth)/signup/page.tsx` 수정

```typescript
import { toast } from '@/stores/toastStore';

try {
  await signup(data);
  toast.success('회원가입이 완료되었습니다');
  router.push('/login');
} catch (error: any) {
  // API 인터셉터에서 처리
}
```

### 4-3. 리뷰 작성 폼 수정

**파일**: `src/components/reviews/ReviewForm.tsx` 수정

```typescript
import { toast } from '@/stores/toastStore';

try {
  setIsSubmitting(true);
  await createReview({ placeId, rating, content });
  toast.success('리뷰가 작성되었습니다');
  onSuccess();
  onClose();
} catch (error: any) {
  // API 인터셉터에서 처리
} finally {
  setIsSubmitting(false);
}
```

### 4-4. 북마크 토글 수정

**파일**: `src/app/(main)/places/[id]/page.tsx` 수정

```typescript
import { toast } from '@/stores/toastStore';

const handleBookmark = async () => {
  if (!isAuthenticated) {
    toast.warning('로그인이 필요합니다');
    router.push('/login');
    return;
  }

  try {
    if (isBookmarked && bookmarkId) {
      await deleteBookmark(bookmarkId);
      setIsBookmarked(false);
      setBookmarkId(null);
      toast.success('북마크가 해제되었습니다');
    } else {
      const bookmark = await createBookmark(params.id);
      setIsBookmarked(true);
      setBookmarkId(bookmark.id);
      toast.success('북마크에 추가되었습니다');
    }
  } catch (error) {
    // API 인터셉터에서 처리
  }
};
```

---

## 5단계: 환경 변수 설정

**파일**: `.env.local` 추가/수정

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 완료 체크리스트

- [ ] Zustand 토스트 스토어 생성
- [ ] Toast 컴포넌트 생성
- [ ] Tailwind 애니메이션 설정
- [ ] RootLayout에 ToastContainer 추가
- [ ] API 클라이언트 에러 핸들링 강화
- [ ] ErrorBoundary 컴포넌트 생성
- [ ] error.tsx (전역 에러) 생성
- [ ] not-found.tsx (404) 생성
- [ ] 기존 alert()를 toast로 교체 (로그인, 회원가입, 리뷰, 북마크)
- [ ] 환경 변수 설정

---

## 테스트 방법

### 1. 토스트 테스트
```typescript
// 브라우저 콘솔에서
import { toast } from '@/stores/toastStore';
toast.success('성공 메시지');
toast.error('에러 메시지');
toast.warning('경고 메시지');
toast.info('정보 메시지');
```

### 2. 에러 바운더리 테스트
의도적으로 에러 발생시키기 (임시 컴포넌트 생성)

### 3. 404 테스트
존재하지 않는 URL 접속: `http://localhost:3000/invalid-page`

### 4. API 에러 테스트
- 서버 중지 후 API 호출 (네트워크 에러)
- 잘못된 ID로 장소 조회 (404 에러)
- 로그인 없이 보호된 API 호출 (401 에러)

---

## 다음 단계

프론트엔드 에러 핸들링 완료 후:
1. 백엔드 서버 실행 및 연결 테스트
2. Phase 4-2: API 통합 테스트 진행

---

**예상 소요 시간**: 3-4시간
**우선순위**: 높음 (Phase 4-1의 핵심 작업)
