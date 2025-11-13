# Travel Platform Frontend

국내 여행 플랫폼 Frontend (Next.js + TypeScript + Tailwind CSS)

## 🎨 디자인 시스템

### 컬러 시스템: 스카이 블루 ✅
- **Primary 500**: `#0284C7` (메인 브랜드 컬러)
- **Secondary 500**: `#10B981` (성공, 긍정)
- 전체 컬러 시스템: `../design/COLOR_SYSTEM.md` 참고

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일 생성:

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 스크립트

- `npm run dev` - 개발 서버
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier 실행

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                # App Router
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   ├── page.tsx        # 메인 페이지
│   │   ├── globals.css     # 전역 스타일
│   │   ├── (main)/         # 메인 레이아웃 그룹
│   │   └── (auth)/         # 인증 레이아웃 그룹
│   ├── components/
│   │   ├── common/         # 공통 컴포넌트
│   │   └── layout/         # 레이아웃 컴포넌트
│   ├── lib/
│   │   ├── api/            # API 호출
│   │   ├── hooks/          # Custom Hooks
│   │   └── utils/          # 유틸리티
│   ├── stores/             # Zustand 스토어
│   └── types/              # TypeScript 타입
├── public/
│   ├── images/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts      # Tailwind 설정 (컬러 시스템 적용됨)
└── next.config.js
```

## 개발 현황

### ✅ 완료
- [x] Next.js 프로젝트 초기 설정
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [x] 스카이 블루 컬러 시스템 적용
- [x] 기본 폴더 구조
- [x] 메인 페이지 (임시)

### 🚧 다음 단계
- [ ] Header 컴포넌트
- [ ] Footer 컴포넌트
- [ ] 기본 레이아웃
- [ ] 공통 컴포넌트 (Button, Input, Card 등)
- [ ] 로그인/회원가입 페이지

## 참고 자료

- [프론트엔드 팀 계획서](./FRONTEND_TEAM_PLAN.md)
- [디자인 컬러 시스템](../design/COLOR_SYSTEM.md)
- [개발 로그](./DEVELOPMENT_LOG.md)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
