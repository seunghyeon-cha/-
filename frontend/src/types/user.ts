// 사용자 프로필
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
  bio: string | null;
  createdAt: string;
  stats: UserStats;
}

// 사용자 통계
export interface UserStats {
  boardsCount: number;
  reviewsCount: number;
  bookmarksCount: number;
  likesReceived: number;
}

// 프로필 수정 DTO
export interface UpdateProfileDto {
  name: string;
  bio?: string;
  profileImage?: string;
}

// 비밀번호 변경 DTO
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm?: string; // 프론트엔드 검증용
}

// 게시글 목록 응답
export interface BoardListResponse {
  boards: any[]; // Board 타입 사용
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 리뷰 목록 응답
export interface ReviewListResponse {
  reviews: any[]; // Review 타입 사용
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 쿼리 파라미터
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'popular';
}
