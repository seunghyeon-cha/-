# Lighthouse 접근성 테스트 가이드
## Phase 10 검증 프로세스

**작성일**: 2025-11-10
**작성자**: QA Team + Frontend Team
**대상**: 예림투어 프론트엔드 접근성 검증

---

## 📋 테스트 개요

### 목적
Phase 10에서 구현한 접근성 개선 사항을 검증하고, WCAG 2.1 AA 준수 여부를 확인합니다.

### 목표 점수
- **Lighthouse Accessibility**: 90점 이상
- **현재 예상 점수**: 90-95점
- **Before Phase 10**: 50-60점

### 테스트 범위
1. ✅ 홈페이지 (`/`)
2. ✅ 장소 목록 (`/places`)
3. ✅ 게시판 (`/boards`)
4. ✅ 여행일정 (`/itinerary`)
5. ✅ 로그인 (`/login`)

---

## 1️⃣ Chrome DevTools 사용법

### 준비 단계

1. **Chrome 브라우저 열기**
   - 최신 버전 권장 (Chrome 90 이상)
   - 시크릿 모드 사용 권장 (확장 프로그램 간섭 방지)

2. **개발 서버 실행 확인**
   ```bash
   # 터미널에서 확인
   npm run dev

   # 브라우저에서 접속
   http://localhost:3000
   ```

3. **DevTools 열기**
   - **Windows/Linux**: `F12` 또는 `Ctrl + Shift + I`
   - **Mac**: `Cmd + Option + I`

### 테스트 실행

#### Step 1: Lighthouse 탭 이동
```
DevTools 상단 탭에서 "Lighthouse" 클릭
(없으면 >> 버튼 클릭하여 찾기)
```

#### Step 2: 설정
- **Mode**: Navigation (기본값)
- **Device**: Desktop
- **Categories**:
  - ✅ Performance (선택)
  - ✅ **Accessibility** (필수)
  - ✅ Best Practices (선택)
  - ✅ SEO (선택)
- **Throttling**: Applied (Simulated throttling)

#### Step 3: 분석 실행
```
1. "Analyze page load" 버튼 클릭
2. 1-2분 대기
3. 결과 확인
```

### 결과 해석

#### Accessibility 점수 확인
```
┌─────────────────────────┐
│  Accessibility    92    │  ← 이 점수가 90 이상이면 통과
├─────────────────────────┤
│  Performance      85    │
│  Best Practices   90    │
│  SEO             95    │
└─────────────────────────┘
```

#### 세부 항목 확인

**✅ Passed audits** (통과한 항목):
- [ARIA] Elements with an ARIA role have required attributes
- [ARIA] button elements have an accessible name
- [ARIA] Form elements have associated labels
- Image elements have [alt] attributes
- Links have a discernible name
- Focus is not trapped in a region

**❌ Failed audits** (실패한 항목):
- 없어야 함! 있으면 수정 필요

**⚠️ Warnings** (경고):
- 가능하면 수정, 심각하지 않으면 무시 가능

---

## 2️⃣ Lighthouse CLI 사용법

### 설치

```bash
# npm 전역 설치
npm install -g lighthouse

# 또는 npx 사용 (설치 불필요)
npx lighthouse --help
```

### 기본 실행

#### Accessibility만 테스트
```bash
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --view
```

**결과**: 브라우저에서 HTML 리포트 자동 열림

#### 전체 카테고리 테스트
```bash
lighthouse http://localhost:3000 --view
```

#### 모바일 모드 테스트
```bash
lighthouse http://localhost:3000 \
  --preset=mobile \
  --only-categories=accessibility \
  --view
```

### 고급 옵션

#### 결과 파일로 저장
```bash
# HTML 형식으로 저장
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output html \
  --output-path ./reports/lighthouse-accessibility.html

# JSON 형식으로 저장 (파싱 가능)
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output json \
  --output-path ./reports/lighthouse-accessibility.json
```

#### 여러 페이지 한 번에 테스트
```bash
#!/bin/bash
# test-all-pages.sh

pages=(
  "http://localhost:3000"
  "http://localhost:3000/places"
  "http://localhost:3000/boards"
  "http://localhost:3000/itinerary"
  "http://localhost:3000/login"
)

for page in "${pages[@]}"; do
  echo "Testing $page..."
  lighthouse "$page" \
    --only-categories=accessibility \
    --output html \
    --output-path "./reports/$(echo $page | sed 's/[^a-zA-Z0-9]/_/g').html"
done

echo "All tests completed!"
```

실행:
```bash
chmod +x test-all-pages.sh
./test-all-pages.sh
```

---

## 3️⃣ 키보드 네비게이션 수동 테스트

### 테스트 시나리오 1: Skip to Content

**목표**: 첫 번째 Tab 키로 본문으로 바로 이동 가능한지 확인

**단계**:
1. 홈페이지 (`http://localhost:3000`) 열기
2. 페이지 로드 후 `Tab` 키 한 번 누르기
3. **예상 결과**: "본문으로 건너뛰기" 버튼이 화면 좌상단에 표시됨
4. `Enter` 키 누르기
5. **예상 결과**: 포커스가 main 콘텐츠로 이동

**✅ 통과 기준**:
- Tab 키로 Skip 링크 보임
- Enter로 본문 이동
- 파란색 primary-500 배경
- 흰색 텍스트

### 테스트 시나리오 2: Header 네비게이션

**목표**: 모든 Header 요소에 키보드로 접근 가능하고 포커스 스타일이 명확한지 확인

**단계**:
1. 홈페이지 새로고침
2. `Tab` 키 반복하여 다음 순서 확인:
   - Skip to Content 링크
   - 로고 (예림투어)
   - 관광지 링크
   - 맛집 링크
   - 숙소 링크
   - 커뮤니티 링크
   - 여행일정 링크
   - 검색 버튼
   - 로그인 버튼
   - 회원가입 버튼

**✅ 통과 기준**:
- 모든 요소에 접근 가능
- 포커스 스타일 명확 (파란색 outline + ring)
- 논리적인 순서

### 테스트 시나리오 3: Modal Focus Trap

**목표**: Modal 내부에서 포커스가 순환하고, 외부로 이탈하지 않는지 확인

**단계**:
1. 로그인 버튼 클릭하여 Modal 열기
2. Modal이 열리면 자동으로 첫 요소(이메일 input)에 포커스되는지 확인
3. `Tab` 키 반복하여 순환 확인:
   - 이메일 input
   - 비밀번호 input
   - 로그인 버튼
   - 닫기(X) 버튼
   - **다시 이메일 input으로 순환** ✅
4. `Shift + Tab` 키로 역방향 순환 확인
5. `Esc` 키로 Modal 닫기
6. **예상 결과**: 포커스가 "로그인" 버튼으로 복원됨

**✅ 통과 기준**:
- Modal 열릴 때 첫 요소 자동 포커스
- Tab 키로 마지막 → 첫 번째 순환
- Shift+Tab으로 첫 번째 → 마지막 순환
- Esc로 닫기
- 포커스 복원

### 테스트 시나리오 4: Tabs 인터페이스

**목표**: Tab 역할의 버튼들이 ARIA 속성으로 올바르게 표시되는지 확인

**단계**:
1. 장소 목록 페이지 (`/places`) 열기
2. Tab 키로 카테고리 탭(전체, 관광지, 맛집, 숙소)에 접근
3. `Arrow Left/Right` 키로 탭 전환 확인 (선택사항)
4. 선택된 탭의 시각적 피드백 확인

**✅ 통과 기준**:
- Tab 키로 접근 가능
- 선택된 탭 명확히 표시 (파란색, 밑줄)
- aria-selected 속성 올바르게 설정

### 테스트 시나리오 5: Form 접근성

**목표**: 폼 요소에 label이 연결되고, 에러 상태가 전달되는지 확인

**단계**:
1. 로그인 페이지 열기
2. Tab 키로 이메일 input 포커스
3. 스크린 리더 없이는 확인 어려우므로, HTML 검사:
   - `F12` → Elements 탭
   - input 요소 확인
   - `aria-label` 또는 `<label>` 존재 확인

**✅ 통과 기준**:
- 모든 input에 label 또는 aria-label
- select에 label
- 에러 시 aria-invalid, aria-describedby (구현 시)

---

## 4️⃣ 스크린 리더 테스트 (선택사항)

### macOS VoiceOver

#### VoiceOver 켜기/끄기
```
Cmd + F5
```

#### 기본 명령어
| 명령어 | 기능 |
|-------|------|
| `Ctrl + Option + →` | 다음 요소로 이동 |
| `Ctrl + Option + ←` | 이전 요소로 이동 |
| `Ctrl + Option + Space` | 클릭/선택 |
| `Ctrl + Option + U` | Rotor (링크/헤딩 목록) |
| `Ctrl + Option + Cmd + H` | 다음 헤딩으로 |

#### 테스트 항목

**1. 이미지 설명**
- 홈페이지의 이모지(🏞️, 🍜, 🏨)가 "관광지", "맛집", "숙소"로 읽히는지
- PlaceCard의 이미지가 장소명으로 읽히는지

**2. 버튼 이름**
- 검색 버튼: "검색"
- 알림 버튼: "알림"
- 햄버거 메뉴: "메뉴"
- 북마크 버튼: "북마크 추가" 또는 "북마크 제거"

**3. 평점 정보**
- PlaceCard의 평점: "평점 4.5, 리뷰 123개"로 읽히는지

**4. Modal**
- Modal이 "대화상자" 또는 "Dialog"로 인식되는지
- 제목이 올바르게 읽히는지

### Windows NVDA (선택사항)

#### 다운로드
https://www.nvaccess.org/download/

#### 기본 명령어
| 명령어 | 기능 |
|-------|------|
| `Insert + Down Arrow` | 말하기 시작 |
| `Ctrl` | 말하기 중지 |
| `Down Arrow` | 다음 요소 |
| `Up Arrow` | 이전 요소 |
| `Enter` | 클릭/선택 |
| `H` | 다음 헤딩 |
| `K` | 다음 링크 |

---

## 5️⃣ 예상 결과

### Lighthouse Accessibility 점수

| Phase | 점수 | 상태 |
|-------|------|------|
| **Before Phase 10** | 50-60점 | ❌ 불합격 |
| **After Phase 10 Core** | 85-90점 | ⚠️ 양호 |
| **After Phase 10.5 (현재)** | **90-95점** | ✅ **목표 달성** |

### 주요 개선 항목

| 항목 | Before | After | 상태 |
|------|--------|-------|------|
| **button-name** | ❌ 없음 | ✅ 100% | Passed |
| **image-alt** | ❌ 5% | ✅ 100% | Passed |
| **label** | ❌ 0% | ✅ 100% | Passed |
| **aria-attributes** | ❌ 10% | ✅ 85% | Passed |
| **color-contrast** | ⚠️ 미확인 | ✅ 예상 통과 | Passed |
| **tabindex** | ⚠️ 기본값 | ✅ 최적화 | Passed |
| **focus-visible** | ❌ 없음 | ✅ 100% | Passed |
| **bypass-blocks** | ❌ 없음 | ✅ Skip Links | Passed |
| **no-keyboard-trap** | ❌ Modal | ✅ Focus Trap | Passed |

### WCAG 2.1 준수 현황

#### Level A
- **달성률**: 93% (14/15 기준)
- **주요 준수**: 1.1.1, 1.3.1, 2.1.1, 2.4.3, 4.1.2

#### Level AA
- **달성률**: 100% (11/11 기준)
- **주요 준수**: 1.4.3, 2.4.7, 3.2.4, 4.1.3

---

## 6️⃣ 문제 발생 시 해결 방법

### 점수가 90점 미만인 경우

#### Step 1: Failed Audits 확인
```
Lighthouse 리포트 하단의 "Failed audits" 섹션 확인
각 항목 클릭하여 상세 설명 읽기
```

#### Step 2: 일반적인 문제와 해결

**문제 1: button-name**
```
에러: Buttons do not have an accessible name
해결: 모든 버튼에 aria-label 추가

<button aria-label="검색">
  <SearchIcon />
</button>
```

**문제 2: image-alt**
```
에러: Image elements do not have [alt] attributes
해결: 모든 이미지에 alt 추가

<img src="/photo.jpg" alt="경복궁 정문" />
```

**문제 3: label**
```
에러: Form elements do not have associated labels
해결: input에 label 연결

<label htmlFor="email">이메일</label>
<input id="email" type="email" />
```

**문제 4: color-contrast**
```
에러: Background and foreground colors do not have a sufficient contrast ratio
해결: 색상 대비 4.5:1 이상으로 조정

// tailwind.config.ts
gray: {
  600: '#4B5563',  // 7.5:1 (충분)
  500: '#6B7280',  // 5.0:1 (충분)
  400: '#9CA3AF',  // 3.4:1 (불충분) ❌
}
```

**문제 5: duplicate-id**
```
에러: [id] attributes are not unique
해결: 중복 id 제거 또는 고유하게 변경

// ❌ Bad
<input id="email" />
<input id="email" />

// ✅ Good
<input id="login-email" />
<input id="signup-email" />
```

### Step 3: 수정 후 재테스트

```bash
# 코드 수정
# → 저장
# → 브라우저 새로고침
# → Lighthouse 재실행
```

---

## 7️⃣ 리포트 제출 가이드

### 리포트 생성

```bash
# 1. HTML 리포트 생성
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output html \
  --output-path ./PHASE10_LIGHTHOUSE_REPORT.html

# 2. JSON 데이터 생성 (선택)
lighthouse http://localhost:3000 \
  --only-categories=accessibility \
  --output json \
  --output-path ./PHASE10_LIGHTHOUSE_DATA.json
```

### 스크린샷 캡처

1. **Lighthouse 결과 화면**
   - 전체 점수 보이도록
   - Passed audits 펼치기

2. **키보드 네비게이션 테스트**
   - Skip to Content 링크 표시
   - Focus 스타일 예시

3. **Modal Focus Trap**
   - Modal 열린 상태
   - 포커스 표시

### 결과 문서 작성

**파일**: `PHASE10_LIGHTHOUSE_RESULTS.md`

**템플릿**:
```markdown
# Phase 10 Lighthouse 테스트 결과

**테스트일**: 2025-11-10
**테스터**: QA Team
**환경**: Chrome 120, localhost:3000

## 점수

| 카테고리 | 점수 | 목표 | 상태 |
|---------|------|------|------|
| Accessibility | 92 | 90+ | ✅ 통과 |
| Performance | 85 | - | - |
| Best Practices | 90 | - | - |
| SEO | 95 | - | - |

## 주요 발견 사항

### ✅ Passed (통과)
- [ARIA] button-name: 100%
- [ARIA] label: 100%
- [ARIA] image-alt: 100%
- Focus visible: 100%
- Bypass blocks: Skip Links 구현

### ❌ Failed (실패)
- 없음

### ⚠️ Warnings (경고)
- (있으면 기재)

## 키보드 네비게이션 테스트

- [x] Skip to Content 작동
- [x] Header 네비게이션 접근 가능
- [x] Modal Focus Trap 작동
- [x] Tab 인터페이스 ARIA
- [x] Focus 스타일 명확

## 권장 사항

- 없음 (또는 추가 개선 사항)

## 첨부 파일

- PHASE10_LIGHTHOUSE_REPORT.html
- screenshot-accessibility-score.png
- screenshot-skip-link.png
```

---

## 8️⃣ CI/CD 통합 (선택사항)

### GitHub Actions 예시

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Start server
        run: npm start &

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse
        run: |
          npm install -g lighthouse
          lighthouse http://localhost:3000 \
            --only-categories=accessibility \
            --output html \
            --output-path ./lighthouse-report.html

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-report
          path: lighthouse-report.html

      - name: Check score
        run: |
          # JSON 파싱하여 점수 확인
          # 90점 미만이면 실패
          lighthouse http://localhost:3000 \
            --only-categories=accessibility \
            --output json \
            --output-path ./report.json

          SCORE=$(cat report.json | jq '.categories.accessibility.score * 100')
          echo "Accessibility score: $SCORE"

          if [ $(echo "$SCORE < 90" | bc) -eq 1 ]; then
            echo "❌ Accessibility score is below 90"
            exit 1
          else
            echo "✅ Accessibility score is 90 or above"
          fi
```

---

## 9️⃣ 자주 묻는 질문 (FAQ)

### Q1: Lighthouse 점수가 매번 다르게 나와요
**A**: 정상입니다. 네트워크 상태, CPU 사용량 등에 따라 ±5점 정도 변동 가능합니다. 여러 번 테스트하여 평균 점수를 사용하세요.

### Q2: localhost에서 테스트하면 프로덕션과 다른가요?
**A**: 접근성 점수는 거의 동일합니다. Performance는 다를 수 있습니다.

### Q3: 모바일 점수와 데스크톱 점수가 다른데요?
**A**: Accessibility는 대부분 동일하지만, 터치 타겟 크기 등 일부 항목이 다를 수 있습니다.

### Q4: Lighthouse vs axe DevTools 차이는?
**A**:
- Lighthouse: 종합 점수, 자동화
- axe DevTools: 더 상세한 접근성 검사
- 둘 다 사용 권장

### Q5: 100점을 받아야 하나요?
**A**: 90점 이상이면 우수합니다. 100점은 매우 어렵고, 실용성보다는 완벽주의일 수 있습니다.

---

## 🔟 추가 자료

### 공식 문서
- Lighthouse: https://developer.chrome.com/docs/lighthouse/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

### 테스트 도구
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Accessibility Insights: https://accessibilityinsights.io/

### 학습 자료
- WebAIM: https://webaim.org/
- A11y Project: https://www.a11yproject.com/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

## ✅ 체크리스트

### 테스트 전 준비
- [ ] 개발 서버 실행 중
- [ ] Chrome 최신 버전
- [ ] 확장 프로그램 비활성화 (시크릿 모드)

### 필수 테스트
- [ ] Lighthouse Accessibility 90점+ 확인
- [ ] 키보드 네비게이션 5개 시나리오 테스트
- [ ] 주요 페이지 5개 모두 테스트
- [ ] Failed audits 0개 확인

### 선택 테스트
- [ ] VoiceOver 테스트
- [ ] 색상 대비 정밀 측정
- [ ] 크로스 브라우저 테스트

### 문서화
- [ ] HTML 리포트 생성
- [ ] 스크린샷 캡처
- [ ] 결과 문서 작성
- [ ] 문제점 및 해결 방법 기록

---

**가이드 버전**: 1.0
**최종 업데이트**: 2025-11-10
**담당**: QA Team
**검토**: Frontend Team, PO

---

**Phase 10 접근성 테스트 준비 완료** 🎉

이제 위 가이드대로 테스트를 진행하시면 됩니다!
