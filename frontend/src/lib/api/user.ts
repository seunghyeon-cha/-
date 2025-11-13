import { apiClient } from './client';
import {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  BoardListResponse,
  ReviewListResponse,
  UserStats,
  QueryParams,
} from '@/types/user';

/**
 * 프로필 조회 (통계 포함)
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/api/api/users/me/profile');
  return response.data;
};

/**
 * 프로필 수정
 */
export const updateProfile = async (
  data: UpdateProfileDto
): Promise<UserProfile> => {
  const response = await apiClient.put<UserProfile>(
    '/api/api/users/me/profile',
    data
  );
  return response.data;
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (
  data: ChangePasswordDto
): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>(
    '/api/api/users/me/password',
    data
  );
  return response.data;
};

/**
 * 내 게시글 목록
 */
export const getMyBoards = async (
  params: QueryParams = {}
): Promise<BoardListResponse> => {
  const response = await apiClient.get<BoardListResponse>(
    '/api/api/users/me/boards',
    { params }
  );
  return response.data;
};

/**
 * 내 리뷰 목록
 */
export const getMyReviews = async (
  params: QueryParams = {}
): Promise<ReviewListResponse> => {
  const response = await apiClient.get<ReviewListResponse>(
    '/api/api/users/me/reviews',
    { params }
  );
  return response.data;
};

/**
 * 내 통계
 */
export const getMyStats = async (): Promise<UserStats> => {
  const response = await apiClient.get<UserStats>('/api/api/users/me/stats');
  return response.data;
};
