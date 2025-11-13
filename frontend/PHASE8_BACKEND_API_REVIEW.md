# Phase 8 Backend API 검토 보고서

**작성일**: 2025-11-09
**담당**: Backend Development Team
**검토자**: Backend Developer

---

## 📋 검토 내용

Phase 8 사업자 페이지 마무리를 위한 Backend API 확인 및 검토

### 필요한 기능
1. 업장 관리 (내 업장 목록, 통계)
2. 프로모션 관리 (CRUD, 활성화 토글)

---

## ✅ 1. 업장 관리 API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트

#### 1.1. 내 업장 목록 조회
```typescript
GET /api/business/places
```

**프론트엔드 사용법**:
```typescript
import { getMyPlaces } from '@/lib/api/business';

const places = await getMyPlaces();
```

**응답 형식**:
```typescript
interface MyPlace {
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
  avgRating: number;        // 평균 평점
  reviewCount: number;       // 리뷰 수
  bookmarkCount: number;     // 북마크 수
}

// 응답: MyPlace[]
```

**포함된 정보**:
- ✅ 기본 장소 정보 (이름, 설명, 주소, 좌표)
- ✅ 이미지 배열
- ✅ 통계 정보 (평점, 리뷰 수, 북마크 수)
- ✅ 생성/수정 일시

---

## ✅ 2. 통계 API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트

#### 2.1. 사업자 통계 요약
```typescript
GET /api/business/stats
```

**프론트엔드 사용법**:
```typescript
import { getBusinessStatsSummary } from '@/lib/api/business';

const stats = await getBusinessStatsSummary();
```

**응답 형식**:
```typescript
interface BusinessStatsSummary {
  totalPlaces: number;       // 총 업장 수
  totalReviews: number;      // 총 리뷰 수
  totalBookmarks: number;    // 총 북마크 수
  avgRating: number;         // 평균 평점
}
```

#### 2.2. 업장별 통계
```typescript
GET /api/business/stats/places
```

**프론트엔드 사용법**:
```typescript
import { getPlaceStats } from '@/lib/api/business';

const placeStats = await getPlaceStats();
```

**응답 형식**:
```typescript
interface PlaceStats {
  placeId: string;
  placeName: string;
  reviewCount: number;
  avgRating: number;
  bookmarkCount: number;
}

// 응답: PlaceStats[]
```

#### 2.3. 특정 업장 상세 통계
```typescript
GET /api/business/stats/places/:placeId
```

**프론트엔드 사용법**:
```typescript
import { getPlaceDetailStats } from '@/lib/api/business';

const detailStats = await getPlaceDetailStats(placeId);
```

**응답 형식**:
```typescript
interface PlaceDetailStats {
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
```

**포함된 정보**:
- ✅ 기본 통계 (총 리뷰, 평점, 북마크)
- ✅ 평점 분포 (1점~5점별 개수)
- ✅ 최근 리뷰 목록 (사용자 정보 포함)

---

## ✅ 3. 프로모션 관리 API

### 상태: ✅ **완벽하게 구현됨**

### API 엔드포인트

#### 3.1. 내 모든 프로모션 조회
```typescript
GET /api/promotions/my
```

**프론트엔드 사용법**:
```typescript
import { getMyPromotions } from '@/lib/api/promotions';

const promotions = await getMyPromotions();
```

**응답 형식**:
```typescript
interface Promotion {
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

// 응답: Promotion[]
```

#### 3.2. 특정 업장의 프로모션 조회
```typescript
GET /api/promotions/places/:placeId?includeInactive=true
```

**프론트엔드 사용법**:
```typescript
import { getPromotionsByPlace } from '@/lib/api/promotions';

// 활성 프로모션만
const activePromotions = await getPromotionsByPlace(placeId);

// 비활성 포함
const allPromotions = await getPromotionsByPlace(placeId, true);
```

**파라미터**:
- `includeInactive`: boolean (기본값: false)

#### 3.3. 프로모션 상세 조회
```typescript
GET /api/promotions/:id
```

**프론트엔드 사용법**:
```typescript
import { getPromotionById } from '@/lib/api/promotions';

const promotion = await getPromotionById(id);
```

#### 3.4. 프로모션 생성
```typescript
POST /api/promotions/places/:placeId
```

**프론트엔드 사용법**:
```typescript
import { createPromotion } from '@/lib/api/promotions';

const newPromotion = await createPromotion(placeId, {
  title: '여름 휴가 특별 할인',
  description: '객실 30% 할인',
  startDate: '2025-07-01',
  endDate: '2025-08-31',
  isActive: true,  // 선택적
});
```

**DTO**:
```typescript
interface CreatePromotionDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}
```

#### 3.5. 프로모션 수정
```typescript
PUT /api/promotions/:id
```

**프론트엔드 사용법**:
```typescript
import { updatePromotion } from '@/lib/api/promotions';

const updated = await updatePromotion(id, {
  title: '가을 특별 할인',
  description: '객실 40% 할인',
  // 부분 업데이트 가능
});
```

**DTO**:
```typescript
interface UpdatePromotionDto extends Partial<CreatePromotionDto> {
  isActive?: boolean;
}
```

#### 3.6. 프로모션 삭제
```typescript
DELETE /api/promotions/:id
```

**프론트엔드 사용법**:
```typescript
import { deletePromotion } from '@/lib/api/promotions';

await deletePromotion(id);
```

#### 3.7. 프로모션 활성/비활성 토글
```typescript
PUT /api/promotions/:id/toggle
```

**프론트엔드 사용법**:
```typescript
import { togglePromotionStatus } from '@/lib/api/promotions';

const updated = await togglePromotionStatus(id);
// 응답: 업데이트된 Promotion 객체 (isActive가 토글됨)
```

---

## 📊 API 검토 결과 요약

| 기능 | API 상태 | 엔드포인트 | 비고 |
|------|----------|-----------|------|
| 내 업장 목록 | ✅ 완벽 | GET /api/business/places | 통계 포함 |
| 사업자 통계 요약 | ✅ 완벽 | GET /api/business/stats | 전체 요약 |
| 업장별 통계 | ✅ 완벽 | GET /api/business/stats/places | 목록 |
| 업장 상세 통계 | ✅ 완벽 | GET /api/business/stats/places/:id | 평점 분포, 최근 리뷰 |
| 내 프로모션 조회 | ✅ 완벽 | GET /api/promotions/my | 전체 프로모션 |
| 장소별 프로모션 | ✅ 완벽 | GET /api/promotions/places/:placeId | 필터링 지원 |
| 프로모션 상세 | ✅ 완벽 | GET /api/promotions/:id | |
| 프로모션 생성 | ✅ 완벽 | POST /api/promotions/places/:placeId | |
| 프로모션 수정 | ✅ 완벽 | PUT /api/promotions/:id | 부분 업데이트 |
| 프로모션 삭제 | ✅ 완벽 | DELETE /api/promotions/:id | |
| 프로모션 토글 | ✅ 완벽 | PUT /api/promotions/:id/toggle | 활성/비활성 |

---

## 🎯 Frontend 팀에 전달 사항

### 1. 업장 관리

#### API 사용
```typescript
import { getMyPlaces, getPlaceDetailStats } from '@/lib/api/business';

// 업장 목록 (통계 포함)
const places = await getMyPlaces();
places.forEach(place => {
  console.log(`${place.name}: ⭐ ${place.avgRating} (${place.reviewCount})`);
});

// 특정 업장 상세 통계
const stats = await getPlaceDetailStats(placeId);
console.log('평점 분포:', stats.ratingDistribution);
console.log('최근 리뷰:', stats.recentReviews);
```

#### 주요 특징
- **통계 자동 포함**: `getMyPlaces()` 응답에 통계 정보가 포함됨
- **상세 통계**: 평점 분포 및 최근 리뷰 제공
- **페이지네이션**: 현재 미지원 (모든 업장 반환)

### 2. 프로모션 관리

#### API 사용
```typescript
import {
  getMyPromotions,
  getPromotionsByPlace,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
} from '@/lib/api/promotions';

// 전체 프로모션
const allPromotions = await getMyPromotions();

// 특정 업장의 프로모션 (활성만)
const activePromotions = await getPromotionsByPlace(placeId);

// 특정 업장의 프로모션 (비활성 포함)
const allPlacePromotions = await getPromotionsByPlace(placeId, true);

// 프로모션 생성
const newPromotion = await createPromotion(placeId, {
  title: '특별 할인',
  description: '30% 할인',
  startDate: '2025-07-01',
  endDate: '2025-07-31',
  isActive: true,
});

// 프로모션 수정
await updatePromotion(promotionId, {
  title: '변경된 제목',
  // 필드 일부만 업데이트 가능
});

// 프로모션 삭제
await deletePromotion(promotionId);

// 활성/비활성 토글
const updated = await togglePromotionStatus(promotionId);
console.log('활성 상태:', updated.isActive);
```

#### 주요 특징
- **필터링**: `includeInactive` 파라미터로 비활성 프로모션 포함 여부 제어
- **부분 업데이트**: `updatePromotion`은 Partial DTO 사용
- **토글 편의성**: 별도 toggle API로 간편한 활성화/비활성화

### 3. 날짜 형식

**서버 날짜 형식**: ISO 8601 문자열
```typescript
startDate: "2025-07-01"
endDate: "2025-07-31"
createdAt: "2025-11-09T10:30:00.000Z"
```

**프론트엔드 처리**:
```typescript
// input type="date"와 호환
<input
  type="date"
  value={promotion.startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>

// 날짜 표시
new Date(promotion.startDate).toLocaleDateString('ko-KR');
// 출력: "2025. 7. 1."
```

### 4. 프로모션 상태 표시

```typescript
const getPromotionStatus = (promotion: Promotion) => {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);

  if (!promotion.isActive) {
    return { label: '비활성', color: 'red', icon: '🔴' };
  }

  if (now < start) {
    return { label: '예정', color: 'yellow', icon: '🟡' };
  }

  if (now > end) {
    return { label: '종료', color: 'gray', icon: '⚫' };
  }

  return { label: '진행 중', color: 'green', icon: '🟢' };
};
```

### 5. 에러 처리

```typescript
try {
  const promotion = await createPromotion(placeId, data);
  toast.success('프로모션이 생성되었습니다');
} catch (error: any) {
  if (error.response?.status === 400) {
    toast.error('입력 정보를 확인해주세요');
  } else if (error.response?.status === 403) {
    toast.error('권한이 없습니다');
  } else {
    toast.error('프로모션 생성에 실패했습니다');
  }
}
```

---

## 💡 추가 정보

### 1. 사업자 권한 확인

모든 business, promotions API는 사업자 권한 필요:
```typescript
// 인증 확인 (authStore)
const { isAuthenticated, user } = useAuthStore();

if (!isAuthenticated || user.role !== 'BUSINESS') {
  router.push('/login');
}
```

### 2. 업장 소유권 확인

- 프로모션 생성/수정/삭제 시 자동으로 소유권 검증
- 권한 없는 경우 403 Forbidden 응답

### 3. 페이지네이션

**현재**: 페이지네이션 미지원
- `getMyPlaces()`: 모든 업장 반환
- `getMyPromotions()`: 모든 프로모션 반환

**권장**: 프론트엔드에서 필터링/정렬
```typescript
// 활성 프로모션만
const activePromotions = promotions.filter(p => p.isActive);

// 진행 중인 프로모션만
const now = new Date();
const ongoing = promotions.filter(p =>
  p.isActive &&
  new Date(p.startDate) <= now &&
  new Date(p.endDate) >= now
);
```

### 4. 통계 갱신

- 통계는 리뷰, 북마크 변경 시 자동 갱신
- 실시간 갱신 아님 (캐시 가능)
- 필요 시 페이지 새로고침 또는 API 재호출

---

## 🔧 향후 개선 사항 (선택적)

### 백엔드

1. **페이지네이션 추가**
```typescript
GET /api/business/places?page=1&limit=10
GET /api/promotions/my?page=1&limit=20
```

2. **정렬 옵션 추가**
```typescript
GET /api/business/places?sort=rating&order=desc
GET /api/promotions/my?sort=createdAt&order=desc
```

3. **프로모션 이미지**
```typescript
interface CreatePromotionDto {
  // ...
  images?: string[];
}
```

4. **프로모션 통계**
```typescript
GET /api/promotions/:id/stats
// 응답: { views: number, clicks: number, conversions: number }
```

### 프론트엔드

1. **프론트엔드 필터링/정렬** (현재 권장)
2. **차트 라이브러리** (평점 분포 시각화)
3. **프로모션 템플릿** (자주 사용하는 형식 저장)
4. **일괄 작업** (여러 프로모션 동시 활성화/비활성화)

---

## 📝 타입 정의 위치

모든 타입은 `/src/types/business.ts`에 정의되어 있음:

```typescript
// business.ts
export interface MyPlace { ... }
export interface BusinessStatsSummary { ... }
export interface PlaceStats { ... }
export interface PlaceDetailStats { ... }
export interface Promotion { ... }
export interface CreatePromotionDto { ... }
export interface UpdatePromotionDto { ... }
```

---

## 🎉 결론

### API 준비 상태
- **업장 관리**: ✅ 100% 준비 완료
- **통계 API**: ✅ 100% 준비 완료
- **프로모션 관리**: ✅ 100% 준비 완료

### Frontend 구현 가능
모든 핵심 기능 즉시 구현 가능합니다!

### 특징
- ✅ 완전한 CRUD 지원
- ✅ 통계 정보 포함
- ✅ 활성/비활성 토글
- ✅ 필터링 옵션
- ✅ 타입 안정성 (TypeScript)

### 다음 단계
1. ✅ Backend API 검토 완료
2. ➡️ Frontend 페이지 구현
3. ➡️ 테스트
4. ➡️ 문서화

---

**검토 완료일**: 2025-11-09
**Backend Developer**: ✅ 검토 완료
**Frontend Team**: 구현 진행 가능
**상태**: API 준비 완료, Frontend 구현 시작 가능

**All systems ready! Let's build! 🚀**
