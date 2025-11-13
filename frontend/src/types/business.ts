export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 사업자 인증 정보
export interface BusinessVerification {
  id: string;
  userId: string;
  businessNumber: string;
  businessName: string;
  ownerName: string;
  address: string;
  documents: string[]; // 서류 URL 배열
  status: VerificationStatus;
  rejectedReason?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// 사업자 인증 신청 DTO
export interface CreateVerificationDto {
  businessNumber: string;
  businessName: string;
  ownerName: string;
  address: string;
  documents: string[]; // 서류 URL 배열
}

// 인증 검토 액션
export type ReviewAction = 'APPROVE' | 'REJECT';

// 인증 검토 DTO
export interface ReviewVerificationDto {
  action: ReviewAction;
  rejectedReason?: string;
}

// 프로모션
export interface Promotion {
  id: string;
  placeId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  place?: {
    id: string;
    name: string;
    ownerId: string;
  };
}

// 프로모션 생성 DTO
export interface CreatePromotionDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

// 프로모션 수정 DTO
export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {
  isActive?: boolean;
}

// 사업자 통계 요약
export interface BusinessStatsSummary {
  totalPlaces: number;
  totalReviews: number;
  totalBookmarks: number;
  avgRating: number;
}

// 업장별 통계
export interface PlaceStats {
  placeId: string;
  placeName: string;
  reviewCount: number;
  avgRating: number;
  bookmarkCount: number;
}

// 업장 상세 통계
export interface PlaceDetailStats {
  placeId: string;
  placeName: string;
  totalReviews: number;
  avgRating: number;
  totalBookmarks: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

// 내 업장 목록 (통계 포함)
export interface MyPlace {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  reviewCount: number;
  bookmarkCount: number;
}
