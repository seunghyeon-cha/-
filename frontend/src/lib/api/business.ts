import { apiClient } from './client';
import type {
  BusinessVerification,
  CreateVerificationDto,
  BusinessStatsSummary,
  PlaceStats,
  PlaceDetailStats,
  MyPlace,
} from '@/types/business';

// ========== 사업자 인증 ==========

/**
 * 사업자 인증 신청
 */
export const createVerification = async (data: CreateVerificationDto) => {
  const response = await apiClient.post<BusinessVerification>(
    '/api/business/verify',
    data
  );
  return response.data;
};

/**
 * 내 인증 신청 상태 조회
 */
export const getVerificationStatus = async () => {
  const response = await apiClient.get<BusinessVerification>(
    '/api/business/verify/status'
  );
  return response.data;
};

// ========== 업장 관리 ==========

/**
 * 내가 소유한 업장 목록 조회
 */
export const getMyPlaces = async () => {
  const response = await apiClient.get<MyPlace[]>('/api/business/places');
  return response.data;
};

// ========== 통계 ==========

/**
 * 사업자 통계 요약 조회
 */
export const getBusinessStatsSummary = async () => {
  const response = await apiClient.get<BusinessStatsSummary>('/api/business/stats');
  return response.data;
};

/**
 * 업장별 통계 조회
 */
export const getPlaceStats = async () => {
  const response = await apiClient.get<PlaceStats[]>('/api/business/stats/places');
  return response.data;
};

/**
 * 특정 업장의 상세 통계 조회
 */
export const getPlaceDetailStats = async (placeId: string) => {
  const response = await apiClient.get<PlaceDetailStats>(
    `/api/business/stats/places/${placeId}`
  );
  return response.data;
};
