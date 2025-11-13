import { apiClient } from './client';
import { Place } from './places';

export interface Bookmark {
  id: string;
  userId: string;
  placeId: string;
  createdAt: string;
  place: Place;
}

export interface BookmarksResponse {
  data: Bookmark[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateBookmarkDto {
  placeId: string;
}

/**
 * 내 북마크 목록 조회
 */
export const getMyBookmarks = async (
  page: number = 1,
  limit: number = 20,
): Promise<BookmarksResponse> => {
  const response = await apiClient.get('/api/bookmarks', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 장소 북마크 여부 확인
 */
export const checkBookmark = async (
  placeId: string,
): Promise<{ bookmarked: boolean; bookmarkId: string | null }> => {
  const response = await apiClient.get(`/api/bookmarks/check/${placeId}`);
  return response.data;
};

/**
 * 북마크 추가
 */
export const createBookmark = async (
  placeId: string,
): Promise<Bookmark> => {
  const response = await apiClient.post('/api/bookmarks', { placeId });
  return response.data;
};

/**
 * 북마크 삭제
 */
export const deleteBookmark = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/bookmarks/${id}`);
};
