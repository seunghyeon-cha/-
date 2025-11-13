# 메인 페이지 에러 수정 작업 지시서

**발행일**: 2025-11-10
**발행자**: PO Team
**긴급도**: 🔴 **HIGH** (즉시 수정 필요)
**상태**: 진행 중

---

## 📋 상황 보고

### 사용자 피드백
> "지금도 메인 페이지 확인하니 Unhandled Runtime Error 가 발생하고있고 메인 페이지가 수정이 안된거로 확인돼"

### 확인된 문제
1. ✗ **Unsplash 이미지 404 에러** (일부 이미지 URL 작동 안 함)
2. ✗ **컴파일 에러** (간헐적 발생)
3. ✗ **이미지 표시 안 됨** (사용자 브라우저에서)

### 에러 로그
```bash
⨯ upstream image response failed for
  https://images.unsplash.com/photo-1596456961186-0c8983e18e2e?w=1920&h=600&fit=crop 404

⨯ upstream image response failed for
  https://images.unsplash.com/photo-1590487428512-e44bb3ac8822?w=1920&h=600&fit=crop 404
```

---

## 🎯 해결 방안

### 원인 분석
- Unsplash API의 일부 이미지 ID가 존재하지 않거나 삭제됨
- 외부 이미지 서비스 의존도가 높음
- 이미지 URL 파라미터 형식 문제 가능성

### 해결 전략
1. **안정적인 이미지 소스로 교체**
   - Placeholder 이미지 사용
   - 또는 검증된 Unsplash 이미지 ID 사용

2. **에러 핸들링 추가**
   - 이미지 로드 실패 시 fallback 이미지 표시
   - onError 핸들러 구현

3. **향후 자체 이미지 사용 준비**
   - /public/images 폴더에 이미지 저장
   - 외부 의존도 최소화

---

## 👥 팀별 작업 지시

### 🎯 PO Team (Product Owner)
**담당자**: PO
**작업 내용**:
- [x] 에러 상황 분석
- [x] 해결 방안 수립
- [x] 작업 지시서 작성
- [ ] Frontend 팀 작업 모니터링
- [ ] 수정 완료 후 최종 검수
- [ ] 사용자에게 수정 완료 보고

**완료 기한**: 오늘 중

---

### 💻 Frontend Team
**담당자**: Frontend Developer
**작업 내용**:

#### Task 1: HeroSlider 이미지 URL 수정 (최우선) ⚠️
**파일**: `src/components/home/HeroSlider.tsx`

**현재 문제**:
```tsx
// 일부 이미지가 404 에러
{
  id: 3,
  image: 'https://images.unsplash.com/photo-1590487428512-e44bb3ac8822?w=1920&h=600&fit=crop',
  // ... 404 에러
},
{
  id: 4,
  image: 'https://images.unsplash.com/photo-1596456961186-0c8983e18e2e?w=1920&h=600&fit=crop',
  // ... 404 에러
},
```

**수정 방법**:
```tsx
// 검증된 Unsplash 이미지 ID로 교체 또는 placeholder 사용
const slides: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1920&h=600&auto=format&fit=crop',
    title: '제주도의 아름다운 자연을 만나보세요',
    // ...
  },
  // 또는 placeholder 사용
  {
    id: 3,
    image: 'https://via.placeholder.com/1920x600/4F46E5/FFFFFF?text=Gangwon',
    // ...
  },
];
```

**검증 필요**:
- [ ] 모든 이미지가 로드되는지 확인
- [ ] 네트워크 탭에서 404 에러 없는지 확인

---

#### Task 2: PopularPlaces 이미지 URL 수정
**파일**: `src/components/home/PopularPlaces.tsx`

**수정 내용**:
```tsx
// 모든 Unsplash URL 검증 및 수정
const popularPlaces: PopularPlace[] = [
  {
    id: 1,
    name: '제주 성산일출봉',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=300&h=200&auto=format&fit=crop',
    // ... 정상 작동하는 URL 사용
  },
  // ...
];
```

---

#### Task 3: 카테고리 카드 이미지 URL 검증
**파일**: `src/app/page.tsx`

**확인 사항**:
```tsx
// 3개 카드 이미지 모두 정상 작동하는지 확인
<Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?..." />
<Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?..." />
<Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?..." />
```

---

#### Task 4: 이미지 에러 핸들링 추가 (선택)
**목적**: 이미지 로드 실패 시 fallback 표시

**구현 예시**:
```tsx
<Image
  src={imageUrl}
  alt="..."
  fill
  onError={(e) => {
    e.currentTarget.src = 'https://via.placeholder.com/400x250/CCCCCC/666666?text=Image+Not+Available';
  }}
/>
```

---

#### Task 5: 컴파일 에러 해결
**확인 사항**:
- [ ] TypeScript 에러 없음
- [ ] Next.js 빌드 성공
- [ ] 모든 import 정상 작동
- [ ] 브라우저 콘솔 에러 없음

**테스트 명령어**:
```bash
# 개발 서버 재시작
npm run dev

# 브라우저에서 확인
http://localhost:3000

# 콘솔 에러 확인
F12 → Console 탭
```

---

### 📝 Documentation Team
**담당자**: Documentation
**작업 내용**:
- [ ] 에러 수정 과정 기록
- [ ] Before/After 스크린샷
- [ ] 수정된 파일 목록 정리
- [ ] 향후 예방 가이드 작성

---

## 🔍 검수 체크리스트

### Frontend 자체 검수
- [ ] **이미지 로드**: 모든 이미지가 정상적으로 표시되는지 확인
- [ ] **404 에러 제거**: 네트워크 탭에서 404 에러 없는지 확인
- [ ] **컴파일 성공**: 에러 없이 컴파일되는지 확인
- [ ] **브라우저 테스트**: Chrome, Safari에서 정상 작동 확인
- [ ] **모바일 테스트**: 반응형 디자인 정상 작동 확인

### PO 최종 검수
- [ ] **히어로 슬라이더**: 5개 이미지 모두 표시
- [ ] **자동 전환**: 5초마다 슬라이드 변경
- [ ] **카테고리 카드**: 3개 카드 이미지 모두 표시
- [ ] **추천 여행지**: 8개 카드 이미지 모두 표시
- [ ] **성능**: 페이지 로드 속도 3초 이내
- [ ] **에러 없음**: 콘솔에 에러 메시지 없음

---

## 📊 작업 우선순위

### P0 (긴급 - 즉시)
1. ✅ 에러 분석 및 작업 지시서 작성 (PO)
2. 🔄 HeroSlider 이미지 URL 수정 (Frontend)
3. 🔄 PopularPlaces 이미지 URL 수정 (Frontend)

### P1 (중요 - 오늘 중)
4. ⏸ 카테고리 카드 이미지 검증 (Frontend)
5. ⏸ 브라우저 테스트 및 검수 (Frontend)
6. ⏸ PO 최종 검수 (PO)

### P2 (선택 - 내일)
7. ⏸ 이미지 에러 핸들링 추가 (Frontend)
8. ⏸ 문서화 (Documentation)

---

## 🛠️ 권장 이미지 URL 목록

### Unsplash 검증된 이미지 (대안 1)
```
히어로 슬라이더:
1. 제주: photo-1539635278303-d4002c07eae3
2. 부산: photo-1528127269322-539801943592
3. 강원: photo-1519904981063-b0cf448d479e (대체)
4. 경주: photo-1478436127897-769e1b3f0f36 (대체)
5. 전주: photo-1583417319070-4a69db38a482

카테고리 카드:
1. 관광지: photo-1506905925346-21bda4d32df4
2. 맛집: photo-1504674900247-0877df9cc836
3. 숙소: photo-1566073771259-6a8506099945

추천 여행지:
1. photo-1539635278303-d4002c07eae3
2. photo-1528127269322-539801943592
3. photo-1519904981063-b0cf448d479e
4. photo-1478436127897-769e1b3f0f36
5. photo-1583417319070-4a69db38a482
6. photo-1506905925346-21bda4d32df4
7. photo-1464822759023-fed622ff2c3b
8. photo-1441974231531-c6227db76b6e
```

### Placeholder 이미지 (대안 2 - 가장 안전)
```
https://via.placeholder.com/1920x600/4F46E5/FFFFFF?text=Jeju
https://via.placeholder.com/1920x600/06B6D4/FFFFFF?text=Busan
https://via.placeholder.com/1920x600/10B981/FFFFFF?text=Gangwon
https://via.placeholder.com/1920x600/F59E0B/FFFFFF?text=Gyeongju
https://via.placeholder.com/1920x600/EF4444/FFFFFF?text=Jeonju
```

---

## 📝 작업 로그

### 2025-11-10 (오늘)

**10:00 - PO Team**
- [x] 사용자 피드백 수신
- [x] 에러 확인 및 분석
- [x] 작업 지시서 작성

**10:30 - Frontend Team (예정)**
- [ ] HeroSlider 이미지 URL 수정
- [ ] PopularPlaces 이미지 URL 수정
- [ ] 컴파일 및 테스트

**11:00 - PO Team (예정)**
- [ ] 최종 검수
- [ ] 사용자 확인 요청

---

## 🚨 긴급 연락처

- **PO Team**: 작업 지시 및 검수
- **Frontend Team**: 긴급 수정
- **사용자**: 최종 확인

---

## 📌 참고 사항

### Unsplash URL 형식
```
올바른 형식:
https://images.unsplash.com/photo-{IMAGE_ID}?q=80&w={WIDTH}&h={HEIGHT}&auto=format&fit=crop

예시:
https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1920&h=600&auto=format&fit=crop
```

### Next.js Image 최적화 파라미터
- `q`: 품질 (80 권장)
- `w`: 너비
- `h`: 높이
- `auto=format`: 자동 포맷 (WebP 등)
- `fit=crop`: 크롭 방식

---

## ✅ 완료 조건

### Definition of Done
- [ ] 모든 이미지가 브라우저에 표시됨
- [ ] 네트워크 탭에 404 에러 없음
- [ ] 콘솔에 에러 메시지 없음
- [ ] 히어로 슬라이더 정상 작동
- [ ] 카테고리 카드 3개 모두 표시
- [ ] 추천 여행지 8개 모두 표시
- [ ] 모바일/데스크탑 반응형 정상
- [ ] PO 최종 검수 통과
- [ ] 사용자 확인 완료

---

**문서 버전**: 1.0
**최종 수정**: 2025-11-10 10:30
**다음 리뷰**: 작업 완료 후
