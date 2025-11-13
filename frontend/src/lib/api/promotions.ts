import { apiClient } from './client';
import type {
  Promotion,
  CreatePromotionDto,
  UpdatePromotionDto,
} from '@/types/business';

/**
 * 특정 업장의 프로모션 목록 조회
 */
export const getPromotionsByPlace = async (
  placeId: string,
  includeInactive: boolean = false
) => {
  const response = await apiClient.get<Promotion[]>(
    `/api/promotions/places/${placeId}`,
    {
      params: { includeInactive },
    }
  );
  return response.data;
};

/**
 * 내 모든 프로모션 조회 (사업자용)
 */
export const getMyPromotions = async () => {
  const response = await apiClient.get<Promotion[]>('/api/promotions/my');
  return response.data;
};

/**
 * 특정 프로모션 상세 조회
 */
export const getPromotionById = async (id: string) => {
  const response = await apiClient.get<Promotion>(`/api/promotions/${id}`);
  return response.data;
};

/**
 * 프로모션 생성
 */
export const createPromotion = async (
  placeId: string,
  data: CreatePromotionDto
) => {
  const response = await apiClient.post<Promotion>(
    `/api/promotions/places/${placeId}`,
    data
  );
  return response.data;
};

/**
 * 프로모션 수정
 */
export const updatePromotion = async (id: string, data: UpdatePromotionDto) => {
  const response = await apiClient.put<Promotion>(
    `/api/promotions/${id}`,
    data
  );
  return response.data;
};

/**
 * 프로모션 삭제
 */
export const deletePromotion = async (id: string) => {
  const response = await apiClient.delete(`/api/promotions/${id}`);
  return response.data;
};

/**
 * 프로모션 활성/비활성 토글
 */
export const togglePromotionStatus = async (id: string) => {
  const response = await apiClient.put<Promotion>(
    `/api/promotions/${id}/toggle`
  );
  return response.data;
};
