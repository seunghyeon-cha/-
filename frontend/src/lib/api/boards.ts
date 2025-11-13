import { apiClient } from './client';
import {
  Board,
  BoardListResponse,
  BoardQueryParams,
  CreateBoardDto,
  UpdateBoardDto,
  BoardLikeResponse,
} from '@/types/board';

/**
 * 게시글 목록 조회
 */
export const getBoards = async (
  params?: BoardQueryParams
): Promise<BoardListResponse> => {
  const response = await apiClient.get<BoardListResponse>('/api/boards', {
    params,
  });
  return response.data;
};

/**
 * 게시글 상세 조회
 */
export const getBoardById = async (id: string): Promise<Board> => {
  const response = await apiClient.get<Board>(`/api/boards/${id}`);
  return response.data;
};

/**
 * 게시글 작성
 */
export const createBoard = async (data: CreateBoardDto): Promise<Board> => {
  const response = await apiClient.post<Board>('/api/boards', data);
  return response.data;
};

/**
 * 게시글 수정
 */
export const updateBoard = async (
  id: string,
  data: UpdateBoardDto
): Promise<Board> => {
  const response = await apiClient.put<Board>(`/api/boards/${id}`, data);
  return response.data;
};

/**
 * 게시글 삭제
 */
export const deleteBoard = async (
  id: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/boards/${id}`
  );
  return response.data;
};

/**
 * 게시글 좋아요 토글
 */
export const toggleBoardLike = async (
  id: string
): Promise<BoardLikeResponse> => {
  const response = await apiClient.post<BoardLikeResponse>(
    `/api/boards/${id}/like`
  );
  return response.data;
};

/**
 * 게시글 좋아요 상태 확인
 */
export const checkBoardLike = async (
  id: string
): Promise<{ liked: boolean }> => {
  const response = await apiClient.get<{ liked: boolean }>(
    `/api/boards/${id}/like/check`
  );
  return response.data;
};
