import { apiClient } from './client';
import {
  Itinerary,
  CreateItineraryDto,
  UpdateItineraryDto,
} from '@/types/itinerary';

export interface ItineraryListResponse {
  data: Itinerary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ItineraryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  sort?: 'latest' | 'oldest';
}

/**
 * 여행 일정 목록 조회
 */
export const getItineraries = async (
  params?: ItineraryQueryParams
): Promise<ItineraryListResponse> => {
  const response = await apiClient.get<ItineraryListResponse>(
    '/api/itinerary',
    {
      params,
    }
  );
  return response.data;
};

/**
 * 여행 일정 상세 조회
 */
export const getItineraryById = async (id: string): Promise<Itinerary> => {
  const response = await apiClient.get<Itinerary>(`/api/itinerary/${id}`);
  return response.data;
};

/**
 * 여행 일정 생성
 */
export const createItinerary = async (
  data: CreateItineraryDto
): Promise<Itinerary> => {
  const response = await apiClient.post<Itinerary>('/api/itinerary', data);
  return response.data;
};

/**
 * 여행 일정 수정
 */
export const updateItinerary = async (
  id: string,
  data: UpdateItineraryDto
): Promise<Itinerary> => {
  const response = await apiClient.put<Itinerary>(
    `/api/itinerary/${id}`,
    data
  );
  return response.data;
};

/**
 * 여행 일정 삭제
 */
export const deleteItinerary = async (
  id: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/itinerary/${id}`
  );
  return response.data;
};
