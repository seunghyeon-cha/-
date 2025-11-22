# Frontend Team - Work Order

**발행일**: 2025-11-19
**우선순위**: 높음 (P1)
**담당자**: Frontend Team
**예상 소요 시간**: 2시간

---

## 작업 개요

프로덕션 환경의 SEO 및 소셜 미디어 공유 최적화를 위한 metadataBase 설정 추가 및 ESLint 설정 구성

---

## 작업 1: metadataBase 설정 추가

### 문제 상황

**경고 메시지**:
```
metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000"
```

**영향도**:
- 프로덕션에서 소셜 미디어 공유 시 이미지가 표시되지 않음
- SEO 최적화가 제대로 작동하지 않음
- Open Graph 및 Twitter Card 메타데이터 문제

### 작업 내용

#### Task 1.1: 환경변수 설정
```bash
# .env.local 파일에 추가
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

#### Task 1.2: 루트 레이아웃 수정
**파일**: `src/app/layout.tsx`

다음과 같이 metadataBase 추가:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: '여행 플랫폼',
  description: '...',
  // 기존 메타데이터...
}
```

#### Task 1.3: 검증
- 빌드 시 경고 메시지가 사라지는지 확인
- 로컬에서 Open Graph 메타태그 확인
- 프로덕션 배포 후 소셜 미디어 공유 테스트

### 체크리스트

- [ ] 환경변수 설정 (.env.local, .env.production)
- [ ] 루트 레이아웃에 metadataBase 추가
- [ ] 빌드 경고 해결 확인
- [ ] Open Graph 메타태그 검증
- [ ] 소셜 미디어 공유 테스트 (Twitter, Facebook)

---

## 작업 2: ESLint 설정

### 문제 상황

**현재 상태**: ESLint가 설정되지 않아 코드 품질 검사 불가능

**영향도**:
- 코드 스타일 일관성 부족
- 잠재적 버그 사전 감지 불가
- Next.js 베스트 프랙티스 위반 가능성

### 작업 내용

#### Task 2.1: ESLint 초기 설정
```bash
# Next.js ESLint 설정 (Strict 권장)
npm run lint
# 프롬프트에서 "Strict (recommended)" 선택
```

#### Task 2.2: 추가 ESLint 플러그인 설치
```bash
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react-hooks
npm install -D eslint-config-prettier eslint-plugin-prettier
```

#### Task 2.3: .eslintrc.json 커스터마이징

다음 설정 추가:
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### Task 2.4: package.json 스크립트 추가
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}
```

#### Task 2.5: 기존 코드 린트 수정
```bash
# 자동 수정 가능한 항목 처리
npm run lint:fix

# 수동 수정 필요한 항목 확인 및 처리
npm run lint
```

### 체크리스트

- [ ] ESLint 초기 설정 완료 (Strict mode)
- [ ] 추가 플러그인 설치
- [ ] .eslintrc.json 커스터마이징
- [ ] package.json 스크립트 추가
- [ ] 기존 코드 린트 에러 수정
- [ ] .eslintignore 파일 생성 (필요시)
- [ ] VSCode 설정 추가 (자동 lint on save)

---

## VSCode 설정 권장사항

`.vscode/settings.json` 생성:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

---

## 참고 자료

- [Next.js ESLint Documentation](https://nextjs.org/docs/basic-features/eslint)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 완료 보고

작업 완료 후 다음 정보를 포함하여 보고:
1. metadataBase 설정 전/후 빌드 로그 비교
2. ESLint 설정 후 발견된 주요 이슈 목록
3. 수정한 코드 품질 문제 요약
4. 소셜 미디어 공유 테스트 결과
5. 추가 개선 제안 사항
