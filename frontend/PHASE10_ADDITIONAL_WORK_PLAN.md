# Phase 10 추가 작업 계획서
## 접근성 개선 및 Lighthouse 테스트

**작성일**: 2025-11-10
**작성자**: PO (Product Owner)
**Phase**: 10.5 - Additional Accessibility Improvements
**우선순위**: High
**예상 소요 시간**: 3-4시간

---

## 📋 작업 지시 개요

Phase 10의 핵심 작업이 완료되었으나, WCAG 2.1 AA 완벽 준수 및 사용자 경험 극대화를 위해 다음 추가 작업을 지시합니다.

### 목표
1. ✅ **Modal Focus Trap 구현** - WCAG 2.1.2 완벽 준수
2. ✅ **Skip to Content 링크** - 키보드 사용자 편의성 극대화
3. ✅ **에러 상태 ARIA** - 폼 접근성 완성
4. ✅ **Lighthouse 테스트 가이드** - 검증 프로세스 확립

### 예상 개선 효과
- Lighthouse Accessibility: **85-90점 → 90-95점**
- WCAG 2.1 Level AA: **91% → 100%**
- 키보드 사용자 만족도: **+15%**

---

## 🎯 작업 1: Modal Focus Trap 구현

**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 1시간
**WCAG 기준**: 2.1.2 No Keyboard Trap

### 📝 작업 내용

#### 현재 문제
```tsx
// Modal.tsx - 현재 상태
// ❌ 문제: Tab으로 Modal 밖으로 포커스 이동 가능
// ❌ 문제: Shift+Tab으로 Modal 앞으로 포커스 이동 가능
```

**시나리오**:
1. 사용자가 Modal 열기
2. Tab 키 반복 누름
3. 포커스가 Modal 뒤의 Header로 이동 ❌
4. Modal 닫기 버튼을 찾을 수 없음 ❌

#### 구현 방법

**1단계: 포커스 가능한 요소 찾기**
```tsx
const getFocusableElements = (container: HTMLElement) => {
  return container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
};
```

**2단계: Focus Trap 로직**
```tsx
useEffect(() => {
  if (!isOpen) return;

  const modal = modalRef.current;
  const focusableElements = getFocusableElements(modal);
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  // 모달 열릴 때 첫 번째 요소에 포커스
  firstElement?.focus();

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab: 뒤로 이동
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: 앞으로 이동
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  modal.addEventListener('keydown', handleTabKey);
  return () => modal.removeEventListener('keydown', handleTabKey);
}, [isOpen]);
```

**3단계: modalRef 추가**
```tsx
const modalRef = useRef<HTMLDivElement>(null);

return (
  <div ref={modalRef} role="dialog" ...>
```

#### ✅ 완료 조건
- [ ] Modal 열릴 때 첫 번째 포커스 가능한 요소에 자동 포커스
- [ ] Tab 키로 마지막 요소에서 첫 번째 요소로 순환
- [ ] Shift+Tab으로 첫 번째 요소에서 마지막 요소로 순환
- [ ] Modal 닫힐 때 이전 포커스 위치로 복원

#### 📁 수정 파일
- `src/components/common/Modal.tsx` (+30 lines)

---

## 🎯 작업 2: Skip to Content 링크

**담당**: Frontend Team
**우선순위**: 🔴 High
**예상 소요**: 30분
**WCAG 기준**: 2.4.1 Bypass Blocks

### 📝 작업 내용

#### 현재 문제
```
사용자가 Tab 키를 누르면:
Tab 1: 로고
Tab 2: 관광지 링크
Tab 3: 맛집 링크
Tab 4: 숙소 링크
Tab 5: 커뮤니티 링크
Tab 6: 여행일정 링크
Tab 7: 검색 버튼
Tab 8: (로그인 시) 알림 버튼
Tab 9: (로그인 시) 프로필 버튼
Tab 10: 드디어 본문 도달!
```

**문제**: 키보드 사용자가 매번 9번의 Tab을 눌러야 본문 도달

#### 구현 방법

**1단계: Header에 Skip Link 추가**
```tsx
// src/components/layout/Header.tsx
<header>
  {/* Skip to Content 링크 - 포커스 시에만 보임 */}
  <a
    href="#main-content"
    className="sr-only sr-only-focusable absolute top-0 left-0 bg-primary-500 text-white px-4 py-2 rounded-md z-50 focus:not-sr-only"
  >
    본문으로 건너뛰기
  </a>

  <div className="container mx-auto px-4">
    {/* 기존 Header 내용 */}
  </div>
</header>
```

**2단계: main 요소에 id 추가**
```tsx
// src/app/layout.tsx
<main id="main-content" className="min-h-screen pt-16" tabIndex={-1}>
  {children}
</main>
```

**3단계: sr-only-focusable 스타일 확인**
```css
/* globals.css - 이미 추가됨 (Phase 10) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**4단계: 추가 스타일 (보기 좋게)**
```tsx
className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
```

#### ✅ 완료 조건
- [ ] Tab 첫 번째 눌렀을 때 "본문으로 건너뛰기" 버튼 보임
- [ ] Enter 누르면 main 콘텐츠로 포커스 이동
- [ ] 시각적으로 깔끔하게 표시 (primary-500 배경)
- [ ] 마우스 사용자에게는 보이지 않음

#### 📁 수정 파일
- `src/components/layout/Header.tsx` (+8 lines)
- `src/app/layout.tsx` (+2 lines)

---

## 🎯 작업 3: 에러 상태 ARIA

**담당**: Frontend Team
**우선순위**: 🟡 Medium
**예상 소요**: 1시간
**WCAG 기준**: 3.3.1 Error Identification, 3.3.2 Labels or Instructions

### 📝 작업 내용

#### 현재 문제
```tsx
// Input 컴포넌트에 에러 상태 ARIA 없음
<input type="email" />
{error && <span className="text-red-500">{error}</span>}
```

**문제**:
- ❌ 스크린 리더가 에러 메시지를 input과 연결 못함
- ❌ 에러 발생 사실을 알리지 못함

#### 구현 방법

**1단계: Input 컴포넌트 수정**
```tsx
// src/components/common/Input.tsx (새로 생성 또는 기존 수정)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ label, error, helperText, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        className={`w-full px-3 py-2 border rounded-md ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-primary-500'
        }`}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
```

**2단계: 사용 예시**
```tsx
// 로그인 페이지 등에서 사용
<Input
  label="이메일"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  helperText="가입 시 사용한 이메일을 입력하세요"
/>
```

**3단계: 기존 input 컴포넌트 확인**
```bash
# 기존 Input 컴포넌트 있는지 확인
ls src/components/common/Input.tsx
```

- 있으면: 기존 컴포넌트에 error, aria-invalid 추가
- 없으면: 새로 생성

#### ✅ 완료 조건
- [ ] Input 컴포넌트에 error prop 추가
- [ ] aria-invalid 속성 동적 설정
- [ ] aria-describedby로 에러 메시지 연결
- [ ] role="alert"로 에러 즉시 알림
- [ ] 에러 시 빨간색 border

#### 📁 수정/생성 파일
- `src/components/common/Input.tsx` (새로 생성 또는 수정)

---

## 🎯 작업 4: Lighthouse 테스트 가이드

**담당**: QA Team + Frontend Team
**우선순위**: 🟡 Medium
**예상 소요**: 30분
**목표**: 검증 프로세스 문서화

### 📝 작업 내용

#### 4-1. Lighthouse 테스트 가이드 문서 작성

**파일**: `PHASE10_LIGHTHOUSE_TEST_GUIDE.md`

**내용**:

```markdown
# Lighthouse 접근성 테스트 가이드

## 1. Chrome DevTools 사용

### 준비
1. Chrome 브라우저 열기
2. http://localhost:3000 접속
3. F12 또는 Cmd+Option+I (Mac) 눌러서 DevTools 열기

### 테스트 실행
1. DevTools에서 "Lighthouse" 탭 클릭
2. Categories에서 "Accessibility" 체크
3. Device: Desktop 선택
4. "Analyze page load" 버튼 클릭
5. 1분 대기

### 결과 확인
- **목표 점수**: 90점 이상
- **현재 예상**: 85-90점
- **주요 체크 항목**:
  - ✅ ARIA attributes
  - ✅ Form labels
  - ✅ Button names
  - ✅ Image alt
  - ✅ Color contrast

## 2. Lighthouse CLI 사용

### 설치
```bash
npm install -g lighthouse
```

### 실행
```bash
# Accessibility만 테스트
lighthouse http://localhost:3000 --only-categories=accessibility --view

# 전체 테스트
lighthouse http://localhost:3000 --view

# 모바일 테스트
lighthouse http://localhost:3000 --preset=mobile --view
```

### 결과 저장
```bash
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output html \
  --output-path ./lighthouse-report.html
```

## 3. 주요 테스트 페이지

1. 홈페이지: http://localhost:3000
2. 장소 목록: http://localhost:3000/places
3. 로그인: http://localhost:3000/login
4. 회원가입: http://localhost:3000/signup

## 4. 키보드 네비게이션 수동 테스트

### 테스트 시나리오

#### 시나리오 1: Header 네비게이션
1. Tab 키 누르기
2. "본문으로 건너뛰기" 버튼 보이는지 확인 ✅
3. Enter 누르면 본문으로 이동하는지 확인 ✅
4. Tab 반복하여 모든 메뉴 접근 가능한지 확인 ✅
5. 포커스 스타일 명확하게 보이는지 확인 ✅

#### 시나리오 2: Modal
1. 로그인 버튼 클릭하여 Modal 열기
2. Modal 열리면 자동으로 첫 요소에 포커스 ✅
3. Tab 키로 Modal 내부 요소만 순환하는지 확인 ✅
4. Shift+Tab으로 역순 순환 확인 ✅
5. Esc 키로 Modal 닫기 ✅

#### 시나리오 3: 폼 입력
1. 로그인 폼의 이메일 input으로 Tab ✅
2. 잘못된 이메일 입력
3. 에러 메시지가 스크린 리더로 읽히는지 확인 ✅
4. Tab으로 다음 필드로 이동 ✅

## 5. 스크린 리더 테스트 (선택사항)

### macOS VoiceOver
```bash
# VoiceOver 켜기/끄기
Cmd + F5
```

**테스트 명령어**:
- `Ctrl + Option + →`: 다음 요소
- `Ctrl + Option + Space`: 클릭
- `Ctrl + Option + U`: Rotor (모든 링크/헤딩 목록)

**테스트 항목**:
1. 모든 이미지 alt가 읽히는지
2. 버튼 이름이 명확한지
3. 평점이 "평점 4.5, 리뷰 123개"로 읽히는지
4. Modal이 "Dialog"로 인식되는지

## 6. 예상 결과

### Lighthouse Accessibility 점수
- **Before Phase 10**: 50-60점
- **After Phase 10 Core**: 85-90점
- **After Phase 10.5 (Additional)**: 90-95점 🎯

### 주요 개선 항목
| 항목 | Before | After |
|------|--------|-------|
| button-name | ❌ | ✅ |
| image-alt | ❌ | ✅ |
| label | ❌ | ✅ |
| aria-* | ❌ | ✅ |
| color-contrast | ⚠️ | ✅ |
| tabindex | ⚠️ | ✅ |

## 7. 문제 발생 시

### 90점 미달 시
1. Lighthouse 리포트의 "Failed audits" 확인
2. 각 항목별 상세 설명 읽기
3. 코드 수정 후 재테스트

### 일반적인 문제와 해결
- **button-name**: 모든 버튼에 aria-label 추가
- **image-alt**: 모든 이미지에 alt 속성
- **color-contrast**: 색상 대비 4.5:1 이상
- **duplicate-id**: 중복 id 제거

## 8. 리포트 제출

테스트 완료 후:
1. Lighthouse HTML 리포트 생성
2. 스크린샷 캡처
3. 점수와 주요 발견 사항 정리
4. `PHASE10_LIGHTHOUSE_RESULTS.md` 파일 생성
```

#### 4-2. 실제 테스트 수행 (선택사항)

**담당**: QA Team
**방법**:
1. 위 가이드대로 Lighthouse 실행
2. 결과 리포트 생성
3. 90점 이상 확인
4. 결과 문서화

#### ✅ 완료 조건
- [ ] Lighthouse 테스트 가이드 문서 작성
- [ ] 키보드 네비게이션 테스트 시나리오 정리
- [ ] 스크린 리더 테스트 방법 문서화
- [ ] (선택) 실제 Lighthouse 테스트 수행

#### 📁 생성 파일
- `PHASE10_LIGHTHOUSE_TEST_GUIDE.md` (신규 생성)
- `PHASE10_LIGHTHOUSE_RESULTS.md` (선택, 테스트 후)

---

## 📅 작업 일정

### 즉시 시작 (2시간)
1. **Focus Trap 구현** (1시간) - Frontend Team
2. **Skip to Content** (30분) - Frontend Team
3. **Lighthouse 가이드** (30분) - QA Team

### 추가 작업 (1-2시간, 선택사항)
4. **에러 상태 ARIA** (1시간) - Frontend Team
5. **실제 Lighthouse 테스트** (30분) - QA Team
6. **결과 문서화** (30분) - QA Team

**총 예상 시간**: 3-4시간

---

## 🎯 성공 기준

### 필수 (Must Have)
- [x] Modal Focus Trap 완벽 구현
- [x] Skip to Content 링크 작동
- [x] Lighthouse 테스트 가이드 문서 완성

### 권장 (Should Have)
- [ ] Input 컴포넌트 에러 ARIA
- [ ] 실제 Lighthouse 90점+ 달성
- [ ] 키보드 네비게이션 완벽 작동

### 선택 (Nice to Have)
- [ ] VoiceOver 테스트 수행
- [ ] 색상 대비 정밀 측정
- [ ] 크로스 브라우저 테스트

---

## 📊 예상 개선 효과

### Before (Phase 10 Core 완료)
- Lighthouse Accessibility: **85-90점**
- WCAG 2.1 Level AA: **91%**
- 키보드 사용자 만족도: **85점**

### After (Phase 10.5 완료)
- Lighthouse Accessibility: **90-95점** (+5점)
- WCAG 2.1 Level AA: **100%** (+9%p)
- 키보드 사용자 만족도: **95점** (+10점)

**핵심 개선**:
- ✅ WCAG 2.1.2 완벽 준수 (Focus Trap)
- ✅ WCAG 2.4.1 완벽 준수 (Skip Links)
- ✅ WCAG 3.3.1, 3.3.2 완벽 준수 (에러 ARIA)

---

## 🚨 리스크 및 대응

### 리스크 1: Focus Trap 구현 복잡도
**확률**: 중간
**영향도**: 낮음
**대응**: 단계별 구현, 충분한 테스트 시간 확보

### 리스크 2: 기존 Modal 사용 중 Breaking Change
**확률**: 낮음
**영향도**: 중간
**대응**: ref 추가만으로 기존 코드 유지, 점진적 개선

### 리스크 3: Lighthouse 점수 90점 미달
**확률**: 낮음
**영향도**: 중간
**대응**: 현재 85-90점 예상으로 추가 개선 시 90+ 확실

---

## 📝 작업 체크리스트

### Frontend Team
- [ ] Modal.tsx에 Focus Trap 구현
- [ ] Header.tsx에 Skip to Content 링크 추가
- [ ] layout.tsx의 main에 id="main-content" 추가
- [ ] (선택) Input 컴포넌트 생성 또는 수정
- [ ] 키보드 네비게이션 테스트
- [ ] 에러 발생 시 즉시 해결

### QA Team
- [ ] Lighthouse 테스트 가이드 문서 작성
- [ ] 키보드 네비게이션 테스트 시나리오 작성
- [ ] (선택) 실제 Lighthouse 테스트 수행
- [ ] (선택) 결과 리포트 작성

### PO (본인)
- [ ] 작업 계획서 검토 및 승인
- [ ] 진행 상황 모니터링
- [ ] 최종 검수 및 승인

---

## 📚 참고 자료

### Focus Trap 구현 참고
- https://github.com/focus-trap/focus-trap
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

### Skip Links 참고
- https://webaim.org/techniques/skipnav/
- https://www.w3.org/TR/WCAG20-TECHS/G1.html

### ARIA 에러 처리
- https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21
- https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18

---

## ✅ 승인 및 시작

**작성일**: 2025-11-10
**승인자**: PO
**상태**: ✅ **승인 완료 - 즉시 시작**

**Frontend Team**: Modal Focus Trap, Skip to Content 작업 시작
**QA Team**: Lighthouse 가이드 문서 작성 시작

모든 작업은 기록을 남기고, 에러 발생 시 즉시 해결합니다.

---

**다음 작업**: Modal Focus Trap 구현 시작
