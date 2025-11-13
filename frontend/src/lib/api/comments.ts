import { apiClient } from './client';
import {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryParams,
} from '@/types/comment';

/**
 * 댓글 목록 조회
 */
export const getComments = async (
  params?: CommentQueryParams
): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>('/api/comments', {
    params,
  });
  return response.data;
};

/**
 * 댓글 작성
 */
export const createComment = async (
  data: CreateCommentDto
): Promise<Comment> => {
  const response = await apiClient.post<Comment>('/api/comments', data);
  return response.data;
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  id: string,
  data: UpdateCommentDto
): Promise<Comment> => {
  const response = await apiClient.put<Comment>(`/api/comments/${id}`, data);
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (
  id: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/api/comments/${id}`
  );
  return response.data;
};
