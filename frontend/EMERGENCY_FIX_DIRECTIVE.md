# 긴급 전체 에러 수정 작업 지시서

**발행일**: 2025-11-10
**발행자**: PO Team
**긴급도**: 🔴🔴 **CRITICAL** (최우선 긴급)
**상태**: 🚨 **진행 중**

---

## 🚨 긴급 상황

### 사용자 보고
> "이미지가 정상적으로 보이다가 다시 안보이는데 뜨다가 안뜨다가 하는 증상을 확실하게 잘 보이게 수정해주고 자유게시판에서 게시글 작성시 unhandled runtime error가 발생하는데 이 부분도 자유게시판 뿐 아니라 전체적으로 발생하는 에러를 전부 수정하라고"

### 발견된 문제 (3가지)

#### 1. 🔴 이미지 간헐적 표시 문제 (CRITICAL)
```bash
⨯ upstream image response failed for
  https://images.unsplash.com/photo-1596456961186-0c8983e18e2e?w=1920&h=600&fit=crop 404

⨯ upstream image response failed for
  https://images.unsplash.com/photo-1590487428512-e44bb3ac8822?w=1920&h=600&fit=crop 404
```
**증상**: 이미지가 뜨다가 안 뜨다가 반복
**원인**: 이전 수정이 제대로 반영되지 않음. 여전히 구 URL 사용 중

#### 2. 🔴 page.tsx Syntax Error (CRITICAL)
```bash
⨯ ./src/app/page.tsx
Error: Unexpected token `div`. Expected jsx identifier
```
**증상**: 메인 페이지 간헐적 컴파일 실패
**원인**: JSX 문법 오류 또는 파일 손상 가능성

#### 3. 🟡 자유게시판 에러 (확인 필요)
**증상**: 게시글 작성 시 unhandled runtime error
**파일**: `/boards/new`
**상태**: 컴파일은 성공했으나 런타임 에러 가능성

---

## 🎯 작업 우선순위

### P0 (즉시 - 5분 이내)
1. ✅ 에러 상황 분석 및 작업 지시서 작성
2. 🔄 이미지 URL 완전 수정 (캐시 이슈 해결)
3. 🔄 page.tsx 문법 에러 수정

### P1 (긴급 - 30분 이내)
4. ⏸ 자유게시판 에러 확인 및 수정
5. ⏸ 전체 앱 에러 스캔
6. ⏸ 발견된 모든 에러 수정

### P2 (중요 - 1시간 이내)
7. ⏸ 전체 테스트 및 검증
8. ⏸ 최종 문서화

---

## 👥 팀별 긴급 작업 지시

### 🎯 PO Team
**담당자**: PO
**작업 내용**:
- [x] 긴급 상황 분석
- [x] 작업 지시서 작성
- [ ] 각 팀 작업 모니터링
- [ ] 실시간 검수
- [ ] 사용자 보고

**완료 기한**: 지금 즉시

---

### 💻 Frontend Team (긴급 작업)

#### 🚨 Task 1: 이미지 URL 캐시 문제 해결 (최우선)
**파일**: `src/components/home/HeroSlider.tsx`, `src/components/home/PopularPlaces.tsx`

**문제**: 수정했는데도 구 URL이 계속 사용됨
**원인**: Git 캐시 또는 빌드 캐시 문제

**즉시 조치**:
```bash
# 1. 개발 서버 중지
# 2. 캐시 삭제
rm -rf .next
rm -rf node_modules/.cache

# 3. 파일 재확인 (실제 수정되었는지)
cat src/components/home/HeroSlider.tsx | grep "photo-1596456961186"
cat src/components/home/HeroSlider.tsx | grep "photo-1590487428512"

# 만약 있다면:
# → 파일이 실제로 수정되지 않음
# → 다시 수정 필요

# 4. 개발 서버 재시작
npm run dev
```

**수정 확인**:
- [ ] HeroSlider.tsx에서 `photo-1596456961186` 검색 → 0개
- [ ] HeroSlider.tsx에서 `photo-1590487428512` 검색 → 0개
- [ ] 모든 URL에 `?q=80&auto=format` 포함 확인

---

#### 🚨 Task 2: page.tsx Syntax Error 긴급 수정
**파일**: `src/app/page.tsx`

**에러**:
```
Unexpected token `div`. Expected jsx identifier
Line 9: <div className="flex flex-col">
```

**가능한 원인**:
1. 파일 인코딩 문제
2. 숨겨진 특수 문자
3. JSX 문법 오류
4. import 누락

**긴급 조치**:
1. 파일 전체를 새로 읽어서 확인
2. 문제가 있다면 파일 전체를 다시 작성
3. 컴파일 확인

**검증**:
```bash
npm run dev
# 메인 페이지 접속
# Console 에러 없는지 확인
```

---

#### 🟡 Task 3: 자유게시판 에러 확인 및 수정
**파일**: `src/app/(main)/boards/new/page.tsx`

**확인 사항**:
1. 실제 페이지 접속해서 에러 재현
2. Console 에러 메시지 확인
3. 에러 원인 파악
4. 즉시 수정

**테스트**:
```
1. http://localhost:3000/boards 접속
2. "글쓰기" 버튼 클릭 → /boards/new 이동
3. 폼 작성
4. "등록" 버튼 클릭
5. 에러 발생 여부 확인
```

---

#### 🟡 Task 4: 전체 앱 에러 스캔
**범위**: 모든 페이지

**스캔 대상**:
```
1. 메인 페이지: /
2. 장소 페이지: /places
3. 커뮤니티: /boards
   - 목록: /boards
   - 작성: /boards/new
   - 상세: /boards/[id]
4. 여행 일정: /itinerary
   - 목록: /itinerary
   - 작성: /itinerary/new
5. 로그인: /login
6. 회원가입: /signup
7. 마이페이지: /mypage
8. 사업자: /business/*
```

**확인 방법**:
```bash
# 각 페이지 접속
# F12 → Console 탭
# 에러 메시지 기록
```

**발견된 에러 기록**:
```
페이지: /boards/new
에러: [에러 메시지]
원인: [원인 분석]
수정 방법: [수정 계획]
```

---

### 📝 Documentation Team
**담당자**: Documentation
**작업 내용**:
- [ ] 발견된 모든 에러 기록
- [ ] 수정 과정 문서화
- [ ] Before/After 스크린샷
- [ ] 최종 검증 리포트 작성

---

## 🔍 에러 체크리스트

### 이미지 로딩 에러
- [ ] HeroSlider 404 에러 0개
- [ ] PopularPlaces 404 에러 0개
- [ ] 카테고리 카드 404 에러 0개
- [ ] 모든 이미지 안정적으로 로드

### 컴파일 에러
- [ ] page.tsx Syntax Error 해결
- [ ] TypeScript 에러 0개
- [ ] 모든 페이지 컴파일 성공

### 런타임 에러
- [ ] 자유게시판 작성 정상 작동
- [ ] 모든 폼 제출 정상 작동
- [ ] Console 에러 0개

### 기능 테스트
- [ ] 히어로 슬라이더 자동 전환 (5초)
- [ ] 카테고리 카드 클릭 이동
- [ ] 추천 여행지 표시
- [ ] 자유게시판 글쓰기
- [ ] 여행 일정 작성

---

## 📊 작업 진행 상황

### 10:00 - PO Team
- [x] 사용자 에러 보고 수신
- [x] 에러 로그 분석
- [x] 긴급 작업 지시서 작성

### 10:10 - Frontend Team (예정)
- [ ] 이미지 URL 캐시 문제 해결
- [ ] page.tsx Syntax Error 수정
- [ ] 자유게시판 에러 확인
- [ ] 전체 앱 에러 스캔
- [ ] 발견된 에러 수정

### 11:00 - 최종 검수 (예정)
- [ ] PO 최종 검수
- [ ] 사용자 확인 요청
- [ ] 문서화 완료

---

## 🛠️ 긴급 수정 스크립트

### 캐시 완전 삭제
```bash
# Next.js 캐시 삭제
rm -rf .next

# Node 모듈 캐시 삭제
rm -rf node_modules/.cache

# Git 캐시 삭제 (선택)
git rm -r --cached .
git add .
```

### 개발 서버 재시작
```bash
# 기존 프로세스 종료
killall node

# 재시작
npm run dev
```

### 브라우저 캐시 강제 삭제
```
Chrome: Cmd/Ctrl + Shift + Delete
→ "캐시된 이미지 및 파일" 체크
→ "전체 기간" 선택
→ "데이터 삭제"
```

---

## ✅ 검증 프로토콜

### Step 1: 서버 재시작 후 확인
```bash
npm run dev

# 로그 확인
# ✓ Compiled / in XXXms
# GET / 200 in XXms
# ⨯ 에러 없는지 확인
```

### Step 2: 브라우저 테스트
```
1. 모든 브라우저 캐시 삭제
2. http://localhost:3000 접속
3. F12 → Network 탭
4. Img 필터
5. 새로고침
6. 모든 이미지 200 OK 확인
7. 404 에러 0개 확인
```

### Step 3: 기능 테스트
```
1. 메인 페이지 이미지 5번 새로고침
   → 모든 이미지 항상 표시되는지 확인

2. 자유게시판 글쓰기
   → 에러 없이 작성되는지 확인

3. 모든 페이지 방문
   → Console 에러 없는지 확인
```

---

## 🎯 완료 조건

### Definition of Done
- [ ] 이미지 404 에러 0개 (100% 안정)
- [ ] page.tsx Syntax Error 해결
- [ ] 자유게시판 정상 작동
- [ ] 전체 앱 에러 0개
- [ ] 5번 새로고침 테스트 통과 (이미지 항상 표시)
- [ ] 모든 폼 제출 정상 작동
- [ ] PO 최종 검수 통과
- [ ] 사용자 확인 완료
- [ ] 모든 작업 문서화 완료

---

## 📝 에러 발생 시 즉시 보고

에러 발생 시 아래 형식으로 즉시 기록:

```markdown
## 에러 #N
- **발생 시각**: 10:XX
- **파일**: src/...
- **에러 메시지**: ...
- **재현 방법**: ...
- **해결 방법**: ...
- **완료 여부**: ⏸ / ✅
```

---

## 📞 긴급 연락

**PO Team**: 전체 조율 및 검수
**Frontend Team**: 즉시 수정
**사용자**: 최종 확인

---

**문서 버전**: 1.0
**최종 수정**: 2025-11-10 10:00
**다음 리뷰**: 수정 완료 후 즉시

**🚨 모든 작업은 에러를 즉시 해결하면서 진행!**
**📝 모든 작업은 문서화하여 추후 확인 가능하게 기록!**
