import { apiClient } from './client';

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'BUSINESS' | 'ADMIN';
    profileImage?: string;
    phone?: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * 회원가입
 */
export const signup = async (data: SignupDto): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/signup', data);
  return response.data;
};

/**
 * 로그인
 */
export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/login', data);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post('/api/auth/refresh', { refreshToken });
  return response.data;
};

/**
 * 현재 사용자 정보 조회
 */
export const getMe = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};
