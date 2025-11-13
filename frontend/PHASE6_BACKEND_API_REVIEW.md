# Phase 6 Backend API 검토 보고서

**작성일**: 2025-11-06
**담당**: Backend Development Team
**검토자**: Backend Developer

---

## 📋 검토 내용

### 1. 장소 순서 변경 API

**요구사항**: 드래그 앤 드롭으로 장소 순서를 변경할 때 사용할 API

#### 검토 결과

**현재 상태**: ❌ 장소 순서 변경 전용 API 없음

**확인된 API**:
```typescript
// src/lib/api/itinerary.ts
export const getItineraries = async () => {...}
export const getItineraryById = async (id: string) => {...}
export const createItinerary = async (data: CreateItineraryDto) => {...}
export const updateItinerary = async (id: string, data: UpdateItineraryDto) => {...}
export const deleteItinerary = async (id: string) => {...}
```

**필요한 API** (이상적):
```typescript
// 옵션 A: 일괄 순서 변경
PATCH /api/itinerary/days/:dayId/places/reorder
Body: {
  placeIds: ['place-1-id', 'place-3-id', 'place-2-id']  // 새로운 순서
}

// 옵션 B: 개별 장소 순서 변경
PATCH /api/itinerary/places/:placeId
Body: {
  orderIndex: 2
}
```

#### 해결 방안

**선택한 방법**: **프론트엔드에서 전체 일정 업데이트**

**이유**:
1. 백엔드 API 수정 불필요 (Phase 6 빠른 진행 가능)
2. 기존 `updateItinerary` API 활용
3. 일정 데이터 일관성 유지

**구현 방법**:
```typescript
// 드래그 앤 드롭 후
const handleReorder = async (dayId: string, newPlaces: ItineraryPlace[]) => {
  // 1. 로컬 state 즉시 업데이트 (UI 반응성)
  updateLocalState(newPlaces);

  // 2. orderIndex 재계산
  const updatedPlaces = newPlaces.map((place, index) => ({
    ...place,
    orderIndex: index,
  }));

  // 3. 전체 일정 업데이트 (기존 API 사용)
  try {
    await updateItinerary(itineraryId, {
      days: itinerary.days.map(day =>
        day.id === dayId
          ? { ...day, places: updatedPlaces }
          : day
      ),
    });
    toast.success('순서가 변경되었습니다');
  } catch (error) {
    // 롤백
    revertLocalState();
    toast.error('순서 변경에 실패했습니다');
  }
};
```

**장점**:
- 즉시 구현 가능
- 백엔드 변경 불필요
- 데이터 일관성 보장

**단점**:
- 전체 일정 데이터 전송 (약간의 오버헤드)
- 동시 편집 시 충돌 가능성

**향후 개선**:
- 백엔드에 장소 순서 변경 전용 API 추가
- WebSocket을 통한 실시간 동기화

---

### 2. 거리/시간 계산 API

**요구사항**: 장소 간 이동 거리 및 시간 계산

#### 검토 결과

**결정**: ✅ **프론트엔드에서 계산** (백엔드 API 불필요)

**선택 이유**:

1. **Kakao Map API 활용 가능**
   - 카카오맵 JavaScript API에 거리 계산 기능 있음
   - 추가 백엔드 작업 불필요

2. **실시간 계산**
   - 사용자가 장소 순서 변경 시 즉시 업데이트
   - API 호출 지연 없음

3. **백엔드 부하 감소**
   - 계산 작업을 클라이언트에 분산
   - 서버 리소스 절약

**구현 방법**:

#### 옵션 A: Haversine Formula (직선 거리)
```typescript
/**
 * Haversine 공식으로 두 좌표 간 직선 거리 계산
 * @returns 거리 (미터)
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

**장점**:
- 간단하고 빠름
- API 호출 불필요
- 오프라인에서도 작동

**단점**:
- 직선 거리 (실제 도로 거리 아님)
- 산, 강 등 지형 미고려

#### 옵션 B: Kakao Map Directions API (추천)
```typescript
// Kakao REST API 사용
async function calculateRoadDistance(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number }> {
  const response = await fetch(
    `https://apis-navi.kakaomobility.com/v1/directions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: { x: origin.lng, y: origin.lat },
        destination: { x: destination.lng, y: destination.lat },
      }),
    }
  );

  const data = await response.json();
  return {
    distance: data.routes[0].summary.distance, // 미터
    duration: data.routes[0].summary.duration, // 초
  };
}
```

**장점**:
- 실제 도로 거리
- 정확한 이동 시간
- 카카오 공식 데이터

**단점**:
- API 키 필요 (Kakao REST API)
- API 호출 비용 (무료 한도 있음)
- 네트워크 필요

#### 선택한 방법: **옵션 A (Haversine) 우선 구현**

**이유**:
1. Phase 6의 빠른 완성
2. API 키 설정 불필요
3. 직선 거리도 충분히 유용 (대략적 예상)
4. 향후 옵션 B로 업그레이드 가능

**이동 시간 추정**:
```typescript
export function estimateTravelTime(distanceInMeters: number): number {
  // 평균 이동 속도: 30km/h (도심 기준)
  // = 500m/min
  const speedMetersPerMinute = 500;
  return Math.ceil(distanceInMeters / speedMetersPerMinute);
}
```

**참고**: 실제 이동 시간은 교통 상황, 도로 조건 등에 따라 달라질 수 있음을 UI에 표시

---

### 3. Place 좌표 데이터 확인

**요구사항**: 모든 장소에 latitude, longitude 필드 필요

#### 검토 결과

**타입 정의**: ✅ 좌표 필드 존재
```typescript
// src/types/itinerary.ts
export interface ItineraryPlace {
  id: string;
  dayId: string;
  placeId: string;
  place?: {
    id: string;
    name: string;
    address: string;
    category: string;
    latitude?: number;    // ✅ 있음 (optional)
    longitude?: number;   // ✅ 있음 (optional)
  };
  orderIndex: number;
  memo?: string;
  visitTime?: string;
}
```

**문제점**: ❗ **optional 필드** (없을 수 있음)

**영향**:
- 좌표 없는 장소는 지도에 표시 불가
- 거리 계산 불가

**해결 방안**:

#### 1. 프론트엔드에서 필터링
```typescript
const placesWithCoords = places.filter(
  (p) => p.place?.latitude && p.place?.longitude
);

// 지도에는 좌표 있는 장소만 표시
<ItineraryMap places={placesWithCoords} />

// 거리 계산도 좌표 있는 장소만
const totalDistance = calculateTotalDistance(placesWithCoords);
```

#### 2. 좌표 없는 장소 UI 표시
```tsx
{!place.place?.latitude && (
  <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
    ⚠️ 좌표 정보 없음 (지도 표시 불가)
  </div>
)}
```

#### 3. 주소로 Geocoding (향후)
```typescript
// Kakao Map Geocoding API 사용
async function getCoordinates(address: string) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
    {
      headers: {
        'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  if (data.documents.length > 0) {
    return {
      latitude: parseFloat(data.documents[0].y),
      longitude: parseFloat(data.documents[0].x),
    };
  }
  return null;
}
```

**선택**: **옵션 1 + 옵션 2** (필터링 + UI 표시)

---

## 📊 검토 결과 요약

| 항목 | 상태 | 해결 방안 |
|------|------|-----------|
| 장소 순서 변경 API | ❌ 없음 | 프론트엔드에서 전체 일정 업데이트 |
| 거리/시간 계산 API | ✅ 불필요 | 프론트엔드 Haversine 계산 |
| 좌표 필드 존재 | ✅ 있음 | optional이므로 필터링 필요 |

---

## 🎯 Frontend 팀에 전달 사항

### 1. 장소 순서 변경
- 기존 `updateItinerary(id, data)` API 사용
- 전체 days 배열 포함하여 업데이트
- 낙관적 업데이트(Optimistic Update) 권장

### 2. 거리/시간 계산
- `/src/lib/utils/mapUtils.ts` 파일 생성
- Haversine formula 구현
- 이동 시간 추정 함수 구현
- UI에 "예상" 표시 필요

### 3. 좌표 데이터 처리
- `place.latitude`, `place.longitude` 존재 여부 확인
- 없는 경우 지도 표시에서 제외
- 사용자에게 경고 표시

### 4. 타입 정의
- 기존 타입 그대로 사용 가능
- 추가 타입 정의 불필요

---

## 💡 향후 개선 방안

### 단기 (1-2주 내)
1. ✅ Haversine 거리 계산 구현
2. ✅ 드래그 앤 드롭 기본 기능

### 중기 (1개월 내)
1. 장소 순서 변경 전용 API 구현
2. Kakao Directions API 연동 (실제 도로 거리)
3. 주소 Geocoding 자동화

### 장기 (3개월 내)
1. WebSocket 실시간 동기화
2. 교통 정보 반영 (실시간 소요 시간)
3. 대중교통 경로 옵션

---

## 📚 참고 자료

### API 문서
- [Kakao Mobility Directions API](https://developers.kakaomobility.com/docs/navi-api/directions/)
- [Kakao Local - 주소 검색](https://developers.kakao.com/docs/latest/ko/local/dev-guide#address-coord)

### 알고리즘
- [Haversine Formula - Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula)
- [Haversine Calculator](https://www.movable-type.co.uk/scripts/latlong.html)

### 구현 예제
- [dnd-kit with API update](https://docs.dndkit.com/api-documentation/sensors)
- [Optimistic Updates in React](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

---

**검토 완료일**: 2025-11-06
**Backend Developer**: ✅ 검토 완료
**Frontend Team**: 구현 진행 가능
**상태**: Backend API 추가 작업 불필요, Frontend 단독 구현 가능
