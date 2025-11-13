# 동행찾기 카테고리 삭제 작업 지시서

**발행일**: 2025-11-11
**프로젝트**: 예림투어 - 국내 여행 플랫폼
**발행자**: PO (Product Owner)
**우선순위**: 🔴 High

---

## 📋 작업 개요

커뮤니티 게시판에서 **"동행찾기 (COMPANION)"** 카테고리를 완전히 제거합니다.

### 변경 이유
- 사용자 혼란 방지
- 카테고리 단순화
- 서비스 방향 재정립

---

## 👥 팀별 작업 지시

### 1️⃣ Frontend 팀

#### 담당자: Frontend Developer
#### 우선순위: 🔴 High
#### 예상 소요 시간: 30분

#### 작업 내용

##### A. 타입 정의 수정

**파일**: `src/types/board.ts`

```typescript
// ❌ 수정 전
export type BoardCategory =
  | 'REVIEW'       // 여행후기
  | 'QNA'          // Q&A
  | 'COMPANION'    // 동행찾기 ← 삭제
  | 'RESTAURANT'   // 맛집
  | 'ACCOMMODATION' // 숙소
  | 'TOURIST'      // 관광지
  | 'FREE';        // 자유게시판

export const BOARD_CATEGORY_LABELS: Record<BoardCategory, string> = {
  REVIEW: '여행후기',
  QNA: 'Q&A',
  COMPANION: '동행찾기',  // ← 삭제
  RESTAURANT: '맛집',
  ACCOMMODATION: '숙소',
  TOURIST: '관광지',
  FREE: '자유게시판',
};

// ✅ 수정 후
export type BoardCategory =
  | 'REVIEW'       // 여행후기
  | 'QNA'          // Q&A
  | 'RESTAURANT'   // 맛집
  | 'ACCOMMODATION' // 숙소
  | 'TOURIST'      // 관광지
  | 'FREE';        // 자유게시판

export const BOARD_CATEGORY_LABELS: Record<BoardCategory, string> = {
  REVIEW: '여행후기',
  QNA: 'Q&A',
  RESTAURANT: '맛집',
  ACCOMMODATION: '숙소',
  TOURIST: '관광지',
  FREE: '자유게시판',
};
```

##### B. 게시판 목록 페이지 수정

**파일**: `src/app/(main)/boards/page.tsx`

**수정 위치**: 101-110줄

```typescript
// ❌ 수정 전
const tabs: { key: TabCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'REVIEW', label: BOARD_CATEGORY_LABELS.REVIEW },
  { key: 'QNA', label: BOARD_CATEGORY_LABELS.QNA },
  { key: 'COMPANION', label: BOARD_CATEGORY_LABELS.COMPANION },  // ← 삭제
  { key: 'RESTAURANT', label: BOARD_CATEGORY_LABELS.RESTAURANT },
  { key: 'ACCOMMODATION', label: BOARD_CATEGORY_LABELS.ACCOMMODATION },
  { key: 'TOURIST', label: BOARD_CATEGORY_LABELS.TOURIST },
  { key: 'FREE', label: BOARD_CATEGORY_LABELS.FREE },
];

// ✅ 수정 후
const tabs: { key: TabCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'REVIEW', label: BOARD_CATEGORY_LABELS.REVIEW },
  { key: 'QNA', label: BOARD_CATEGORY_LABELS.QNA },
  { key: 'RESTAURANT', label: BOARD_CATEGORY_LABELS.RESTAURANT },
  { key: 'ACCOMMODATION', label: BOARD_CATEGORY_LABELS.ACCOMMODATION },
  { key: 'TOURIST', label: BOARD_CATEGORY_LABELS.TOURIST },
  { key: 'FREE', label: BOARD_CATEGORY_LABELS.FREE },
];
```

##### C. 글쓰기 페이지 수정 (있는 경우)

**파일**: `src/app/(main)/boards/new/page.tsx`

카테고리 선택 드롭다운에서 COMPANION 옵션 제거:

```typescript
// 카테고리 선택 UI에서 COMPANION 제거
<option value="COMPANION">동행찾기</option>  // ← 이 줄 삭제
```

##### D. 마이페이지 게시글 목록 (있는 경우)

**파일**: `src/app/(main)/mypage/boards/page.tsx`

동일하게 COMPANION 카테고리 관련 코드 제거

#### 체크리스트

- [ ] `src/types/board.ts` 수정
  - [ ] `BoardCategory` 타입에서 `COMPANION` 제거
  - [ ] `BOARD_CATEGORY_LABELS`에서 `COMPANION` 항목 제거
- [ ] `src/app/(main)/boards/page.tsx` 수정
  - [ ] tabs 배열에서 COMPANION 제거
- [ ] `src/app/(main)/boards/new/page.tsx` 수정 (있는 경우)
  - [ ] 카테고리 선택 옵션에서 COMPANION 제거
- [ ] 기타 COMPANION 관련 코드 검색 및 제거
- [ ] 컴파일 에러 확인
- [ ] 타입 에러 확인
- [ ] 브라우저에서 UI 확인

---

### 2️⃣ Backend 팀

#### 담당자: Backend Developer
#### 우선순위: 🟡 Medium
#### 예상 소요 시간: 1시간

#### 작업 내용

##### A. 데이터베이스 마이그레이션

**주의**: 기존 COMPANION 카테고리 데이터 처리 방안 결정 필요

**옵션 1: 데이터 보존 (권장)**
```sql
-- COMPANION 카테고리 게시글을 FREE(자유게시판)로 이전
UPDATE boards
SET category = 'FREE'
WHERE category = 'COMPANION';
```

**옵션 2: 데이터 삭제 (신중)**
```sql
-- COMPANION 카테고리 게시글 완전 삭제 (연관 데이터도 삭제)
-- 댓글, 좋아요 등도 함께 삭제됨
DELETE FROM boards WHERE category = 'COMPANION';
```

**마이그레이션 파일 예시** (Prisma):
```typescript
// prisma/migrations/YYYYMMDDHHMMSS_remove_companion_category/migration.sql

-- Step 1: 기존 COMPANION 게시글을 FREE로 이전
UPDATE "boards"
SET "category" = 'FREE'
WHERE "category" = 'COMPANION';

-- Step 2: Enum에서 COMPANION 제거
-- (Prisma는 schema.prisma 수정 후 자동 생성)
```

##### B. Prisma Schema 수정

**파일**: `prisma/schema.prisma`

```prisma
// ❌ 수정 전
enum BoardCategory {
  REVIEW
  QNA
  COMPANION      // ← 삭제
  RESTAURANT
  ACCOMMODATION
  TOURIST
  FREE
}

// ✅ 수정 후
enum BoardCategory {
  REVIEW
  QNA
  RESTAURANT
  ACCOMMODATION
  TOURIST
  FREE
}
```

**마이그레이션 실행**:
```bash
npx prisma migrate dev --name remove_companion_category
npx prisma generate
```

##### C. DTO/Validation 수정

**파일**: `src/boards/dto/create-board.dto.ts`

```typescript
// ❌ 수정 전
@IsEnum(BoardCategory)
category: 'REVIEW' | 'QNA' | 'COMPANION' | 'RESTAURANT' | 'ACCOMMODATION' | 'TOURIST' | 'FREE';

// ✅ 수정 후
@IsEnum(BoardCategory)
category: 'REVIEW' | 'QNA' | 'RESTAURANT' | 'ACCOMMODATION' | 'TOURIST' | 'FREE';
```

##### D. 테스트 코드 수정

**파일**: `src/boards/*.spec.ts`

COMPANION 카테고리 관련 테스트 케이스 제거 또는 수정

```typescript
// ❌ 삭제
it('should create board with COMPANION category', () => {
  // ...
});

// 또는 다른 카테고리로 변경
it('should create board with FREE category', () => {
  // ...
});
```

#### 체크리스트

- [ ] 데이터 마이그레이션 전략 결정
  - [ ] 옵션 선택: 데이터 보존 or 삭제
  - [ ] DBA/PO와 확인
- [ ] `prisma/schema.prisma` 수정
  - [ ] `BoardCategory` enum에서 COMPANION 제거
- [ ] 마이그레이션 파일 생성
  - [ ] 기존 데이터 처리 SQL 작성
  - [ ] 마이그레이션 실행
- [ ] DTO 파일 수정
  - [ ] CreateBoardDto
  - [ ] UpdateBoardDto
  - [ ] FilterBoardDto
- [ ] Validation 수정
- [ ] 테스트 코드 수정
- [ ] API 엔드포인트 테스트
  - [ ] GET /api/boards?category=COMPANION → 400 에러 확인
  - [ ] POST /api/boards (category: COMPANION) → 400 에러 확인

---

### 3️⃣ QA 팀

#### 담당자: QA Engineer
#### 우선순위: 🟡 Medium
#### 예상 소요 시간: 1시간

#### 테스트 시나리오

##### A. Frontend 테스트

| 테스트 항목 | 예상 결과 | 상태 |
|------------|----------|------|
| 게시판 목록 페이지 접속 | COMPANION 탭 표시 안됨 | ⬜ |
| 전체 탭 클릭 | 정상 작동 | ⬜ |
| 여행후기 탭 클릭 | 정상 작동 | ⬜ |
| Q&A 탭 클릭 | 정상 작동 | ⬜ |
| 맛집 탭 클릭 | 정상 작동 | ⬜ |
| 숙소 탭 클릭 | 정상 작동 | ⬜ |
| 관광지 탭 클릭 | 정상 작동 | ⬜ |
| 자유게시판 탭 클릭 | 정상 작동 | ⬜ |
| 글쓰기 페이지 접속 | COMPANION 옵션 없음 | ⬜ |
| 게시글 작성 (각 카테고리) | 정상 작동 | ⬜ |
| 컴파일 에러 확인 | 에러 없음 | ⬜ |
| 브라우저 콘솔 에러 | 에러 없음 | ⬜ |

##### B. Backend 테스트

| API 엔드포인트 | 테스트 케이스 | 예상 결과 | 상태 |
|---------------|-------------|----------|------|
| GET /api/boards | 전체 조회 | 정상 응답 | ⬜ |
| GET /api/boards?category=COMPANION | COMPANION 필터 | 400 에러 | ⬜ |
| POST /api/boards | category: COMPANION | 400 에러 | ⬜ |
| POST /api/boards | category: REVIEW | 정상 생성 | ⬜ |
| PUT /api/boards/:id | category: COMPANION | 400 에러 | ⬜ |
| GET /api/boards?category=FREE | 기존 COMPANION 게시글 포함 | 정상 응답 | ⬜ |

##### C. 데이터베이스 테스트

| 테스트 항목 | 확인 사항 | 상태 |
|------------|----------|------|
| boards 테이블 조회 | category='COMPANION' 데이터 0건 | ⬜ |
| boards 테이블 조회 | category='FREE' 데이터 증가 확인 | ⬜ |
| Enum 타입 확인 | COMPANION 값 존재하지 않음 | ⬜ |

#### 체크리스트

- [ ] Frontend 테스트 완료
- [ ] Backend API 테스트 완료
- [ ] 데이터베이스 검증 완료
- [ ] 테스트 결과 문서화
- [ ] 발견된 버그 리포트

---

### 4️⃣ Documentation 팀

#### 담당자: Technical Writer
#### 우선순위: 🟢 Low
#### 예상 소요 시간: 30분

#### 작업 내용

##### A. API 문서 업데이트

**파일**: `docs/api/boards.md` 또는 Swagger 주석

```yaml
# ❌ 수정 전
BoardCategory:
  type: string
  enum:
    - REVIEW
    - QNA
    - COMPANION      # ← 삭제
    - RESTAURANT
    - ACCOMMODATION
    - TOURIST
    - FREE

# ✅ 수정 후
BoardCategory:
  type: string
  enum:
    - REVIEW
    - QNA
    - RESTAURANT
    - ACCOMMODATION
    - TOURIST
    - FREE
```

##### B. 사용자 가이드 업데이트

- 게시판 카테고리 설명에서 "동행찾기" 제거
- 스크린샷 업데이트 (COMPANION 탭 없는 화면)

##### C. 변경 로그 작성

**파일**: `CHANGELOG.md`

```markdown
## [1.x.x] - 2025-11-11

### Removed
- **커뮤니티**: 동행찾기(COMPANION) 카테고리 제거
  - 기존 동행찾기 게시글은 자유게시판으로 이동됨
```

#### 체크리스트

- [ ] API 문서 업데이트
- [ ] Swagger/OpenAPI 스펙 수정
- [ ] 사용자 가이드 업데이트
- [ ] CHANGELOG 작성
- [ ] 내부 위키 업데이트

---

## ⚠️ 주의사항

### 1. 데이터 손실 방지
- ✅ **반드시** 프로덕션 배포 전 백업
- ✅ 마이그레이션 전 데이터 개수 확인
- ✅ 롤백 계획 수립

### 2. 순서 지키기
```
1. Backend 데이터 마이그레이션 완료
   ↓
2. Backend Enum/DTO 수정
   ↓
3. Frontend 타입/UI 수정
   ↓
4. QA 테스트
   ↓
5. 배포
```

### 3. 커뮤니케이션
- 사용자 공지 (배포 1일 전)
- 팀 간 진행 상황 공유
- 이슈 발생 시 즉시 보고

---

## 📊 롤백 계획

만약 문제가 발생할 경우:

### Frontend 롤백
```bash
git revert <commit-hash>
npm run build
npm run deploy
```

### Backend 롤백
```bash
# 마이그레이션 롤백
npx prisma migrate rollback

# 코드 롤백
git revert <commit-hash>
npm run build
npm run deploy
```

### 데이터베이스 롤백
```sql
-- 백업된 데이터 복원
UPDATE boards
SET category = 'COMPANION'
WHERE id IN (SELECT id FROM boards_backup WHERE category = 'COMPANION');
```

---

## 🔍 검증 방법

### 1. Code Review
- [ ] Frontend PR 리뷰 완료
- [ ] Backend PR 리뷰 완료
- [ ] 2명 이상 승인

### 2. Staging 테스트
- [ ] Staging 환경 배포
- [ ] QA 테스트 완료
- [ ] 성능 영향 확인

### 3. Production 배포
- [ ] 점진적 배포 (Canary/Blue-Green)
- [ ] 모니터링 확인
- [ ] 에러 로그 확인

---

## 📅 일정

| 단계 | 담당 | 예상 시간 | 마감일 |
|------|------|---------|--------|
| Frontend 수정 | Frontend 팀 | 30분 | D-day |
| Backend 수정 | Backend 팀 | 1시간 | D-day |
| QA 테스트 | QA 팀 | 1시간 | D-day |
| Documentation | Doc 팀 | 30분 | D+1 |
| Staging 배포 | DevOps | 30분 | D+1 |
| Production 배포 | DevOps | 1시간 | D+2 |

**총 예상 소요 시간**: 4.5시간 (1일 이내 완료 가능)

---

## 📞 담당자 연락처

| 역할 | 이름 | 연락처 |
|------|------|--------|
| PO | - | - |
| Frontend Lead | - | - |
| Backend Lead | - | - |
| QA Lead | - | - |

---

## ✅ 최종 체크리스트

### 배포 전
- [ ] 모든 팀 작업 완료
- [ ] Code Review 완료
- [ ] QA 테스트 Pass
- [ ] 문서 업데이트 완료
- [ ] 백업 완료
- [ ] 롤백 계획 수립
- [ ] 사용자 공지 완료

### 배포 후
- [ ] Production 정상 동작 확인
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 모니터링
- [ ] 성능 지표 확인
- [ ] 완료 보고서 작성

---

## 📝 완료 보고서 (작업 후 작성)

### 작업 결과
- [ ] 성공
- [ ] 부분 성공 (이슈: _____________)
- [ ] 실패 (사유: _____________)

### 발견된 이슈
1.
2.
3.

### 개선 사항
1.
2.

---

**작성일**: 2025-11-11
**승인**: PO
**다음 리뷰**: 배포 후 1주일

---

## 🔗 관련 문서

- [게시판 API 문서](../backend/docs/api/boards.md)
- [데이터베이스 스키마](../backend/prisma/schema.prisma)
- [커뮤니티 이미지 수정 보고서](./BOARDS_IMAGE_FIX_REPORT.md)
- [검색 필터 기능 지시서](./PLACES_SEARCH_FILTER_FEATURE_DIRECTIVE.md)
