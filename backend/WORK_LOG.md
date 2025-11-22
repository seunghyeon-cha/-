# 백엔드팀 작업 기록

---

## 2024-11-21 백엔드 서버 초기 구축

### 작업자
- 팀: 백엔드

### 작업 내용
- Express + TypeScript 기반 API 서버 구축
- SQLite 데이터베이스 설정
- 인증 API 구현 (회원가입, 로그인, 사용자 정보)
- 장소 API 구현 (목록, 상세)
- 북마크 API 구현 (목록, 추가, 삭제, 확인)
- JWT 기반 인증 미들웨어 구현
- 샘플 장소 데이터 5개 추가

### 변경된 파일
- `package.json` - 의존성 정의
- `tsconfig.json` - TypeScript 설정
- `.env` - 환경 변수
- `src/index.ts` - 메인 서버
- `src/config/database.ts` - DB 설정 및 초기화
- `src/middleware/auth.middleware.ts` - JWT 인증
- `src/routes/auth.routes.ts` - 인증 API
- `src/routes/places.routes.ts` - 장소 API
- `src/routes/bookmarks.routes.ts` - 북마크 API

### API 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /health | 서버 상태 확인 |
| POST | /api/auth/register | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/auth/me | 현재 사용자 정보 |
| GET | /api/places | 장소 목록 |
| GET | /api/places/:id | 장소 상세 |
| GET | /api/bookmarks | 북마크 목록 |
| POST | /api/bookmarks | 북마크 추가 |
| DELETE | /api/bookmarks/:placeId | 북마크 삭제 |
| GET | /api/bookmarks/check/:placeId | 북마크 여부 확인 |

### 테스트 결과
- ✅ Health check: 정상
- ✅ 회원가입: 정상 (test@example.com)
- ✅ 로그인: 정상 (JWT 토큰 발급)
- ✅ 장소 목록: 정상 (5개 샘플 데이터)

### 서버 정보
- 포트: 4000
- 데이터베이스: SQLite (`/data/yerim-tour.db`)

### 테스트 계정
- 이메일: test@example.com
- 비밀번호: password123

### 비고
- 프론트엔드와 연동을 위해 CORS 설정 완료 (localhost:3000, 3001)
- 추후 추가 필요: 맛집, 숙소, 축제, 커뮤니티 API

---

## 2024-11-21 프론트엔드 API 호환성 수정

### 작업자
- 팀: 백엔드

### 문제 상황
- 프론트엔드에서 로그인/회원가입이 작동하지 않음
- API 엔드포인트 경로 불일치: 프론트엔드는 `/signup`, 백엔드는 `/register`
- 응답 형식 불일치: 프론트엔드는 `accessToken/refreshToken`, 백엔드는 `token`

### 작업 내용
1. 회원가입 엔드포인트 추가: `/api/auth/signup`
2. 로그인/회원가입 응답 형식 변경
   - `token` → `accessToken`, `refreshToken`
   - `user` 객체에 `role` 필드 추가
3. 에러 응답 형식 통일: `error` → `message`

### 변경된 파일
- `src/routes/auth.routes.ts` - 인증 API 엔드포인트 및 응답 형식 수정

### API 엔드포인트 (업데이트)
| Method | Endpoint | 설명 | 비고 |
|--------|----------|------|------|
| POST | /api/auth/signup | 회원가입 (프론트엔드용) | 신규 |
| POST | /api/auth/register | 회원가입 (호환성) | 기존 유지 |
| POST | /api/auth/login | 로그인 | 응답 형식 변경 |

### 응답 형식 (수정 후)
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "사용자",
    "role": "USER"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### 테스트 결과
- ✅ 회원가입 (signup): 정상 - 토큰 발급 확인
- ✅ 로그인: 정상 - accessToken, refreshToken 발급 확인
- ✅ 기존 test@example.com 계정 로그인 성공

### 비고
- 프론트엔드 `/lib/api/auth.ts`와 완전 호환
- 기존 `/register` 엔드포인트는 하위 호환성을 위해 유지

---

## 2024-11-21 Places API 응답 형식 수정

### 작업자
- 팀: 백엔드

### 문제 상황
- 프론트엔드에서 관광지/맛집/숙소 데이터가 표시되지 않음
- API 응답 형식 불일치: 프론트엔드는 `{data, meta}`, 백엔드는 단순 배열

### 작업 내용
1. Places API 응답 형식을 프론트엔드 호환 형식으로 변경
2. 페이지네이션 지원 추가 (page, limit, totalPages)
3. 정렬 옵션 지원 (latest, rating, reviews)
4. 지역 필터 지원
5. 장소 데이터 형식 변환 (프론트엔드 Place 인터페이스 호환)

### 변경된 파일
- `src/routes/places.routes.ts` - 장소 목록 API 응답 형식 수정

### API 응답 형식 (수정 후)
```json
{
  "data": [
    {
      "id": "p1",
      "name": "경복궁",
      "category": "TOURIST",
      "description": "조선시대 대표적인 궁궐",
      "address": "서울시 종로구",
      "lat": 37.5665,
      "lng": 126.9780,
      "images": ["/images/gyeongbokgung.jpg"],
      "averageRating": 4.8,
      "reviewCount": 53,
      "createdAt": "2025-11-21",
      "owner": { "id": "system", "name": "예림투어" }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 테스트 결과
- ✅ Places API: 정상 - 프론트엔드 호환 형식 반환
- ✅ 페이지네이션: 정상 - total, page, totalPages 반환
- ✅ 카테고리 필터: 정상

### 비고
- 프론트엔드 `/lib/api/places.ts`의 `PlacesResponse` 인터페이스와 완전 호환
- 임시 좌표 및 리뷰 수 데이터 사용 (추후 실제 데이터로 교체 필요)
