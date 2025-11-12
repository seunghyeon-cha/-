# 예림투어 (YeRim Tour) 프로젝트

> 국내 여행의 모든 것! 관광지, 맛집, 숙소 정보를 제공하고 사용자 커뮤니티를 통해 여행 경험을 공유하는 종합 여행 플랫폼

**프로젝트 타입**: 실제 서비스 런칭
**참고 플랫폼**: 보배드림 (커뮤니티 구조)
**작성일**: 2025-10-28

---

## 📋 프로젝트 개요

### 핵심 기능
1. **장소 정보 시스템**: 관광지, 맛집, 숙소 정보 제공
2. **리뷰 시스템**: 사용자 리뷰 및 평점
3. **여행 일정 계획**: 맞춤형 여행 일정 생성 및 공유
4. **지도 연동**: Kakao Map API를 통한 위치 기반 서비스
5. **커뮤니티 게시판**: 여행 후기, 질문/답변, 동행 찾기 등
6. **사업자 시스템**: 사업자 인증 및 업장 홍보
7. **북마크 & 알림**: 사용자 편의 기능

### 데이터 소스
- 공공 API (한국관광공사 Tour API 4.0)
- 사업자 직접 등록
- 사용자 리뷰 및 콘텐츠

---

## 🏗️ 프로젝트 구조

```
travel/
├── backend/                    # 백엔드 (NestJS)
│   ├── BACKEND_TEAM_PLAN.md   # 백엔드 팀 계획서 📄
│   ├── src/                   # 소스 코드
│   ├── prisma/                # 데이터베이스 스키마
│   └── README.md              # 백엔드 README
│
├── frontend/                   # 프론트엔드 (Next.js)
│   ├── FRONTEND_TEAM_PLAN.md  # 프론트엔드 팀 계획서 📄
│   └── (개발 시작 대기)
│
├── design/                     # 디자인
│   ├── DESIGN_TEAM_PLAN.md    # 디자인 팀 계획서 📄
│   └── (Figma 파일 링크 추가 예정)
│
├── PROJECT_SPEC.md            # 전체 프로젝트 명세서 📄
├── DATABASE_SCHEMA.md         # 데이터베이스 ERD 📄
└── README.md                  # 이 파일
```

---

## 👥 팀 구성 및 역할

### Product Owner (PO)
**역할**:
- 프로젝트 전체 기획 및 요구사항 정의
- 각 팀 간 커뮤니케이션 조율
- 우선순위 결정 및 일정 관리
- 최종 결과물 승인

**주요 산출물**:
- ✅ [전체 프로젝트 명세서](./PROJECT_SPEC.md)
- ✅ [데이터베이스 스키마](./DATABASE_SCHEMA.md)
- ✅ 각 팀별 계획서

---

### 백엔드 팀
**역할**:
- RESTful API 개발
- 데이터베이스 설계 및 구축
- 외부 API 연동 (한국관광공사, Kakao)
- 인증/인가 시스템 구현
- 파일 업로드 시스템 (S3)

**기술 스택**:
- NestJS (Node.js Framework)
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT + Passport.js
- AWS S3

**계획서**: [백엔드 팀 계획서 보기](./backend/BACKEND_TEAM_PLAN.md) 📄

**시작하기**:
```bash
cd backend
npm install
# 환경 변수 설정 후
npm run prisma:migrate
npm run start:dev
```

---

### 프론트엔드 팀
**역할**:
- 사용자 인터페이스 구현
- API 연동
- 반응형 디자인 구현
- SEO 최적화
- 상태 관리 및 성능 최적화

**기술 스택**:
- Next.js 14+ (React Framework)
- TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- React Query (서버 상태)
- Kakao Map API

**계획서**: [프론트엔드 팀 계획서 보기](./frontend/FRONTEND_TEAM_PLAN.md) 📄

**시작하기**:
```bash
cd frontend
# (개발 시작 시 추가 예정)
```

---

### 디자인 팀
**역할**:
- UI/UX 디자인
- 브랜드 아이덴티티 (로고, 컬러)
- 디자인 시스템 구축
- 프로토타입 제작
- 프론트엔드 팀과 협업

**도구**:
- Figma (메인)
- Adobe Illustrator (로고, 일러스트)
- Photoshop (이미지 편집)

**계획서**: [디자인 팀 계획서 보기](./design/DESIGN_TEAM_PLAN.md) 📄

**Figma 링크**: (추후 추가)

---

## 📅 전체 개발 일정

### Phase 1: 기획 및 설계 (1주) ✅
- [x] 프로젝트 명세서 작성
- [x] 데이터베이스 스키마 설계
- [x] 각 팀 계획서 작성
- [x] 기술 스택 결정

### Phase 2: 디자인 & 백엔드 기본 인프라 (2주)
**디자인 팀**:
- [ ] 브랜딩 (로고, 컬러, 타이포그래피)
- [ ] 기본 컴포넌트 디자인
- [ ] 메인/로그인 페이지 디자인

**백엔드 팀**:
- [ ] 데이터베이스 구축
- [ ] 인증/인가 시스템
- [ ] 기본 API 구조

### Phase 3: 프론트엔드 시작 & 디자인 계속 (3주)
**프론트엔드 팀**:
- [ ] 프로젝트 초기 설정
- [ ] 레이아웃 및 공통 컴포넌트
- [ ] 인증 페이지 구현

**디자인 팀**:
- [ ] 장소/커뮤니티 페이지 디자인

**백엔드 팀**:
- [ ] 장소 API 구현
- [ ] 한국관광공사 API 연동

### Phase 4: 핵심 기능 개발 (6주)
**전체 팀**:
- [ ] 장소 정보 시스템
- [ ] 리뷰 시스템
- [ ] 커뮤니티 게시판
- [ ] 여행 일정 기능

### Phase 5: 사업자 시스템 & 부가 기능 (3주)
**전체 팀**:
- [ ] 사업자 인증 및 관리
- [ ] 북마크 & 알림
- [ ] 검색 최적화

### Phase 6: 테스트 & 최적화 (2주)
- [ ] 통합 테스트
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 보안 점검

### Phase 7: 배포 준비 (1주)
- [ ] 프로덕션 환경 설정
- [ ] 배포 및 모니터링
- [ ] 최종 QA

**예상 총 기간**: 18주 (약 4.5개월)

---

## 📄 주요 문서

| 문서명 | 설명 | 링크 |
|--------|------|------|
| 프로젝트 명세서 | 전체 기능 및 기술 스택 | [보기](./PROJECT_SPEC.md) |
| 데이터베이스 ERD | DB 스키마 및 관계 | [보기](./DATABASE_SCHEMA.md) |
| 백엔드 계획서 | API 개발 상세 계획 | [보기](./backend/BACKEND_TEAM_PLAN.md) |
| 프론트엔드 계획서 | 페이지별 개발 계획 | [보기](./frontend/FRONTEND_TEAM_PLAN.md) |
| 디자인 계획서 | UI/UX 디자인 가이드 | [보기](./design/DESIGN_TEAM_PLAN.md) |

---

## 🎯 성공 지표 (KPI)

### 런칭 목표
- [ ] 전국 장소 정보 3,000개 이상 등록
- [ ] 사용자 리뷰 1,000개 이상
- [ ] 커뮤니티 게시글 500개 이상
- [ ] 월 활성 사용자 (MAU) 1,000명
- [ ] 페이지 로딩 속도 2초 이내

### 품질 목표
- [ ] API 응답 시간 200ms 이하
- [ ] Lighthouse 점수 90점 이상
- [ ] 모바일 반응형 100% 지원
- [ ] 브라우저 호환성 (Chrome, Safari, Firefox, Edge)

---

## 🔧 개발 환경 설정

### 필수 설치 항목
- Node.js 20+
- PostgreSQL 15+
- Git
- Docker (선택, 추천)

### 환경 변수
각 팀별로 `.env.example`을 참고하여 `.env` 파일 생성

**백엔드**:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `JWT_SECRET`: JWT 비밀키
- 외부 API 키들 (Kakao, Tour API 등)

**프론트엔드**:
- `NEXT_PUBLIC_API_URL`: 백엔드 API 주소
- `NEXT_PUBLIC_KAKAO_MAP_KEY`: Kakao Map API 키

---

## 📞 커뮤니케이션

### 일일 스탠드업
- **시간**: 매일 오전 10시
- **참석**: 전체 팀
- **형식**: 어제 한 일, 오늘 할 일, 블로커

### 주간 전체 미팅
- **시간**: 매주 금요일 오후 5시
- **참석**: PO + 전체 팀
- **내용**: 주간 진행 상황, 다음 주 계획, 이슈 논의

### 팀별 협업
- **디자인 ↔ 프론트엔드**: 주 2회 리뷰
- **프론트엔드 ↔ 백엔드**: API 명세 공유, 수시 소통
- **백엔드 ↔ 데이터베이스**: Prisma 스키마 변경 시 공유

### 커뮤니케이션 채널
- Slack (추천) 또는 Discord
  - #general: 전체 공지
  - #backend: 백엔드 팀
  - #frontend: 프론트엔드 팀
  - #design: 디자인 팀
  - #random: 자유

---

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone <repository-url>
cd travel
```

### 2. 각 팀별 계획서 확인
- **백엔드**: `backend/BACKEND_TEAM_PLAN.md`
- **프론트엔드**: `frontend/FRONTEND_TEAM_PLAN.md`
- **디자인**: `design/DESIGN_TEAM_PLAN.md`

### 3. 개발 환경 설정
각 팀별 README 참고

### 4. 개발 시작!

---

## 📌 중요 안내사항

### PO의 역할
- 직접 개발하지 않음
- 기획, 조율, 의사결정에 집중
- 각 팀의 산출물 검토 및 승인

### 개발 원칙
1. **문서화**: 모든 결정 사항은 문서로 남김
2. **커뮤니케이션**: 문제는 즉시 공유
3. **코드 리뷰**: Pull Request는 최소 1명 이상 리뷰
4. **테스트**: 주요 기능은 반드시 테스트 작성
5. **보안**: 민감 정보는 환경 변수로 관리

### Git 브랜치 전략
- `main`: 프로덕션
- `develop`: 개발
- `feature/기능명`: 기능 개발
- `hotfix/버그명`: 긴급 수정

---

## 📚 참고 자료

### 외부 API
- [한국관광공사 Tour API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15101578)
- [Kakao Developers](https://developers.kakao.com/)
- [Naver Developers](https://developers.naver.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

### 기술 문서
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

### 디자인 영감
- [에어비앤비](https://www.airbnb.co.kr/)
- [트립어드바이저](https://www.tripadvisor.co.kr/)
- [보배드림](https://www.bobaedream.co.kr/)

---

## 🎉 프로젝트 시작!

각 팀은 해당 계획서를 확인하고 개발을 시작하세요!

**백엔드 팀**: [백엔드 계획서 보기](./backend/BACKEND_TEAM_PLAN.md)
**프론트엔드 팀**: [프론트엔드 계획서 보기](./frontend/FRONTEND_TEAM_PLAN.md)
**디자인 팀**: [디자인 계획서 보기](./design/DESIGN_TEAM_PLAN.md)

궁금한 점이 있으면 PO에게 문의하세요!

---

**프로젝트 시작일**: 2025-10-28
**목표 런칭일**: 2025년 상반기

**모두 화이팅! 🚀**
# travel
# travel
# smartrip
# smartrip
