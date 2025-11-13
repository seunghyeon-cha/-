import { apiClient } from './client';

export type PlaceCategory = 'TOURIST' | 'RESTAURANT' | 'ACCOMMODATION';
export type SortOption = 'latest' | 'rating' | 'reviews';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  averageRating: number;
  reviewCount: number;
  contact?: string;
  website?: string;
  operatingHours?: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface PlacesResponse {
  data: Place[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PlaceQueryParams {
  category?: PlaceCategory;
  page?: number;
  limit?: number;
  search?: string;
  sort?: SortOption;
  region?: string;
}

/**
 * 장소 목록 조회
 */
export const getPlaces = async (
  params?: PlaceQueryParams,
): Promise<PlacesResponse> => {
  const response = await apiClient.get('/api/places', { params });
  return response.data;
};

/**
 * 장소 상세 조회
 */
export const getPlace = async (id: string): Promise<Place> => {
  const response = await apiClient.get(`/api/places/${id}`);
  return response.data;
};

/**
 * 장소 등록 (사업자만)
 */
export const createPlace = async (data: Partial<Place>): Promise<Place> => {
  const response = await apiClient.post('/api/places', data);
  return response.data;
};

/**
 * 장소 수정 (사업자만)
 */
export const updatePlace = async (
  id: string,
  data: Partial<Place>,
): Promise<Place> => {
  const response = await apiClient.put(`/api/places/${id}`, data);
  return response.data;
};

/**
 * 장소 삭제 (사업자/관리자만)
 */
export const deletePlace = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/places/${id}`);
};
