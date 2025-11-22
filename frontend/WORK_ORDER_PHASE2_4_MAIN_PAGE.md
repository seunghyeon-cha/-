# Phase 2.4: 메인 페이지 완성

**담당**: Type Safety Team
**우선순위**: P2 (중간)
**예상 시간**: 30분
**작업량**: 4건

---

## 📋 작업 대상 파일

### src/app/(main)/page.tsx (4건)
**이슈**:
- any 타입 4건 (lines 10, 11, 12, 13)

**파일 위치**: `src/app/(main)/page.tsx`

---

## 🔍 현재 코드 분석 필요

이 파일의 any 타입은 메인 페이지 데이터 fetch 관련으로 예상됩니다.
작업 전 파일을 읽고 컨텍스트를 파악해야 합니다.

---

## 📝 작업 단계

### Step 1: 파일 읽기 및 분석
```bash
# 파일 확인
cat src/app/(main)/page.tsx | head -20
```

### Step 2: any 타입 식별
- Line 10, 11, 12, 13의 any 타입이 무엇인지 확인
- 아마도 다음 중 하나일 것:
  1. API 응답 타입
  2. State 타입
  3. Props 타입
  4. 이벤트 핸들러 타입

### Step 3: 적절한 타입 정의

#### 패턴 1: API 응답 타입
```typescript
// 기존 API 타입 활용
import { Place } from '@/lib/api/places';
import { Board } from '@/types/board';
import { Festival } from '@/lib/api/festivals';

const [places, setPlaces] = useState<Place[]>([]);
const [boards, setBoards] = useState<Board[]>([]);
```

#### 패턴 2: 커스텀 인터페이스
```typescript
interface MainPageData {
  popularPlaces: Place[];
  recentBoards: Board[];
  upcomingFestivals: Festival[];
  statistics: {
    totalPlaces: number;
    totalBoards: number;
    totalUsers: number;
  };
}
```

#### 패턴 3: 함수 타입
```typescript
const fetchMainData = async (): Promise<MainPageData> => {
  // 데이터 페칭
};
```

---

## 💡 예상 시나리오 및 해결 방법

### 시나리오 A: 여러 API 데이터를 fetch하는 경우
```typescript
import { Place } from '@/lib/api/places';
import { Board } from '@/types/board';
import { Festival } from '@/lib/api/festivals';

export default function MainPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [placesData, boardsData, festivalsData] = await Promise.all([
          getPlaces({ limit: 6 }),
          getBoards({ limit: 5 }),
          getFestivals({ numOfRows: 4 })
        ]);

        setPlaces(placesData.data);
        setBoards(boardsData.data);
        setFestivals(festivalsData.data);
      } catch (error) {
        console.error('Failed to fetch main data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ...
}
```

### 시나리오 B: 통합 API 엔드포인트가 있는 경우
```typescript
interface MainPageResponse {
  popularPlaces: Place[];
  recentBoards: Board[];
  upcomingFestivals: Festival[];
}

const fetchMainPageData = async (): Promise<MainPageResponse> => {
  const response = await apiClient.get<MainPageResponse>('/api/main');
  return response.data;
};
```

---

## ✅ 체크리스트

- [ ] 파일 읽기 및 any 타입 위치 확인
- [ ] any 타입이 사용되는 컨텍스트 파악
- [ ] 적절한 타입 정의 또는 import
- [ ] 타입 적용 및 테스트
- [ ] ESLint 경고 해결 확인
- [ ] 메인 페이지 정상 작동 확인
- [ ] 작업 로그 작성

---

## 📝 작업 로그 양식

```markdown
### Phase 2.4 작업 로그

**작업 시간**: [시작] - [종료]

#### 발견 사항
- Line 10: [any 타입이 무엇이었는지]
- Line 11: [any 타입이 무엇이었는지]
- Line 12: [any 타입이 무엇이었는지]
- Line 13: [any 타입이 무엇이었는지]

#### 적용한 해결 방법
- [시나리오 A/B/C 중 어떤 방법 사용]
- [생성한 인터페이스나 import한 타입]

#### 수정 내용
```typescript
// 수정 전
const [data, setData] = useState<any>([]);

// 수정 후
const [data, setData] = useState<Place[]>([]);
```

#### 발견된 추가 이슈
- [있다면 기록]

#### 테스트 결과
- ESLint: 4개 → 0개
- 메인 페이지 렌더링: 정상/이슈
- 데이터 로딩: 정상/이슈
- Build: 성공/실패
```

---

## ⚠️ 주의사항

1. **기존 기능 유지**
   - 메인 페이지는 사용자가 가장 먼저 보는 페이지
   - 어떤 기능도 깨지지 않도록 주의

2. **타입 정확성**
   - 실제 API 응답과 일치하는 타입 사용
   - 필요시 API 문서 확인

3. **성능**
   - 불필요한 리렌더링 방지
   - 데이터 fetch 최적화 유지

---

## 🚀 작업 시작

Phase 2.3 완료 후 이 작업을 시작하세요.
