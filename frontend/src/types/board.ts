export type BoardCategory =
  | 'REVIEW'        // 여행 후기
  | 'QNA'           // 질문/답변
  | 'RESTAURANT'    // 맛집 추천
  | 'ACCOMMODATION' // 숙소 추천
  | 'TOURIST'       // 관광지 정보
  | 'FREE';         // 자유 게시판

export const BOARD_CATEGORY_LABELS: Record<BoardCategory, string> = {
  REVIEW: '여행 후기',
  QNA: '질문/답변',
  RESTAURANT: '맛집 추천',
  ACCOMMODATION: '숙소 추천',
  TOURIST: '관광지 정보',
  FREE: '자유 게시판',
};

export interface User {
  id: string;
  name: string;
  profileImage: string | null;
  role?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface BoardTag {
  tag: Tag;
}

export interface Board {
  id: string;
  userId: string;
  category: BoardCategory;
  title: string;
  content: string;
  images: string[];
  views: number;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  boardTags?: BoardTag[];
  _count?: {
    comments: number;
    boardLikes: number;
  };
}

export interface BoardListResponse {
  data: Board[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BoardQueryParams {
  page?: number;
  limit?: number;
  category?: BoardCategory;
  search?: string;
  sort?: 'latest' | 'popular' | 'views';
  userId?: string;
}

export interface CreateBoardDto {
  category: BoardCategory;
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateBoardDto {
  category?: BoardCategory;
  title?: string;
  content?: string;
  images?: string[];
  tags?: string[];
}

export interface BoardLikeResponse {
  liked: boolean;
  message: string;
}
