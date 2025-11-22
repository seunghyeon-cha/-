# Performance Team - Work Order

**발행일**: 2025-11-19
**우선순위**: P2 (중간)
**담당자**: Performance Team
**예상 소요 시간**: 1.5시간

---

## 작업 개요

`<img>` 태그를 Next.js `<Image />` 컴포넌트로 전환하여 성능을 최적화합니다.

---

## 현재 상황

**발견된 이슈**: 5개
**경고 메시지**: "Using `<img>` could result in slower LCP and higher bandwidth"

**영향도**:
- LCP (Largest Contentful Paint) 저하
- 대역폭 낭비
- 이미지 최적화 미적용
- SEO 점수 감소

---

## Next.js Image의 장점

1. **자동 최적화**: WebP/AVIF 형식 자동 변환
2. **레이지 로딩**: 뷰포트 진입 시 로딩
3. **반응형**: 다양한 화면 크기에 최적화된 이미지
4. **LCP 개선**: 우선순위 로딩 지원
5. **CLS 방지**: width/height 지정으로 레이아웃 시프트 방지

---

## 작업 내용

### Task 1: Image 컴포넌트 import

모든 파일에 추가:
```typescript
import Image from 'next/image';
```

### Task 2: img → Image 변환 패턴

#### 패턴 1: 정적 이미지
```typescript
// ❌ Before
<img src="/logo.png" alt="로고" />

// ✅ After
<Image
  src="/logo.png"
  alt="로고"
  width={200}
  height={50}
  priority // 첫 화면 이미지인 경우
/>
```

#### 패턴 2: 동적 이미지 (API 응답)
```typescript
// ❌ Before
<img
  src={place.imageUrl || '/placeholder.jpg'}
  alt={place.name}
/>

// ✅ After
<Image
  src={place.imageUrl || '/placeholder.jpg'}
  alt={place.name}
  width={400}
  height={300}
  className="object-cover"
/>
```

#### 패턴 3: 외부 이미지
```typescript
// ✅ After
<Image
  src={externalUrl}
  alt="외부 이미지"
  width={400}
  height={300}
  unoptimized // 외부 이미지는 최적화 불가능한 경우
/>
```

외부 도메인 사용 시 `next.config.js` 설정:
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}
```

### Task 3: 파일별 수정

#### `src/app/(main)/boards/[id]/edit/page.tsx`
- 게시글 이미지 미리보기 (line 214)

#### `src/app/(main)/boards/new/page.tsx`
- 게시글 이미지 미리보기 (line 215)

#### `src/app/(main)/business/places/page.tsx`
- 장소 목록 이미지 (line 125)

#### 기타 컴포넌트
- 리뷰 이미지
- 프로필 이미지
- 썸네일 이미지

---

## width/height 설정 가이드

### 1. 정확한 크기를 아는 경우
```typescript
<Image src="/logo.png" width={200} height={50} alt="로고" />
```

### 2. 반응형 이미지 (컨테이너 채우기)
```typescript
<div className="relative w-full h-64">
  <Image
    src={imageUrl}
    alt="이미지"
    fill
    className="object-cover"
  />
</div>
```

### 3. 비율 유지
```typescript
<Image
  src={imageUrl}
  alt="이미지"
  width={400}
  height={300} // 4:3 비율
  className="w-full h-auto"
/>
```

---

## 체크리스트

### Image 컴포넌트 전환
- [ ] boards/[id]/edit/page.tsx
- [ ] boards/new/page.tsx
- [ ] business/places/page.tsx
- [ ] 리뷰 컴포넌트
- [ ] 기타 이미지 사용 컴포넌트

### 설정
- [ ] next.config.js 외부 도메인 설정
- [ ] width/height 적절히 설정
- [ ] priority 속성 첫 화면 이미지에 적용
- [ ] placeholder="blur" 적용 (선택)

### 검증
- [ ] ESLint no-img-element 경고 0개
- [ ] 모든 이미지 정상 표시
- [ ] LCP 개선 확인
- [ ] CLS 발생 여부 확인

---

## 최적화 팁

### 1. Priority 설정
첫 화면(Above the fold)의 이미지에만 적용:
```typescript
<Image src="/hero.jpg" priority alt="메인" />
```

### 2. Placeholder Blur
```typescript
<Image
  src={imageUrl}
  placeholder="blur"
  blurDataURL="data:image/..." // 또는 정적 import
  alt="이미지"
/>
```

### 3. Sizes 속성
반응형 이미지 최적화:
```typescript
<Image
  src={imageUrl}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="이미지"
/>
```

---

## 성능 측정

### Before/After 비교
```bash
# Lighthouse 실행
npm run build
npm run start
# Chrome DevTools > Lighthouse 실행
```

**측정 항목**:
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- Total Bundle Size
- Image Optimization Score

---

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Image Component API](https://nextjs.org/docs/api-reference/next/image)
- [Web Vitals](https://web.dev/vitals/)
