# Phase 10 작업 계획서
## 반응형 디자인 및 접근성(Accessibility) 최적화

**작성일**: 2025-11-10
**작성자**: PO (Product Owner)
**Phase**: 10 - Responsive Design & Accessibility Testing
**목표**: 모든 디바이스와 브라우저에서 완벽하게 작동하고, WCAG 2.1 AA 기준을 충족하는 접근성 구현

---

## 📋 작업 개요

### 목표
1. **모바일/태블릿 최적화**: 모든 디바이스에서 최적의 사용자 경험 제공
2. **브라우저 호환성**: 주요 브라우저(Chrome, Safari, Firefox, Edge)에서 정상 작동
3. **접근성 준수**: WCAG 2.1 AA 기준 충족, 장애인 사용자 지원
4. **키보드 네비게이션**: 마우스 없이도 모든 기능 사용 가능
5. **스크린 리더 지원**: 시각 장애인을 위한 완벽한 음성 안내

### 성공 기준
- ✅ 모바일(320px~768px) 모든 페이지 정상 작동
- ✅ 태블릿(768px~1024px) 레이아웃 최적화
- ✅ Chrome, Safari, Firefox, Edge 호환성 100%
- ✅ 키보드만으로 모든 기능 접근 가능
- ✅ WCAG 2.1 AA 색상 대비 기준 충족 (4.5:1 이상)
- ✅ 모든 이미지에 alt 속성 추가
- ✅ 모든 상호작용 요소에 ARIA 레이블 추가
- ✅ Lighthouse Accessibility 점수 90점 이상

---

## 📊 작업 항목 (7개)

### 1️⃣ 모바일 최적화 테스트
**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 4시간

#### 📝 작업 내용
1. **Viewport 설정 확인**
   - `<meta name="viewport">` 올바른 설정 확인
   - 이미 `viewport.ts`에 설정 완료 확인

2. **반응형 Breakpoints 테스트**
   ```
   Mobile S: 320px
   Mobile M: 375px
   Mobile L: 425px
   Tablet: 768px
   Laptop: 1024px
   Desktop: 1440px
   ```

3. **모바일 전용 컴포넌트 테스트**
   - Header (햄버거 메뉴)
   - Navigation
   - Cards (장소, 게시글)
   - Forms (로그인, 회원가입)
   - Modals (반응형 크기)

4. **Touch 최적화**
   - 버튼 최소 크기: 44px × 44px (Apple HIG 권장)
   - 터치 영역 충분한 간격 확보
   - Swipe/Scroll 제스처 지원

5. **테스트 디바이스**
   - iPhone SE (320px)
   - iPhone 12/13/14 (390px)
   - Galaxy S21 (360px)
   - iPad Mini (768px)

#### ✅ 완료 조건
- [ ] 모든 페이지 320px~768px에서 레이아웃 깨짐 없음
- [ ] 터치 타겟 최소 44px × 44px
- [ ] 모바일 네비게이션 정상 작동
- [ ] 가로/세로 모드 모두 지원

#### 📁 관련 파일
- `src/app/viewport.ts` (이미 완료)
- `tailwind.config.ts` (breakpoints 확인)
- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNav.tsx`
- 모든 페이지 컴포넌트

---

### 2️⃣ 태블릿 최적화 테스트
**담당**: Frontend Team
**우선순위**: 🟡 Medium
**예상 소요**: 3시간

#### 📝 작업 내용
1. **태블릿 레이아웃 테스트**
   - 768px ~ 1024px 범위
   - 2-column, 3-column 그리드 최적화
   - Sidebar 표시 여부 결정

2. **컴포넌트 크기 조정**
   - Card 크기 (모바일보다 크게, 데스크톱보다 작게)
   - 이미지 크기 최적화
   - 폰트 크기 조정

3. **테스트 디바이스**
   - iPad (768px)
   - iPad Air (820px)
   - iPad Pro (1024px)

#### ✅ 완료 조건
- [ ] 768px~1024px 레이아웃 최적화
- [ ] 터치 + 마우스 하이브리드 지원
- [ ] 가로 모드 최적화 (1024px × 768px)

---

### 3️⃣ 브라우저 호환성 테스트
**담당**: QA Team + Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 3시간

#### 📝 작업 내용
1. **테스트 브라우저**
   - ✅ Chrome (latest)
   - ✅ Safari (macOS + iOS)
   - ✅ Firefox (latest)
   - ✅ Edge (latest)

2. **테스트 항목**
   - CSS Grid/Flexbox 레이아웃
   - ES6+ JavaScript 기능
   - Fetch API / Async/Await
   - Local Storage
   - CSS Variables
   - WebP/AVIF 이미지 지원

3. **Next.js 빌드 확인**
   ```bash
   npm run build
   # Polyfill 자동 포함 확인
   # Transpilation 확인
   ```

#### ✅ 완료 조건
- [ ] Chrome: 100% 호환
- [ ] Safari: 100% 호환
- [ ] Firefox: 100% 호환
- [ ] Edge: 100% 호환
- [ ] JavaScript 에러 없음
- [ ] 레이아웃 깨짐 없음

#### 🔧 도구
- BrowserStack (크로스 브라우저 테스트)
- Can I Use (기능 호환성 확인)
- Autoprefixer (자동 prefix 추가)

---

### 4️⃣ 키보드 네비게이션
**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 4시간

#### 📝 작업 내용
1. **키보드 단축키 구현**
   - `Tab`: 다음 요소로 이동
   - `Shift + Tab`: 이전 요소로 이동
   - `Enter`: 버튼/링크 클릭
   - `Space`: 체크박스/라디오 버튼 선택
   - `Esc`: 모달/드롭다운 닫기
   - `Arrow keys`: 메뉴/리스트 네비게이션

2. **Focus 스타일 추가**
   ```css
   /* Tailwind 설정 */
   .focus-visible:outline-blue-500
   .focus-visible:outline-2
   .focus-visible:outline-offset-2
   ```

3. **Tab Order 최적화**
   - 논리적 순서로 tabindex 설정
   - Skip to content 링크 추가
   - Focus trap (모달 내부에서만 이동)

4. **테스트 대상**
   - Header 네비게이션
   - 폼 입력 필드
   - 버튼/링크
   - 드롭다운 메뉴
   - 모달 다이얼로그
   - 카드 그리드

#### ✅ 완료 조건
- [ ] 모든 상호작용 요소에 키보드 접근 가능
- [ ] Focus 스타일 명확하게 표시
- [ ] Tab 순서가 논리적
- [ ] Esc 키로 모달/드롭다운 닫기 가능
- [ ] Skip links 구현

#### 📁 수정 파일
- `src/components/layout/Header.tsx`
- `src/components/common/Modal.tsx`
- `src/components/common/Dropdown.tsx`
- `src/app/globals.css` (focus 스타일)

---

### 5️⃣ 스크린 리더 지원
**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 5시간

#### 📝 작업 내용
1. **이미지 Alt 속성 추가**
   ```tsx
   // ❌ Bad
   <img src="/place.jpg" />

   // ✅ Good
   <Image src="/place.jpg" alt="경복궁 정문 전경" />

   // ✅ Decorative image
   <Image src="/decoration.svg" alt="" role="presentation" />
   ```

2. **의미 있는 HTML 구조**
   ```tsx
   // ✅ 시맨틱 태그 사용
   <header>, <nav>, <main>, <article>, <aside>, <footer>
   <h1>, <h2>, <h3> 계층 구조
   <button>, <a>, <label>
   ```

3. **스크린 리더 전용 텍스트**
   ```tsx
   <span className="sr-only">메뉴 열기</span>
   ```

   ```css
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     white-space: nowrap;
     border-width: 0;
   }
   ```

4. **테스트 도구**
   - macOS VoiceOver
   - Windows NVDA
   - Chrome Screen Reader extension

#### ✅ 완료 조건
- [ ] 모든 이미지에 적절한 alt 속성
- [ ] 아이콘 버튼에 설명 텍스트
- [ ] 폼 입력에 label 연결
- [ ] 랜드마크 역할 명확
- [ ] VoiceOver 테스트 통과

#### 📁 수정 파일
- 모든 이미지 컴포넌트
- `src/components/layout/Header.tsx`
- `src/components/common/Button.tsx`
- `src/app/globals.css` (sr-only 추가)

---

### 6️⃣ 색상 대비 확인
**담당**: Designer + Frontend Team
**우선순위**: 🟡 Medium
**예상 소요**: 3시간

#### 📝 작업 내용
1. **WCAG 2.1 AA 기준**
   - 일반 텍스트: 4.5:1 이상
   - 큰 텍스트(18pt 이상): 3:1 이상
   - UI 컴포넌트: 3:1 이상

2. **색상 조합 확인**
   ```typescript
   // tailwind.config.ts 색상 팔레트 확인
   primary: { 600: '#2563eb' }      // 메인 색상
   secondary: { 500: '#6366f1' }    // 보조 색상
   gray: { 600: '#4b5563' }         // 텍스트 색상
   success: { 500: '#10b981' }      // 성공
   error: { 500: '#ef4444' }        // 에러
   warning: { 500: '#f59e0b' }      // 경고
   ```

3. **대비 검사 도구**
   - WebAIM Contrast Checker
   - Chrome DevTools Lighthouse
   - Accessible Colors (자동 색상 제안)

4. **문제 색상 수정**
   - 연한 회색 텍스트 → 진한 회색으로 변경
   - 링크 색상 대비 확인
   - 비활성 버튼 대비 확인

#### ✅ 완료 조건
- [ ] 모든 텍스트 4.5:1 이상 대비
- [ ] 버튼/링크 3:1 이상 대비
- [ ] Lighthouse Accessibility 90점 이상
- [ ] 색맹 사용자 고려 (색상만으로 정보 전달 금지)

#### 📁 수정 파일
- `tailwind.config.ts`
- `src/app/globals.css`
- 색상을 사용하는 모든 컴포넌트

---

### 7️⃣ ARIA 레이블
**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 5시간

#### 📝 작업 내용
1. **ARIA 속성 추가**
   ```tsx
   // 버튼
   <button aria-label="검색">
     <SearchIcon />
   </button>

   // 링크
   <a href="/places" aria-label="관광지 목록으로 이동">
     관광지
   </a>

   // 모달
   <div role="dialog" aria-labelledby="modal-title" aria-modal="true">
     <h2 id="modal-title">로그인</h2>
   </div>

   // 드롭다운
   <button aria-haspopup="true" aria-expanded={isOpen}>
     메뉴
   </button>

   // 탭
   <div role="tablist">
     <button role="tab" aria-selected={active} aria-controls="panel1">
       관광지
     </button>
   </div>

   // 폼 에러
   <input aria-invalid="true" aria-describedby="error-msg" />
   <span id="error-msg" role="alert">이메일 형식이 올바르지 않습니다</span>
   ```

2. **역할(Role) 정의**
   - `role="navigation"` - 네비게이션
   - `role="search"` - 검색 폼
   - `role="button"` - 버튼처럼 동작하는 요소
   - `role="alert"` - 에러 메시지
   - `role="status"` - 상태 변경 알림

3. **Live Regions**
   ```tsx
   // 동적 콘텐츠 변경 알림
   <div aria-live="polite" aria-atomic="true">
     {successMessage}
   </div>

   // 즉시 알림 (에러)
   <div aria-live="assertive">
     {errorMessage}
   </div>
   ```

4. **Hidden 요소**
   ```tsx
   // 스크린 리더에서 숨김
   <span aria-hidden="true">⭐</span>

   // 시각적으로만 숨김
   <span className="sr-only">평점 4.5점</span>
   ```

#### ✅ 완료 조건
- [ ] 모든 아이콘 버튼에 aria-label
- [ ] 모달에 role="dialog" + aria-labelledby
- [ ] 드롭다운에 aria-haspopup + aria-expanded
- [ ] 폼 에러에 aria-invalid + aria-describedby
- [ ] 동적 콘텐츠에 aria-live
- [ ] 탭에 role="tablist" + aria-selected

#### 📁 수정 파일
- `src/components/layout/Header.tsx`
- `src/components/common/Modal.tsx`
- `src/components/common/Dropdown.tsx`
- `src/components/common/Button.tsx`
- `src/components/common/Input.tsx`
- 모든 폼 컴포넌트

---

## 📅 작업 일정

### Day 1 (4시간)
- [x] ~~작업 계획서 작성~~ (PO)
- [ ] 현재 상태 분석 (Frontend)
- [ ] 모바일 최적화 테스트 (Frontend)
- [ ] 태블릿 최적화 테스트 (Frontend)

### Day 2 (4시간)
- [ ] 브라우저 호환성 테스트 (QA + Frontend)
- [ ] 색상 대비 확인 및 수정 (Designer + Frontend)

### Day 3 (5시간)
- [ ] 키보드 네비게이션 구현 (Frontend)
- [ ] Focus 스타일 추가 (Frontend)
- [ ] Skip links 추가 (Frontend)

### Day 4 (5시간)
- [ ] 스크린 리더 지원 (Frontend)
- [ ] Alt 속성 전면 검토 (Frontend)
- [ ] 시맨틱 HTML 개선 (Frontend)

### Day 5 (5시간)
- [ ] ARIA 레이블 추가 (Frontend)
- [ ] 모든 상호작용 요소 ARIA 속성 (Frontend)
- [ ] Live regions 구현 (Frontend)

### Day 6 (2시간)
- [ ] 최종 테스트 (QA)
- [ ] Lighthouse Accessibility 점수 확인
- [ ] 완료 보고서 작성 (PO)

**총 예상 소요 시간**: 25시간

---

## 🎯 성공 지표

### 정량적 지표
| 항목 | 현재 | 목표 | 측정 방법 |
|------|------|------|----------|
| **Mobile 호환성** | 미확인 | 100% | Chrome DevTools 테스트 |
| **Tablet 호환성** | 미확인 | 100% | iPad 실기기 테스트 |
| **Browser 호환성** | 미확인 | 100% | 4대 브라우저 테스트 |
| **Lighthouse Accessibility** | 미확인 | 90점+ | Lighthouse 측정 |
| **Color Contrast** | 미확인 | WCAG AA | WebAIM Contrast Checker |
| **Keyboard Navigation** | 없음 | 100% | 키보드만으로 테스트 |
| **Screen Reader Support** | 부분적 | 완전 | VoiceOver 테스트 |

### 정성적 지표
- ✅ 모든 디바이스에서 자연스러운 UX
- ✅ 마우스 없이도 모든 기능 사용 가능
- ✅ 시각 장애인도 완전히 사용 가능
- ✅ WCAG 2.1 AA 기준 준수

---

## 🔧 기술 스택 & 도구

### 테스트 도구
- **Chrome DevTools**: Device emulation, Lighthouse
- **Firefox Developer Tools**: Accessibility Inspector
- **Safari Web Inspector**: iOS 테스트
- **BrowserStack**: 크로스 브라우저 테스트
- **axe DevTools**: Accessibility 자동 검사
- **WAVE**: 웹 접근성 평가 도구

### 스크린 리더
- **VoiceOver** (macOS/iOS)
- **NVDA** (Windows)
- **JAWS** (Windows, 상용)

### 색상 대비 검사
- **WebAIM Contrast Checker**
- **Accessible Colors**
- **Coolors Contrast Checker**

### 키보드 테스트
- 실제 키보드로 수동 테스트
- Tab order 확인
- Focus styles 확인

---

## 📋 체크리스트

### 반응형 디자인
- [ ] Mobile (320px~768px) 레이아웃 최적화
- [ ] Tablet (768px~1024px) 레이아웃 최적화
- [ ] Desktop (1024px+) 레이아웃 검증
- [ ] 터치 타겟 최소 44px × 44px
- [ ] 가로/세로 모드 모두 지원
- [ ] 이미지 반응형 크기 설정

### 브라우저 호환성
- [ ] Chrome 정상 작동
- [ ] Safari 정상 작동
- [ ] Firefox 정상 작동
- [ ] Edge 정상 작동
- [ ] JavaScript 에러 없음
- [ ] CSS 레이아웃 깨짐 없음

### 키보드 네비게이션
- [ ] Tab으로 모든 요소 접근 가능
- [ ] Focus 스타일 명확하게 표시
- [ ] Enter/Space로 버튼 클릭 가능
- [ ] Esc로 모달 닫기 가능
- [ ] Arrow keys로 메뉴 네비게이션
- [ ] Skip to content 링크

### 스크린 리더
- [ ] 모든 이미지 alt 속성
- [ ] 아이콘 버튼 aria-label
- [ ] 폼 label 올바르게 연결
- [ ] 랜드마크 역할 명확 (header, nav, main, footer)
- [ ] VoiceOver 테스트 통과
- [ ] 의미 있는 HTML 구조

### 색상 대비
- [ ] 텍스트 4.5:1 이상
- [ ] 큰 텍스트 3:1 이상
- [ ] UI 컴포넌트 3:1 이상
- [ ] 링크 색상 대비 충분
- [ ] 버튼 색상 대비 충분
- [ ] 에러 메시지 대비 충분

### ARIA 레이블
- [ ] 모든 아이콘 버튼 aria-label
- [ ] 모달 role="dialog" + aria-labelledby
- [ ] 드롭다운 aria-haspopup + aria-expanded
- [ ] 탭 role="tablist" + aria-selected
- [ ] 폼 에러 aria-invalid + aria-describedby
- [ ] 동적 콘텐츠 aria-live

---

## 🚨 리스크 및 대응

### 리스크 1: 기존 컴포넌트 접근성 부족
**확률**: 높음
**영향도**: 높음
**대응**:
- 컴포넌트별 접근성 체크리스트 작성
- 우선순위: Header, Modal, Form 컴포넌트부터 수정
- 단계별 배포로 리스크 분산

### 리스크 2: 브라우저별 CSS 차이
**확률**: 중간
**영향도**: 중간
**대응**:
- Autoprefixer 사용 (이미 Next.js에 포함)
- Can I Use 사전 확인
- Polyfill 추가 (필요 시)

### 리스크 3: 색상 대비 변경으로 디자인 변화
**확률**: 중간
**영향도**: 낮음
**대응**:
- Designer와 사전 협의
- 접근성 준수 범위 내에서 최대한 디자인 유지
- 필요 시 대체 색상 팔레트 제안

### 리스크 4: 스크린 리더 테스트 부족
**확률**: 높음
**영향도**: 중간
**대응**:
- VoiceOver (macOS) 기본 테스트
- axe DevTools 자동 검사로 보완
- 실제 장애인 사용자 피드백 (향후)

---

## 📖 참고 자료

### WCAG 2.1 Guidelines
- https://www.w3.org/WAI/WCAG21/quickref/
- Level AA 기준 준수

### MDN Web Docs
- https://developer.mozilla.org/en-US/docs/Web/Accessibility
- ARIA 속성 참조

### Next.js Accessibility
- https://nextjs.org/docs/accessibility
- Built-in accessibility features

### Tailwind CSS Accessibility
- https://tailwindcss.com/docs/screen-readers
- sr-only utility class

### Testing Tools
- https://wave.webaim.org/
- https://www.deque.com/axe/devtools/
- https://webaim.org/resources/contrastchecker/

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2025-11-10 | 1.0 | 초기 작업 계획서 작성 | PO |

---

## ✅ 다음 단계

1. **Frontend Team**: 현재 상태 분석 시작
2. **QA Team**: 테스트 환경 준비 (BrowserStack, 실기기)
3. **Designer**: 색상 팔레트 대비 사전 확인
4. **PO**: 작업 진행 모니터링

**시작일**: 2025-11-10
**예상 완료일**: 2025-11-16 (6일)

---

**작성 완료**: 2025-11-10
**승인자**: PO
**상태**: ✅ **승인 완료 - 작업 시작 가능**
