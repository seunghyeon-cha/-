export interface User {
  id: string;
  name: string;
  profileImage: string | null;
}

export interface Comment {
  id: string;
  userId: string;
  boardId: string | null;
  reviewId: string | null;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
}

export interface CreateCommentDto {
  boardId?: string;
  reviewId?: string;
  parentId?: string;
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentQueryParams {
  boardId?: string;
  reviewId?: string;
}
