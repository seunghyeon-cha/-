import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

// 타입 정의
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - 모든 요청에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - 토큰 만료 처리 및 에러 핸들링
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<{ message: string | string[] }>) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;

    // 네트워크 에러
    if (!error.response) {
      toast.error('인터넷 연결을 확인해주세요');
      return Promise.reject(error);
    }

    // 401 에러이고 토큰 갱신 요청이 아닐 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // 토큰 갱신 시도
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // 새 토큰 저장
        const { user } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().setAuth(user, newAccessToken, newRefreshToken);
        }

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        useAuthStore.getState().clearAuth();
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

    // 에러 메시지 추출 및 표시
    const errorMessage = error.response.data?.message;
    if (errorMessage && ![401, 403, 404].includes(error.response.status)) {
      const message = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage;
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
