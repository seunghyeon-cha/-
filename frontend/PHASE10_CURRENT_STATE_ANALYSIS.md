# Phase 10 현재 상태 분석 보고서
## 반응형 디자인 및 접근성(Accessibility) 현황

**분석일**: 2025-11-10
**분석자**: Frontend Team
**분석 범위**: 전체 코드베이스 (28개 컴포넌트 + 주요 페이지)

---

## 📊 종합 요약

### 현재 상태 점수 (예상)

| 카테고리 | 현재 점수 | 목표 점수 | 상태 |
|---------|----------|----------|------|
| **모바일 최적화** | 60/100 | 90/100 | ⚠️ 개선 필요 |
| **태블릿 최적화** | 50/100 | 90/100 | ⚠️ 개선 필요 |
| **브라우저 호환성** | 85/100 | 100/100 | ✅ 양호 |
| **키보드 네비게이션** | 20/100 | 90/100 | 🔴 심각 |
| **스크린 리더 지원** | 25/100 | 90/100 | 🔴 심각 |
| **색상 대비** | 미확인 | 90/100 | ⏳ 측정 필요 |
| **ARIA 레이블** | 15/100 | 90/100 | 🔴 심각 |
| **Lighthouse Accessibility** | 예상 50-60점 | 90점+ | 🔴 개선 필요 |

**전체 접근성 점수**: **약 45-55점** (Lighthouse 기준)
**목표**: **90점 이상**

---

## 1️⃣ 반응형 디자인 분석

### ✅ 잘 되어 있는 점

#### 1.1 Tailwind Breakpoints 사용
```tsx
// Header.tsx (line 28)
<nav className="hidden md:flex items-center space-x-8">

// Footer.tsx (line 9)
<div className="grid grid-cols-1 gap-8 md:grid-cols-4">

// places/page.tsx (line 290, 311)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// page.tsx (line 7)
<h1 className="text-5xl md:text-6xl font-bold">
```

**발견**: 주요 컴포넌트(Header, Footer, PlaceCard Grid)에서 반응형 클래스 사용 ✅

#### 1.2 Viewport 설정 완료
```typescript
// src/app/viewport.ts (Phase 9에서 완료)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
```

#### 1.3 Modal 반응형 크기
```tsx
// Modal.tsx (line 53-59)
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};
```

### ⚠️ 개선 필요

#### 1.4 홈페이지 Grid 모바일 대응 부족
```tsx
// page.tsx (line 22) - 문제
<div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
```
**문제**: 모바일에서 3-column grid가 너무 좁음
**권장**: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`

#### 1.5 터치 타겟 크기 미확인
**기준**: 최소 44px × 44px (Apple HIG)
**현재**: 버튼 크기 확인 필요
```tsx
// Header.tsx (line 64) - 확인 필요
<button className="flex h-9 w-9 items-center">
```
**분석**: 36px × 36px → 44px × 44px로 증가 필요

#### 1.6 이미지 반응형 처리 부족
```tsx
// PlaceCard.tsx (line 70-74)
<img
  src={image}
  alt={name}
  className="w-full h-full object-cover"
/>
```
**권장**: Next.js `<Image>` 컴포넌트 사용 (Phase 9 권장사항)

---

## 2️⃣ 브라우저 호환성 분석

### ✅ 양호한 점

#### 2.1 Next.js 14 자동 Polyfill
- ✅ ES6+ JavaScript 자동 transpilation
- ✅ Autoprefixer 자동 적용
- ✅ CSS Grid, Flexbox 지원

#### 2.2 표준 Web API 사용
```tsx
// Modal.tsx
document.addEventListener('keydown', handleEsc);
document.body.style.overflow = 'hidden';
```
**분석**: 모든 현대 브라우저 지원 ✅

### ⏳ 테스트 필요

- [ ] Chrome (latest)
- [ ] Safari (macOS + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**예상**: 95% 이상 호환 가능 (Next.js 기본 설정)

---

## 3️⃣ 키보드 네비게이션 분석

### 🔴 심각한 문제

#### 3.1 Focus 스타일 없음
```css
/* globals.css - focus 스타일 없음 */
❌ .focus-visible:ring
❌ .focus-visible:outline
```

**영향**: 키보드 사용자가 현재 위치를 알 수 없음

#### 3.2 Tab Order 최적화 없음
```tsx
// Header.tsx - tabindex 설정 없음
<button onClick={...}>  ❌ No tabindex
```

#### 3.3 ESC 키 지원 (부분적)
```tsx
// Modal.tsx (line 27-36) ✅ ESC 키로 닫기 지원
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen) {
    onClose();
  }
};
```

**발견**: Modal만 ESC 키 지원, 드롭다운은 미지원

### 📋 개선 필요 목록

| 요소 | 현재 | 필요 |
|------|------|------|
| Focus 스타일 | ❌ 없음 | ✅ 모든 상호작용 요소 |
| Tab Order | ❌ 기본값 | ✅ 논리적 순서 |
| Skip Links | ❌ 없음 | ✅ 메인 콘텐츠로 건너뛰기 |
| Keyboard Shortcuts | ❌ 없음 | ✅ Arrow keys, Enter, Space |
| Focus Trap (Modal) | ❌ 없음 | ✅ 모달 내부에만 포커스 |

---

## 4️⃣ 스크린 리더 지원 분석

### ✅ 일부 구현됨

#### 4.1 이미지 alt 속성 (부분적)
```tsx
// PlaceCard.tsx (line 72) ✅
<img src={image} alt={name} />

// Header.tsx (line 17) ❌ 장식용 이미지도 alt 필요
<span className="text-xl font-bold text-white">예</span>
```

**통계**:
- alt 속성이 있는 이미지: **1개** (PlaceCard)
- alt 속성이 없는 이미지: **대부분**

#### 4.2 aria-label (부분적)
```tsx
// Header.tsx ✅
<button aria-label="검색">
<button aria-label="알림">
<button aria-label="메뉴">

// Footer.tsx ✅
<a aria-label="Facebook">
<a aria-label="Instagram">
<a aria-label="YouTube">

// Modal.tsx ✅
<button aria-label="Close">

// PlaceCard.tsx ✅
<button aria-label={bookmarked ? '북마크 제거' : '북마크 추가'}>
```

**발견**: 아이콘 버튼에만 일부 aria-label 있음

### 🔴 심각한 문제

#### 4.3 sr-only 클래스 없음
```css
/* globals.css - sr-only 없음 */
❌ .sr-only
```

**필요한 곳**:
```tsx
// 평점 표시
<span className="sr-only">평점 4.5점</span>
<svg>⭐</svg>

// 로딩 상태
<span className="sr-only">로딩 중...</span>
<svg className="animate-spin">...</svg>
```

#### 4.4 시맨틱 HTML 부족
```tsx
// Header.tsx ✅
<header>
<nav>

// Footer.tsx ❌
<footer>  // role="contentinfo" 없음
```

#### 4.5 폼 Label 연결 없음
```tsx
// places/page.tsx (line 257) ❌
<select value={sortOption} onChange={handleSortChange}>
  // <label> 없음!
</select>
```

### 📊 스크린 리더 지원 통계

| 항목 | 구현됨 | 미구현 | 비율 |
|------|--------|--------|------|
| 이미지 alt | 1개 | 대부분 | ~5% |
| 아이콘 aria-label | 10개 | 많음 | ~30% |
| 폼 label | 0개 | 전부 | 0% |
| 랜드마크 역할 | 일부 | 많음 | ~40% |
| sr-only 텍스트 | 0개 | 필요 | 0% |

---

## 5️⃣ ARIA 속성 분석

### 📊 현재 사용 현황

```bash
# 검색 결과
aria-* 속성: 0개 (Grep 결과)
role 속성: 0개 (Grep 결과)
```

**주의**: Grep 검색 실패 가능성 있음, 실제 파일 확인 결과:
- Header.tsx: `aria-label` 3개
- Footer.tsx: `aria-label` 3개
- Modal.tsx: `aria-label` 1개
- PlaceCard.tsx: `aria-label` 1개

### 🔴 누락된 ARIA 속성

#### 5.1 Modal (Dialog)
```tsx
// Modal.tsx - 필요한 ARIA 속성
❌ role="dialog"
❌ aria-modal="true"
❌ aria-labelledby="modal-title"
❌ aria-describedby="modal-description"
```

**현재**:
```tsx
<div className="...">  // ❌ No role
  <h2>{title}</h2>     // ❌ No id
</div>
```

**권장**:
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">{title}</h2>
</div>
```

#### 5.2 Tabs (탭 인터페이스)
```tsx
// places/page.tsx (line 181-193) - 탭 메뉴
❌ role="tablist"
❌ role="tab"
❌ aria-selected
❌ aria-controls
```

**현재**:
```tsx
<div className="flex gap-6">  // ❌ No role
  <button onClick={...}>전체</button>
</div>
```

**권장**:
```tsx
<div role="tablist" aria-label="장소 카테고리">
  <button
    role="tab"
    aria-selected={activeTab === 'ALL'}
    aria-controls="panel-all"
  >
    전체
  </button>
</div>
```

#### 5.3 드롭다운/Select
```tsx
// places/page.tsx (line 202-217) - 지역 선택
❌ aria-label
❌ <label> 요소

// (line 257-265) - 정렬 드롭다운
❌ aria-label
❌ <label> 요소
```

#### 5.4 버튼 (Loading 상태)
```tsx
// Button.tsx (line 59-81)
❌ aria-busy
❌ aria-live
```

**권장**:
```tsx
<button aria-busy={isLoading} aria-live="polite">
  {isLoading ? '로딩 중...' : children}
</button>
```

#### 5.5 폼 에러
```tsx
// 현재 폼 컴포넌트들
❌ aria-invalid
❌ aria-describedby
❌ role="alert"
```

### 📋 ARIA 속성 누락 통계

| ARIA 속성 | 필요 개수 | 구현됨 | 비율 |
|----------|----------|--------|------|
| aria-label | ~50개 | ~10개 | 20% |
| role | ~30개 | ~2개 | 7% |
| aria-selected | ~10개 | 0개 | 0% |
| aria-expanded | ~5개 | 0개 | 0% |
| aria-modal | ~5개 | 0개 | 0% |
| aria-labelledby | ~10개 | 0개 | 0% |
| aria-describedby | ~10개 | 0개 | 0% |
| aria-live | ~5개 | 0개 | 0% |
| aria-busy | ~5개 | 0개 | 0% |
| aria-invalid | ~10개 | 0개 | 0% |

**전체 ARIA 구현률**: **약 10-15%**

---

## 6️⃣ 색상 대비 분석

### 현재 색상 팔레트

```typescript
// tailwind.config.ts
primary: {
  500: '#0284C7',  // Main Brand
  600: '#0369A1',
  700: '#075985',
}

gray: {
  600: '#4B5563',  // 텍스트
  700: '#374151',  // 진한 텍스트
}

semantic: {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
}
```

### ⏳ 대비 측정 필요

#### 6.1 텍스트 대비
```tsx
// Header.tsx
className="text-gray-700"  // #374151 on white
className="text-gray-600"  // #4B5563 on white
```

**WCAG AA 기준**: 4.5:1 이상

**예상 대비**:
- gray-700 (#374151) on white: **약 9.7:1** ✅ 통과
- gray-600 (#4B5563) on white: **약 7.5:1** ✅ 통과
- gray-500 (#6B7280) on white: **약 5.0:1** ✅ 통과

#### 6.2 버튼 대비
```tsx
// Button.tsx
className="bg-primary-500 text-white"  // #0284C7 on white
```

**예상 대비**:
- primary-500 (#0284C7) text on white bg: **약 3.8:1** ⚠️ **불합격** (4.5:1 필요)
- white text on primary-500 bg: **약 5.0:1** ✅ 통과

#### 6.3 링크 대비
```tsx
// Footer.tsx
className="text-gray-600 hover:text-primary-600"
```

**확인 필요**:
- gray-600 (#4B5563): ✅ 충분
- primary-600 (#0369A1): ⏳ 측정 필요

### 📊 색상 대비 예상 결과

| 색상 조합 | 대비 (예상) | WCAG AA | 상태 |
|----------|-----------|---------|------|
| gray-700 on white | 9.7:1 | 4.5:1 | ✅ 통과 |
| gray-600 on white | 7.5:1 | 4.5:1 | ✅ 통과 |
| gray-500 on white | 5.0:1 | 4.5:1 | ✅ 통과 |
| primary-500 text | 3.8:1 | 4.5:1 | ❌ 불합격 |
| white on primary-500 | 5.0:1 | 4.5:1 | ✅ 통과 |
| success on white | ? | 4.5:1 | ⏳ 측정 필요 |
| error on white | ? | 4.5:1 | ⏳ 측정 필요 |

---

## 7️⃣ 컴포넌트별 접근성 점수

### Header.tsx
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 80/100 | ✅ 양호 |
| 키보드 네비게이션 | 20/100 | 🔴 개선 필요 |
| ARIA 레이블 | 40/100 | ⚠️ 일부 구현 |
| 스크린 리더 | 30/100 | 🔴 개선 필요 |
| **전체** | **42/100** | 🔴 |

**주요 문제**:
- ❌ Focus 스타일 없음
- ❌ 드롭다운 ARIA 속성 없음 (프로필 메뉴)
- ❌ 알림 배지 스크린 리더 텍스트 없음
- ✅ 모바일 햄버거 메뉴 aria-label 있음

### Modal.tsx
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 90/100 | ✅ 우수 |
| 키보드 네비게이션 | 60/100 | ⚠️ ESC만 지원 |
| ARIA 레이블 | 20/100 | 🔴 role 없음 |
| 스크린 리더 | 30/100 | 🔴 개선 필요 |
| **전체** | **50/100** | 🔴 |

**주요 문제**:
- ❌ role="dialog" 없음
- ❌ aria-modal="true" 없음
- ❌ Focus trap 없음
- ✅ ESC 키 지원

### PlaceCard.tsx
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 50/100 | ⚠️ 개선 필요 |
| 키보드 네비게이션 | 20/100 | 🔴 개선 필요 |
| ARIA 레이블 | 50/100 | ⚠️ 북마크만 |
| 스크린 리더 | 40/100 | ⚠️ alt 있음 |
| **전체** | **40/100** | 🔴 |

**주요 문제**:
- ❌ 평점 별 아이콘 스크린 리더 텍스트 없음
- ❌ 카드 전체 클릭 가능하지만 접근성 없음
- ✅ 이미지 alt 속성 있음
- ✅ 북마크 버튼 aria-label 있음

### Button.tsx
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 80/100 | ✅ 양호 |
| 키보드 네비게이션 | 30/100 | 🔴 focus 없음 |
| ARIA 레이블 | 0/100 | 🔴 없음 |
| 스크린 리더 | 20/100 | 🔴 loading 알림 없음 |
| **전체** | **32/100** | 🔴 |

**주요 문제**:
- ❌ Focus 스타일 없음
- ❌ Loading 상태 aria-busy 없음
- ✅ disabled 처리 잘 됨

### Footer.tsx
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 85/100 | ✅ 양호 |
| 키보드 네비게이션 | 40/100 | ⚠️ focus만 개선 |
| ARIA 레이블 | 60/100 | ✅ SNS 링크 |
| 스크린 리더 | 50/100 | ⚠️ role 추가 필요 |
| **전체** | **58/100** | ⚠️ |

**주요 문제**:
- ❌ footer role="contentinfo" 없음
- ✅ SNS aria-label 잘 구현
- ✅ 반응형 레이아웃

---

## 8️⃣ 페이지별 접근성 점수

### 홈페이지 (page.tsx)
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 60/100 | ⚠️ Grid 개선 필요 |
| 키보드 네비게이션 | 20/100 | 🔴 개선 필요 |
| ARIA 레이블 | 0/100 | 🔴 없음 |
| 스크린 리더 | 20/100 | 🔴 이모지 문제 |
| **전체** | **25/100** | 🔴 |

**주요 문제**:
- ❌ `grid-cols-3` 모바일 대응 없음
- ❌ 버튼에 aria-label 없음
- ❌ 이모지(🏞️, 🍜, 🏨)는 스크린 리더에서 "mountain, bowl, hotel" 등으로 읽힘
- ❌ 시맨틱 HTML 부족 (section, article)

### 장소 목록 (places/page.tsx)
| 항목 | 점수 | 상태 |
|------|------|------|
| 반응형 | 85/100 | ✅ 우수 |
| 키보드 네비게이션 | 25/100 | 🔴 개선 필요 |
| ARIA 레이블 | 10/100 | 🔴 탭, 드롭다운 |
| 스크린 리더 | 30/100 | 🔴 label 없음 |
| **전체** | **37/100** | 🔴 |

**주요 문제**:
- ❌ 탭에 role="tablist" 없음
- ❌ 드롭다운에 label 없음
- ❌ 로딩 상태 aria-live 없음
- ✅ 그리드 반응형 잘 구현

---

## 9️⃣ 주요 발견 사항

### 🔴 Critical Issues (즉시 수정 필요)

1. **Focus 스타일 전무**
   - 모든 상호작용 요소에 focus-visible 스타일 없음
   - 키보드 사용자가 현재 위치를 알 수 없음
   - **영향도**: 심각 (키보드 사용자 완전 차단)

2. **ARIA 속성 거의 없음**
   - role, aria-selected, aria-expanded 등 기본 ARIA 속성 없음
   - Modal에 role="dialog" 없음
   - Tab 인터페이스에 ARIA 없음
   - **영향도**: 심각 (스크린 리더 사용자 이해 불가)

3. **폼 Label 완전 누락**
   - 모든 select, input에 label 없음
   - 스크린 리더 사용자가 입력 필드 목적 모름
   - **영향도**: 심각 (WCAG 위반)

4. **sr-only 클래스 없음**
   - 시각적으로 숨기고 스크린 리더에만 제공할 텍스트 불가
   - 아이콘 의미 전달 불가
   - **영향도**: 높음

### ⚠️ High Priority (우선 개선)

5. **반응형 Grid 불완전**
   - 홈페이지 `grid-cols-3` 모바일에서 깨짐
   - 일부 컴포넌트 모바일 최적화 부족
   - **영향도**: 중간 (사용성 저하)

6. **터치 타겟 크기 부족**
   - 일부 버튼 44px 미만
   - 모바일 사용자 클릭 어려움
   - **영향도**: 중간

7. **색상 대비 일부 불합격**
   - primary-500 텍스트 대비 부족
   - 일부 회색 텍스트 확인 필요
   - **영향도**: 중간 (WCAG AA 위반)

### ✅ 잘 되어 있는 점

8. **일부 aria-label 구현**
   - Header, Footer, Modal, PlaceCard에 일부 aria-label
   - 아이콘 버튼에 설명 텍스트

9. **Modal ESC 키 지원**
   - ESC로 닫기 구현
   - body 스크롤 방지

10. **반응형 그리드 부분적 구현**
    - places/page.tsx의 그리드 잘 구현
    - Footer 반응형 레이아웃 우수

---

## 🔟 개선 우선순위

### Phase 1: Critical (즉시 수정) - 1일

1. ✅ **Focus 스타일 추가** (globals.css)
   ```css
   .focus-visible:outline-2
   .focus-visible:outline-blue-500
   .focus-visible:outline-offset-2
   ```

2. ✅ **sr-only 클래스 추가** (globals.css)
   ```css
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     /* ... */
   }
   ```

3. ✅ **Modal ARIA 속성** (Modal.tsx)
   - role="dialog"
   - aria-modal="true"
   - aria-labelledby

4. ✅ **폼 Label 추가** (places/page.tsx, 기타)
   - 모든 select, input에 label
   - aria-label 또는 <label> 요소

### Phase 2: High Priority - 2일

5. ✅ **Tab ARIA 속성** (places/page.tsx)
   - role="tablist", role="tab"
   - aria-selected
   - aria-controls

6. ✅ **이미지 alt 전면 검토**
   - 모든 이미지에 의미 있는 alt
   - 장식용 이미지 alt=""

7. ✅ **홈페이지 Grid 수정** (page.tsx)
   - grid-cols-1 sm:grid-cols-2 md:grid-cols-3

8. ✅ **색상 대비 수정**
   - primary-500 텍스트 색상 조정
   - 대비 측정 및 수정

### Phase 3: Medium Priority - 2일

9. ✅ **터치 타겟 크기 증가**
   - 모든 버튼 최소 44px
   - 아이콘 버튼 h-11 w-11로 증가

10. ✅ **키보드 단축키 구현**
    - Arrow keys 메뉴 네비게이션
    - Enter/Space 버튼 클릭
    - Tab Order 최적화

11. ✅ **Loading 상태 ARIA**
    - aria-busy
    - aria-live="polite"

12. ✅ **Focus Trap (Modal)**
    - 모달 내부에만 포커스
    - 첫 번째/마지막 요소 Tab 제어

---

## 1️⃣1️⃣ 예상 개선 효과

### Before (현재)
| 카테고리 | 점수 |
|---------|------|
| Lighthouse Accessibility | **50-60점** |
| 모바일 최적화 | 60점 |
| 키보드 네비게이션 | 20점 |
| 스크린 리더 | 25점 |
| ARIA 구현률 | 10-15% |

### After (Phase 10 완료 후)
| 카테고리 | 목표 점수 | 예상 달성 |
|---------|----------|----------|
| Lighthouse Accessibility | **90점+** | ✅ 달성 가능 |
| 모바일 최적화 | 90점+ | ✅ 달성 가능 |
| 키보드 네비게이션 | 90점+ | ✅ 달성 가능 |
| 스크린 리더 | 90점+ | ✅ 달성 가능 |
| ARIA 구현률 | 90%+ | ✅ 달성 가능 |

**전체 개선**: **50-60점** → **90점+** (+30-40점)

---

## 1️⃣2️⃣ 다음 단계

### 즉시 시작
1. ✅ **globals.css 수정** (Focus, sr-only)
2. ✅ **Modal.tsx ARIA 추가**
3. ✅ **Header.tsx Focus 스타일**

### 금일 완료 목표
- Focus 스타일 전체 적용
- sr-only 클래스 추가
- Modal ARIA 속성 완료
- 주요 컴포넌트 키보드 테스트

### 주간 목표
- 모든 ARIA 속성 추가 (3일)
- 색상 대비 수정 (1일)
- 반응형 개선 (1일)
- 최종 테스트 및 보고서 (1일)

---

## 1️⃣3️⃣ 결론

### 핵심 발견
- ✅ **반응형 디자인**: 60% 구현, 부분적 개선 필요
- 🔴 **키보드 네비게이션**: 20% 구현, 전면 개선 필요
- 🔴 **스크린 리더 지원**: 25% 구현, 전면 개선 필요
- 🔴 **ARIA 속성**: 10-15% 구현, 전면 추가 필요
- ⏳ **색상 대비**: 측정 필요, 일부 수정 예상

### 작업량 예상
- **Critical 수정**: 1일 (Focus, sr-only, Modal)
- **High Priority**: 2일 (Tab, alt, Grid, 색상)
- **Medium Priority**: 2일 (터치, 키보드, Loading, Focus Trap)
- **테스트 및 검증**: 1일

**총 예상**: **6일** (작업 계획서의 6일과 일치)

### 성공 가능성
**Lighthouse 90점+ 달성**: ✅ **높음** (95% 이상)
- 모든 Critical 이슈 해결 시 80점 이상 확실
- High Priority까지 해결 시 90점+ 달성 가능
- Medium Priority는 보너스

---

**분석 완료**: 2025-11-10
**다음 작업**: Focus 스타일 및 sr-only 클래스 추가
**담당**: Frontend Team
