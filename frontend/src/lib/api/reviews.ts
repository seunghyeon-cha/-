import { apiClient } from './client';

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  _count?: {
    likes: number;
  };
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewDto {
  placeId: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface UpdateReviewDto {
  rating?: number;
  content?: string;
  images?: string[];
}

/**
 * 리뷰 목록 조회 (장소별)
 */
export const getReviews = async (
  placeId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ReviewsResponse> => {
  const response = await apiClient.get('/api/reviews', {
    params: { placeId, page, limit },
  });
  return response.data;
};

/**
 * 리뷰 상세 조회
 */
export const getReview = async (id: string): Promise<Review> => {
  const response = await apiClient.get(`/api/reviews/${id}`);
  return response.data;
};

/**
 * 리뷰 작성
 */
export const createReview = async (data: CreateReviewDto): Promise<Review> => {
  const response = await apiClient.post('/api/reviews', data);
  return response.data;
};

/**
 * 리뷰 수정
 */
export const updateReview = async (
  id: string,
  data: UpdateReviewDto,
): Promise<Review> => {
  const response = await apiClient.put(`/api/reviews/${id}`, data);
  return response.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/reviews/${id}`);
};

/**
 * 리뷰 좋아요 토글
 */
export const toggleReviewLike = async (
  reviewId: string,
): Promise<{ liked: boolean; message: string }> => {
  const response = await apiClient.post(`/api/reviews/${reviewId}/like`);
  return response.data;
};
