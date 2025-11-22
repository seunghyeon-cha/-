# 남은 작업 로드맵 및 진행 방향

**작성일**: 2025-11-19
**현재 상태**: Phase 2 완료, 코드 품질 87.5% 개선

---

## 📊 현재 프로젝트 상태

### 코드 품질 지표
- **총 소스 파일**: 97개 (.ts/.tsx)
- **ESLint 경고**: 5개 (business 페이지만 해당)
- **빌드 상태**: ✅ 성공
- **타입 안전성**: 95% 이상 (일부 business 페이지 제외)
- **이미지 최적화**: 대부분 완료 (Next.js Image 적용)

### 완료된 작업
✅ Phase 1: 초기 설정 및 에러 해결 (GitHub YAML, metadataBase, ESLint)
✅ Phase 2: 코드 품질 개선 (40개 → 5개 경고)
  - Mypage 모듈 (11 issues)
  - Itinerary 모듈 (9 issues)
  - Places/Festivals 모듈 (7 issues)
  - Main page (4 issues)

---

## 🎯 남은 작업 (중요도 순)

---

## **Priority 1 (높음) - 즉시 진행 가능**

### 1.1 Business 모듈 코드 품질 개선 ⚠️
**예상 시간**: 30분
**난이도**: 낮음
**중요도**: ⭐⭐⭐

**작업 내용**:
- `business/stats/page.tsx`: any 타입 1개 수정
- `business/verify/page.tsx`:
  - 미사용 변수 2개 제거 (user, error)
  - any 타입 2개 수정

**작업 방법**:
```typescript
// 기존 패턴 그대로 적용
import { AxiosError } from 'axios';
// any 타입을 적절한 타입으로 변경
// 미사용 변수 제거
```

**완료 기준**:
- ESLint 경고 0개
- npm run build 성공

---

### 1.2 테스트 코드 작성 🧪
**예상 시간**: 4-6시간
**난이도**: 중간
**중요도**: ⭐⭐⭐⭐

**배경**:
- Playwright E2E 테스트 환경은 이미 구축됨 (package.json 확인)
- 하지만 실제 테스트 코드는 없음

**작업 내용**:
1. **핵심 User Journey 테스트 작성**
   ```typescript
   // tests/e2e/user-journey.spec.ts
   - 회원가입 → 로그인 → 장소 검색 → 북마크 → 일정 생성
   - 게시글 작성 → 수정 → 삭제
   - 리뷰 작성 → 수정 → 삭제
   ```

2. **페이지별 기본 테스트**
   ```typescript
   // tests/e2e/pages/*.spec.ts
   - 메인 페이지 렌더링
   - 장소 목록/상세 페이지
   - 축제 목록/상세 페이지
   - 마이페이지
   - 일정 관리
   ```

3. **API 에러 핸들링 테스트**
   ```typescript
   - 401 에러 시 로그인 페이지 리다이렉트
   - 404 에러 시 적절한 에러 메시지
   - 네트워크 에러 시 재시도 로직
   ```

**작업 순서**:
```bash
# 1. 테스트 작업 지시서 작성
WORK_ORDER_TESTING_TEAM.md 생성

# 2. 핵심 시나리오부터 시작
tests/e2e/critical-paths.spec.ts

# 3. 점진적으로 확장
tests/e2e/features/*.spec.ts
```

**완료 기준**:
- 핵심 User Journey 3개 이상 테스트 통과
- CI/CD에서 자동 실행 가능

---

## **Priority 2 (중간) - 다음 스프린트**

### 2.1 성능 최적화 🚀
**예상 시간**: 2-3시간
**난이도**: 중간
**중요도**: ⭐⭐⭐⭐

**현재 상태**:
- Phase 9, 10에서 성능 분석 완료된 것으로 보임 (PHASE9_PERFORMANCE_ANALYSIS.md 존재)
- 추가 최적화 필요 여부 확인 필요

**작업 내용**:
1. **Lighthouse 점수 측정**
   ```bash
   # 현재 점수 확인
   - Performance: ?
   - Accessibility: ?
   - Best Practices: ?
   - SEO: ?
   ```

2. **Core Web Vitals 개선**
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

3. **이미지 최적화 검증**
   - 모든 이미지가 Next.js Image 사용하는지 확인
   - WebP 포맷 적용 확인

4. **코드 스플리팅 검증**
   - 번들 사이즈 분석
   - Dynamic import 적용 여부

**작업 방법**:
```bash
# Lighthouse CI 설정
npm install -D @lhci/cli
# lighthouserc.js 생성
# GitHub Actions에 통합
```

---

### 2.2 접근성 (Accessibility) 개선 ♿
**예상 시간**: 3-4시간
**난이도**: 중간
**중요도**: ⭐⭐⭐

**작업 내용**:
1. **ARIA 속성 추가**
   ```typescript
   // 모든 interactive 요소에 적절한 ARIA 속성
   - aria-label
   - aria-describedby
   - role 속성
   ```

2. **키보드 네비게이션 개선**
   - Tab 순서 확인
   - Focus indicator 명확하게
   - Escape 키로 모달 닫기

3. **스크린 리더 최적화**
   - 의미있는 alt 텍스트
   - 헤딩 구조 올바르게
   - Skip to content 링크

4. **색상 대비 개선**
   - WCAG AA 기준 충족 (4.5:1)

**검증 방법**:
```bash
# axe DevTools 사용
npm install -D @axe-core/react
# 자동화된 접근성 테스트
```

---

### 2.3 에러 바운더리 및 로깅 시스템 📝
**예상 시간**: 2-3시간
**난이도**: 중간
**중요도**: ⭐⭐⭐

**작업 내용**:
1. **Error Boundary 구현**
   ```typescript
   // src/components/error/ErrorBoundary.tsx
   - 페이지 레벨 에러 캐치
   - 사용자 친화적 에러 메시지
   - 에러 리포팅 (선택사항)
   ```

2. **에러 로깅 시스템**
   ```typescript
   // src/lib/logger.ts
   - 프로덕션 환경에서 에러 수집
   - Sentry 또는 LogRocket 통합 (선택사항)
   ```

3. **에러 복구 전략**
   - 자동 재시도 로직
   - Fallback UI
   - 사용자에게 명확한 액션 제공

---

## **Priority 3 (낮음) - 추후 고려**

### 3.1 국제화 (i18n) 🌐
**예상 시간**: 4-6시간
**난이도**: 중간-높음
**중요도**: ⭐⭐

**작업 내용**:
- next-intl 또는 react-i18next 도입
- 한국어/영어 지원
- 날짜/통화 포맷 로케일별 처리

---

### 3.2 PWA (Progressive Web App) 📱
**예상 시간**: 2-3시간
**난이도**: 낮음-중간
**중요도**: ⭐⭐

**작업 내용**:
- Service Worker 등록
- manifest.json 생성
- 오프라인 지원
- 푸시 알림 (선택사항)

---

### 3.3 SEO 최적화 🔍
**예상 시간**: 2-3시간
**난이도**: 낮음
**중요도**: ⭐⭐⭐

**작업 내용**:
- sitemap.xml 자동 생성 (이미 있는 듯)
- robots.txt 최적화 (이미 있는 듯)
- Open Graph 메타태그 페이지별 설정
- Structured Data (JSON-LD) 추가
- 동적 메타데이터 생성

---

### 3.4 보안 강화 🔒
**예상 시간**: 3-4시간
**난이도**: 중간-높음
**중요도**: ⭐⭐⭐⭐

**작업 내용**:
1. **XSS 방어**
   - DOMPurify 사용 (리치 텍스트 에디터)
   - CSP (Content Security Policy) 헤더

2. **CSRF 방어**
   - CSRF 토큰 구현 (백엔드 협업 필요)

3. **Rate Limiting**
   - API 요청 제한

4. **환경변수 보안**
   - .env 파일 Git에서 제외 확인
   - 민감한 정보 암호화

---

## 🛠️ 기술 부채 정리

### 4.1 타입 정의 정리 📋
**예상 시간**: 1-2시간
**난이도**: 낮음
**중요도**: ⭐⭐

**작업 내용**:
- `src/types/` 폴더 구조 재정리
- 중복 타입 정의 통합
- API 응답 타입 일관성 확보
- JSDoc 주석 추가

---

### 4.2 컴포넌트 리팩토링 🎨
**예상 시간**: 4-6시간
**난이도**: 중간
**중요도**: ⭐⭐

**작업 내용**:
1. **공통 컴포넌트 개선**
   - Button 컴포넌트 variants 추가
   - Input 컴포넌트 validation 개선
   - Modal 컴포넌트 접근성 개선

2. **커스텀 훅 추출**
   ```typescript
   // 반복되는 로직을 커스텀 훅으로
   - useAuth
   - useFetch
   - useDebounce (이미 있을 가능성)
   - useInfiniteScroll
   ```

3. **상태 관리 개선**
   - Zustand 사용 검토 (authStore, toastStore 존재)
   - 전역 상태 최소화
   - 로컬 상태 우선 사용

---

### 4.3 API 레이어 개선 🔌
**예상 시간**: 2-3시간
**난이도**: 중간
**중요도**: ⭐⭐⭐

**작업 내용**:
1. **API 함수 일관성**
   - 모든 API 함수에 에러 핸들링
   - 타입 안전성 100%
   - 로딩/에러 상태 통일

2. **React Query 최적화**
   ```typescript
   // 캐싱 전략 개선
   - staleTime, cacheTime 설정
   - refetchOnWindowFocus 최적화
   - optimistic update 패턴
   ```

---

## 📈 추천 작업 순서

### **Week 1: 필수 작업**
```
Day 1-2: Business 모듈 코드 품질 개선 (1.1)
Day 3-5: 핵심 E2E 테스트 작성 (1.2)
```

### **Week 2: 품질 향상**
```
Day 1-2: 성능 최적화 (2.1)
Day 3-4: 접근성 개선 (2.2)
Day 5: 에러 바운더리 구현 (2.3)
```

### **Week 3: 안정성 강화**
```
Day 1-2: 보안 강화 (3.4)
Day 3-4: API 레이어 개선 (4.3)
Day 5: E2E 테스트 확장
```

### **Week 4: 최적화 및 정리**
```
Day 1-2: SEO 최적화 (3.3)
Day 3-4: 컴포넌트 리팩토링 (4.2)
Day 5: 문서화 및 배포 준비
```

---

## 🎓 작업 진행 가이드

### 작업 시작 전
1. ✅ **git branch 생성**
   ```bash
   git checkout -b feature/business-module-quality
   ```

2. ✅ **작업 지시서 작성** (PO 역할)
   ```bash
   # 예: WORK_ORDER_BUSINESS_MODULE.md
   - 작업 목표
   - 수정할 파일 목록
   - 예상 시간
   - 완료 기준
   ```

3. ✅ **TodoWrite로 작업 추적**
   ```typescript
   [
     { content: "Business stats any 타입 수정", status: "in_progress" },
     { content: "Business verify 미사용 변수 제거", status: "pending" }
   ]
   ```

### 작업 중
1. ✅ **에러 즉시 해결**
   - 빌드 에러 발생 시 즉시 수정
   - 작업 로그 기록

2. ✅ **패턴 일관성 유지**
   - 기존 코드 패턴 따르기
   - AxiosError, useCallback 등

3. ✅ **테스트 확인**
   ```bash
   npm run lint        # ESLint 통과
   npm run build       # 빌드 성공
   npm run test:e2e    # E2E 테스트 통과 (작성 후)
   ```

### 작업 완료 후
1. ✅ **완료 보고서 작성**
   ```markdown
   # [TASK]_COMPLETION_REPORT.md
   - Before/After 비교
   - 해결한 이슈 목록
   - 발견한 추가 이슈
   - 배운 점
   ```

2. ✅ **커밋 및 PR**
   ```bash
   git add .
   git commit -m "feat: Improve business module code quality"
   git push origin feature/business-module-quality
   # PR 생성 (GitHub)
   ```

---

## 📌 핵심 원칙

1. **점진적 개선**: 한 번에 모든 것을 고치려 하지 말 것
2. **테스트 우선**: 변경 전에 테스트 작성
3. **문서화 필수**: 모든 작업은 문서로 기록
4. **패턴 일관성**: 기존 코드 스타일 유지
5. **에러 제로**: 경고도 에러로 간주

---

## 🚀 즉시 시작 가능한 작업

**다음 명령어로 바로 시작하세요**:
```bash
# 1. Business 모듈 코드 품질 개선
"business 모듈의 남은 5개 ESLint 경고를 해결해줘.
기존 Phase 2 패턴대로 AxiosError 타입과 미사용 변수를 정리하고,
작업 완료 후 빌드 테스트까지 해줘"

# 2. E2E 테스트 작성
"Playwright로 핵심 User Journey E2E 테스트를 작성해줘.
1. 로그인 → 장소 검색 → 북마크
2. 게시글 작성 → 수정 → 삭제
3. 일정 생성 → 수정 → 삭제
이 3개 시나리오부터 시작하자"
```

---

## 📊 성공 지표

### 단기 목표 (1-2주)
- ✅ ESLint 경고 0개
- ✅ E2E 테스트 커버리지 30% 이상
- ✅ Lighthouse Performance 점수 80+

### 중기 목표 (1개월)
- ✅ E2E 테스트 커버리지 60% 이상
- ✅ 접근성 점수 90+
- ✅ 보안 체크리스트 100% 완료

### 장기 목표 (2-3개월)
- ✅ E2E 테스트 커버리지 80% 이상
- ✅ Lighthouse 모든 항목 95+
- ✅ 프로덕션 배포 준비 완료

---

## 💡 팁

### AI 에이전트 활용법
```bash
# 작업 지시 시 명확하게
"[작업명] + [완료 기준] + [예상 시간]"

# 에러 발생 시
"이어서 작업 진행해줘" (컨텍스트 유지)

# 복잡한 작업 시
"작업을 단계별로 나눠서 진행하자" (Phase 분할)
```

### 우선순위 판단 기준
1. **비즈니스 임팩트**: 사용자에게 직접적 영향
2. **기술 부채**: 나중에 더 큰 문제가 될 수 있는 것
3. **난이도**: 쉬운 것부터 빠른 성과 도출
4. **의존성**: 다른 작업의 블로커가 되는 것

---

**다음 작업 추천**:
1️⃣ Business 모듈 코드 품질 개선 (30분, 즉시 완료 가능)
2️⃣ E2E 테스트 핵심 시나리오 작성 (중요도 높음)

**질문이 있으면 언제든지 물어보세요!** 🚀
