# Phase 6 작업 계획서

**프로젝트**: 국내 여행 플랫폼 - 여정 관리 기능 향상
**작업 일시**: 2025-11-06
**PO**: Product Owner
**대상 팀**: Frontend Development Team, Backend Development Team

---

## 📋 작업 개요

Phase 6에서는 여행 일정(Itinerary) 관리의 사용자 경험을 대폭 개선합니다:

### 핵심 기능
1. **드래그 앤 드롭 기능** - 장소 순서를 직관적으로 변경
2. **지도 경로 표시** - 하루 일정의 장소들을 지도에 표시하고 경로 시각화
3. **거리/시간 예상** - 장소 간 이동 거리 및 소요 시간 자동 계산

### 목표
- 사용자가 일정을 쉽게 조정할 수 있도록 UX 개선
- 실제 여행 계획에 도움이 되는 정보 제공
- 시각적으로 아름답고 직관적인 인터페이스

---

## 🎯 각 팀별 작업 지시

### PO (Product Owner) - 작업 계획 수립

**책임자**: Product Owner

**작업 내용**:
1. ✅ Phase 6 작업 범위 정의
2. ✅ 우선순위 설정: 드래그 앤 드롭 → 지도 경로 → 거리/시간
3. ✅ 각 팀별 작업 배분
4. ✅ 작업 계획서 작성 (이 문서)
5. ⏳ 진행 상황 모니터링
6. ⏳ 최종 검수 및 승인

**산출물**:
- Phase 6 작업 계획서
- Todo 리스트
- 팀별 작업 지시서

---

### Backend Developer - API 지원 확인

**책임자**: Backend Development Team

**작업 내용**:

#### 1. 장소 순서 변경 API 확인
**목적**: 드래그 앤 드롭으로 장소 순서를 변경할 때 사용

**예상 API**:
```
PATCH /api/itinerary/days/:dayId/places/reorder
Body: {
  placeIds: ['place-1', 'place-3', 'place-2']  // 새로운 순서
}
```

**확인 사항**:
- API가 이미 구현되어 있는지 확인
- 없다면 프론트엔드에서 각 장소의 orderIndex를 개별적으로 업데이트하는 방식 사용
- 트랜잭션 처리 필요 여부

#### 2. 거리/시간 계산 API 검토
**목적**: 장소 간 이동 거리 및 시간 계산

**옵션 A - 백엔드에서 계산**:
```
POST /api/itinerary/calculate-route
Body: {
  places: [
    { lat: 37.5665, lng: 126.9780 },
    { lat: 37.5700, lng: 126.9800 }
  ]
}
Response: {
  totalDistance: 1500,  // 미터
  totalDuration: 20,    // 분
  segments: [
    { from: 0, to: 1, distance: 1500, duration: 20 }
  ]
}
```

**옵션 B - 프론트엔드에서 계산** (추천):
- Kakao Map API의 거리 계산 기능 사용
- 클라이언트 사이드에서 실시간 계산
- 백엔드 부하 감소

**결정**:
- [ ] 옵션 A: 백엔드 API 구현
- [x] 옵션 B: 프론트엔드 계산 (Kakao Map API)

#### 3. Place 타입 좌표 필드 확인
**확인 사항**:
- ItineraryPlace의 place 객체에 latitude, longitude 필드 포함 여부
- 모든 장소에 좌표 데이터가 있는지 확인
- 좌표 없는 장소 처리 방법

**현재 타입** (frontend/src/types/itinerary.ts):
```typescript
export interface ItineraryPlace {
  id: string;
  dayId: string;
  placeId: string;
  place?: {
    id: string;
    name: string;
    address: string;
    category: string;
    latitude?: number;    // ✅ 있음
    longitude?: number;   // ✅ 있음
  };
  orderIndex: number;
  memo?: string;
  visitTime?: string;
}
```

**작업**:
- [x] 타입 확인 완료 - latitude, longitude 필드 존재
- [ ] 백엔드 API 응답에 좌표 데이터 포함 확인
- [ ] 좌표 없는 장소 대체 로직 (주소로 geocoding)

**산출물**:
- API 확인 보고서
- 필요시 새 API 엔드포인트 구현
- API 문서 업데이트

---

### Frontend Developer - UI/UX 구현

**책임자**: Frontend Development Team

**작업 우선순위**: 1 → 2 → 3 → 4

---

#### 작업 1: 드래그 앤 드롭 라이브러리 설치

**라이브러리**: `@dnd-kit/core`, `@dnd-kit/sortable`

**선택 이유**:
- React 18+ 최적화
- TypeScript 완벽 지원
- 접근성 (a11y) 내장
- 가볍고 성능 우수
- React Hook 기반 API

**설치 명령어**:
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**예상 패키지**:
- `@dnd-kit/core` - 핵심 드래그 앤 드롭 기능
- `@dnd-kit/sortable` - 리스트 정렬 기능
- `@dnd-kit/utilities` - 유틸리티 함수

**대안** (참고):
- `react-beautiful-dnd` (Atlassian, 인기 있으나 업데이트 중단)
- `react-dnd` (오래되고 복잡)

**작업**:
- [ ] npm install 실행
- [ ] 설치 성공 확인
- [ ] TypeScript 타입 정의 확인

---

#### 작업 2: 드래그 앤 드롭 장소 순서 변경 컴포넌트

**파일**: `/src/components/itinerary/DraggablePlaceList.tsx`

**기능 요구사항**:
1. 장소 목록을 드래그 앤 드롭으로 순서 변경
2. 드래그 중 시각적 피드백 (그림자, 투명도)
3. 드롭 시 순서 즉시 반영
4. API 호출하여 순서 저장
5. 에러 처리 (롤백)

**Props**:
```typescript
interface DraggablePlaceListProps {
  places: ItineraryPlace[];
  dayId: string;
  onReorder: (newPlaces: ItineraryPlace[]) => void;
  onUpdate: (placeId: string, data: Partial<ItineraryPlace>) => void;
  onDelete: (placeId: string) => void;
  isEditable: boolean;
}
```

**UI 구성**:
```tsx
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={places} strategy={verticalListSortingStrategy}>
    {places.map((place, index) => (
      <SortablePlace
        key={place.id}
        place={place}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ))}
  </SortableContext>
</DndContext>
```

**드래그 핸들**:
- 6개 점(::) 아이콘
- 호버 시 커서 변경
- 모바일 터치 지원

**시각적 효과**:
- 드래그 중: opacity 0.5, shadow-lg
- 드롭 가능 영역: border-primary-500
- 드래그 핸들: hover:bg-gray-100

**구현 예시**:
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (active.id !== over?.id) {
    const oldIndex = places.findIndex((p) => p.id === active.id);
    const newIndex = places.findIndex((p) => p.id === over.id);

    const newPlaces = arrayMove(places, oldIndex, newIndex);

    // UI 즉시 업데이트
    onReorder(newPlaces);

    // 백엔드 동기화
    updatePlaceOrder(dayId, newPlaces.map(p => p.id))
      .catch(() => {
        // 에러 시 롤백
        onReorder(places);
        toast.error('순서 변경에 실패했습니다');
      });
  }
};
```

**작업**:
- [ ] DraggablePlaceList 컴포넌트 생성
- [ ] SortablePlace 아이템 컴포넌트 생성
- [ ] 드래그 핸들 UI 구현
- [ ] 순서 변경 로직 구현
- [ ] 에러 처리 (롤백)

---

#### 작업 3: 카카오맵 다중 마커 및 경로 표시

**파일**: `/src/components/itinerary/ItineraryMap.tsx`

**기능 요구사항**:
1. 여러 장소를 마커로 표시 (번호 표시)
2. 장소 간 경로를 선으로 연결 (Polyline)
3. 마커 클릭 시 장소 정보 표시
4. 지도 자동 중심/줌 조정 (모든 마커가 보이도록)
5. 순서 변경 시 마커 및 경로 자동 업데이트

**Props**:
```typescript
interface ItineraryMapProps {
  places: ItineraryPlace[];
  selectedPlaceId?: string;
  onPlaceClick?: (placeId: string) => void;
  height?: string;
}
```

**마커 표시**:
```typescript
places.forEach((place, index) => {
  if (place.place?.latitude && place.place?.longitude) {
    const position = new kakao.maps.LatLng(
      place.place.latitude,
      place.place.longitude
    );

    // 번호가 표시된 마커 (커스텀 오버레이)
    const marker = new kakao.maps.Marker({
      position,
      map,
      title: place.place.name,
    });

    // 커스텀 마커 번호
    const content = `
      <div class="custom-marker">
        <div class="marker-number">${index + 1}</div>
      </div>
    `;

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1,
    });
    overlay.setMap(map);
  }
});
```

**경로 표시** (Polyline):
```typescript
const path = places
  .filter(p => p.place?.latitude && p.place?.longitude)
  .map(p => new kakao.maps.LatLng(
    p.place!.latitude!,
    p.place!.longitude!
  ));

const polyline = new kakao.maps.Polyline({
  path,
  strokeWeight: 5,
  strokeColor: '#FF6B6B',
  strokeOpacity: 0.7,
  strokeStyle: 'solid',
});

polyline.setMap(map);
```

**지도 범위 자동 조정**:
```typescript
const bounds = new kakao.maps.LatLngBounds();

places.forEach(place => {
  if (place.place?.latitude && place.place?.longitude) {
    bounds.extend(new kakao.maps.LatLng(
      place.place.latitude,
      place.place.longitude
    ));
  }
});

map.setBounds(bounds);
```

**마커 스타일** (CSS):
```css
.custom-marker {
  position: relative;
}

.marker-number {
  width: 30px;
  height: 30px;
  background: #FF6B6B;
  color: white;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}
```

**작업**:
- [ ] ItineraryMap 컴포넌트 생성
- [ ] 다중 마커 표시 구현
- [ ] 커스텀 마커 (번호) 디자인
- [ ] Polyline 경로 표시 구현
- [ ] 지도 자동 범위 조정
- [ ] 마커 클릭 이벤트

---

#### 작업 4: 거리/시간 계산 및 표시

**파일**: `/src/lib/utils/mapUtils.ts`

**기능 요구사항**:
1. 두 좌표 간 직선 거리 계산 (Haversine formula)
2. 전체 경로 총 거리 계산
3. 예상 이동 시간 계산 (거리 기반)
4. UI에 거리/시간 표시

**거리 계산 함수**:
```typescript
/**
 * Haversine 공식으로 두 좌표 간 거리 계산 (미터)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터
}
```

**총 거리 계산**:
```typescript
export function calculateTotalDistance(places: ItineraryPlace[]): number {
  let total = 0;

  for (let i = 0; i < places.length - 1; i++) {
    const place1 = places[i].place;
    const place2 = places[i + 1].place;

    if (
      place1?.latitude &&
      place1?.longitude &&
      place2?.latitude &&
      place2?.longitude
    ) {
      total += calculateDistance(
        place1.latitude,
        place1.longitude,
        place2.latitude,
        place2.longitude
      );
    }
  }

  return total;
}
```

**이동 시간 추정**:
```typescript
export function estimateTravelTime(distanceInMeters: number): number {
  // 도보: 4km/h = 67m/min
  // 차량: 40km/h = 667m/min (도심 평균)
  // 평균 속도: 30km/h = 500m/min
  const speedMetersPerMinute = 500;
  return Math.ceil(distanceInMeters / speedMetersPerMinute);
}
```

**거리 포맷팅**:
```typescript
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
```

**시간 포맷팅**:
```typescript
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}
```

**UI 표시 컴포넌트**:
```tsx
function PlaceRouteInfo({ fromPlace, toPlace }: Props) {
  if (!fromPlace.place || !toPlace.place) return null;

  const distance = calculateDistance(
    fromPlace.place.latitude!,
    fromPlace.place.longitude!,
    toPlace.place.latitude!,
    toPlace.place.longitude!
  );

  const duration = estimateTravelTime(distance);

  return (
    <div className="flex items-center gap-3 py-2 px-4 bg-gray-50 rounded-lg text-sm">
      <svg className="w-4 h-4 text-gray-500">...</svg>
      <span className="text-gray-700">
        {formatDistance(distance)} • {formatDuration(duration)}
      </span>
    </div>
  );
}
```

**장소 목록에 통합**:
```tsx
{places.map((place, index) => (
  <div key={place.id}>
    <PlaceCard place={place} index={index} />

    {index < places.length - 1 && (
      <PlaceRouteInfo
        fromPlace={place}
        toPlace={places[index + 1]}
      />
    )}
  </div>
))}

{/* 총 거리/시간 */}
<div className="mt-4 p-4 bg-primary-50 rounded-lg">
  <div className="flex justify-between text-sm">
    <span className="text-gray-700">총 이동 거리</span>
    <span className="font-semibold">
      {formatDistance(calculateTotalDistance(places))}
    </span>
  </div>
  <div className="flex justify-between text-sm mt-2">
    <span className="text-gray-700">예상 이동 시간</span>
    <span className="font-semibold">
      {formatDuration(estimateTravelTime(calculateTotalDistance(places)))}
    </span>
  </div>
</div>
```

**작업**:
- [ ] mapUtils.ts 유틸리티 함수 작성
- [ ] 거리 계산 (Haversine)
- [ ] 시간 추정 함수
- [ ] 포맷팅 함수
- [ ] PlaceRouteInfo 컴포넌트
- [ ] 총 거리/시간 표시 UI

---

#### 작업 5: 일정 수정 페이지에 모든 기능 통합

**파일**: `/src/app/(main)/itinerary/[id]/edit/page.tsx`

**통합 작업**:
1. DraggablePlaceList 컴포넌트 import 및 사용
2. ItineraryMap 컴포넌트 추가
3. 거리/시간 표시 통합
4. 레이아웃 조정 (2단 레이아웃)

**레이아웃 구조**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* 왼쪽: 장소 목록 (드래그 앤 드롭) */}
  <div className="lg:col-span-2">
    <div className="bg-white rounded-lg p-6">
      <h3>Day {selectedDay} 일정</h3>
      <DraggablePlaceList
        places={selectedDayPlaces}
        dayId={selectedDayId}
        onReorder={handleReorder}
        onUpdate={handleUpdatePlace}
        onDelete={handleDeletePlace}
        isEditable={true}
      />
    </div>
  </div>

  {/* 오른쪽: 지도 + 요약 */}
  <div className="lg:col-span-1">
    {/* 지도 */}
    <div className="bg-white rounded-lg p-4 mb-4 sticky top-4">
      <ItineraryMap
        places={selectedDayPlaces}
        height="400px"
      />
    </div>

    {/* 요약 정보 */}
    <div className="bg-white rounded-lg p-4">
      <h4 className="font-semibold mb-3">일정 요약</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>장소 수</span>
          <span className="font-semibold">
            {selectedDayPlaces.length}곳
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>총 이동 거리</span>
          <span className="font-semibold">
            {formatDistance(calculateTotalDistance(selectedDayPlaces))}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>예상 이동 시간</span>
          <span className="font-semibold">
            {formatDuration(estimateTravelTime(...))}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**상태 관리**:
```typescript
const [selectedDay, setSelectedDay] = useState(1);
const [days, setDays] = useState<ItineraryDay[]>([]);

const selectedDayData = days.find(d => d.dayNumber === selectedDay);
const selectedDayPlaces = selectedDayData?.places || [];

const handleReorder = (newPlaces: ItineraryPlace[]) => {
  // 상태 업데이트
  setDays(days.map(day =>
    day.dayNumber === selectedDay
      ? { ...day, places: newPlaces }
      : day
  ));
};

const handleUpdatePlace = async (placeId: string, data: Partial<ItineraryPlace>) => {
  try {
    await updateItineraryPlace(placeId, data);
    // 상태 새로고침
    fetchItinerary();
  } catch (error) {
    toast.error('장소 수정에 실패했습니다');
  }
};
```

**작업**:
- [ ] edit/page.tsx에 컴포넌트 통합
- [ ] 2단 레이아웃 구현
- [ ] 상태 관리 로직 추가
- [ ] 에러 처리
- [ ] 로딩 상태 처리

---

## 📊 작업 순서 및 일정

### Day 1: 준비 및 드래그 앤 드롭
1. ✅ PO: 작업 계획 수립
2. ⏳ Backend: API 확인
3. ⏳ Frontend: dnd-kit 설치
4. ⏳ Frontend: DraggablePlaceList 컴포넌트 구현

### Day 2: 지도 기능
5. ⏳ Frontend: ItineraryMap 컴포넌트 구현
6. ⏳ Frontend: 다중 마커 표시
7. ⏳ Frontend: 경로 Polyline 표시

### Day 3: 거리/시간 및 통합
8. ⏳ Frontend: mapUtils 유틸리티 작성
9. ⏳ Frontend: 거리/시간 UI 구현
10. ⏳ Frontend: edit/page.tsx에 모든 기능 통합

### Day 4: 테스트 및 문서화
11. ⏳ QA: 전체 기능 테스트
12. ⏳ Frontend: 버그 수정
13. ⏳ PO: 문서화 (PHASE6_COMPLETION_REPORT.md)

---

## 🎯 기대 효과

### 사용자 경험 개선
- **직관적인 조작**: 드래그 앤 드롭으로 순서 변경
- **시각적 피드백**: 지도에서 경로 확인
- **실용적 정보**: 거리/시간 예상으로 계획 수립 용이

### 기술적 향상
- **현대적인 UX 패턴**: dnd-kit을 활용한 드래그 앤 드롭
- **지도 활용**: Kakao Map API의 고급 기능 사용
- **성능 최적화**: 클라이언트 사이드 계산으로 빠른 응답

---

## 🔍 주의 사항

### 에러 처리
- 드래그 앤 드롭 실패 시 롤백
- 좌표 없는 장소 처리 (지도에서 제외)
- API 호출 실패 시 사용자 알림

### 성능
- 장소가 많을 때 (10개 이상) 지도 렌더링 최적화
- 드래그 중 불필요한 리렌더링 방지
- 거리 계산 결과 메모이제이션

### 접근성
- 키보드로도 순서 변경 가능 (dnd-kit 기본 지원)
- 스크린 리더 지원
- 터치 디바이스 지원

---

## 📚 참고 자료

### 라이브러리 문서
- [dnd-kit 공식 문서](https://docs.dndkit.com/)
- [dnd-kit Sortable 예제](https://docs.dndkit.com/presets/sortable)
- [Kakao Map API - Polyline](https://apis.map.kakao.com/web/documentation/#Polyline)
- [Kakao Map API - CustomOverlay](https://apis.map.kakao.com/web/documentation/#CustomOverlay)

### 알고리즘
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

### 디자인 참고
- Airbnb 여행 일정
- Google Maps 경로 표시
- Trello 드래그 앤 드롭

---

**작성일**: 2025-11-06
**작성자**: Product Owner
**상태**: 작업 진행 중
**다음 검토**: 각 작업 완료 시
