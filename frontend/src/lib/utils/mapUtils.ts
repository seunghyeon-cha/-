import { ItineraryPlace } from '@/types/itinerary';

/**
 * Haversine 공식으로 두 좌표 간 직선 거리 계산
 * @param lat1 출발지 위도
 * @param lng1 출발지 경도
 * @param lat2 도착지 위도
 * @param lng2 도착지 경도
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

/**
 * 여러 장소의 총 이동 거리 계산
 * @param places 장소 배열 (순서대로)
 * @returns 총 거리 (미터)
 */
export function calculateTotalDistance(places: ItineraryPlace[]): number {
  let total = 0;

  for (let i = 0; i < places.length - 1; i++) {
    const place1 = places[i].place;
    const place2 = places[i + 1].place;

    if (
      place1?.latitude != null &&
      place1?.longitude != null &&
      place2?.latitude != null &&
      place2?.longitude != null
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

/**
 * 거리 기반 이동 시간 추정
 * @param distanceInMeters 거리 (미터)
 * @param mode 이동 수단 ('walk' | 'car' | 'transit')
 * @returns 예상 시간 (분)
 */
export function estimateTravelTime(
  distanceInMeters: number,
  mode: 'walk' | 'car' | 'transit' = 'car'
): number {
  // 평균 속도 (m/min)
  const speeds = {
    walk: 67, // 4km/h
    car: 500, // 30km/h (도심 평균)
    transit: 333, // 20km/h
  };

  const speedMetersPerMinute = speeds[mode];
  return Math.ceil(distanceInMeters / speedMetersPerMinute);
}

/**
 * 거리 포맷팅 (미터 → km 또는 m)
 * @param meters 거리 (미터)
 * @returns 포맷된 문자열 (예: "1.5km", "250m")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * 시간 포맷팅 (분 → 시간/분)
 * @param minutes 시간 (분)
 * @returns 포맷된 문자열 (예: "1시간 30분", "45분")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
}

/**
 * 장소 배열에서 좌표가 있는 장소만 필터링
 * @param places 장소 배열
 * @returns 좌표가 있는 장소 배열
 */
export function filterPlacesWithCoords(
  places: ItineraryPlace[]
): ItineraryPlace[] {
  return places.filter(
    (p) =>
      p.place?.latitude != null && p.place?.longitude != null
  );
}

/**
 * 두 장소 간 거리와 시간 계산
 * @param from 출발 장소
 * @param to 도착 장소
 * @param mode 이동 수단
 * @returns 거리(m)와 시간(분) 또는 null
 */
export function calculateRoute(
  from: ItineraryPlace,
  to: ItineraryPlace,
  mode: 'walk' | 'car' | 'transit' = 'car'
): { distance: number; duration: number } | null {
  if (
    !from.place?.latitude ||
    !from.place?.longitude ||
    !to.place?.latitude ||
    !to.place?.longitude
  ) {
    return null;
  }

  const distance = calculateDistance(
    from.place.latitude,
    from.place.longitude,
    to.place.latitude,
    to.place.longitude
  );

  const duration = estimateTravelTime(distance, mode);

  return { distance, duration };
}

/**
 * 전체 경로 요약 정보 계산
 * @param places 장소 배열
 * @param mode 이동 수단
 * @returns 총 거리, 총 시간, 구간별 정보
 */
export function calculateRouteSummary(
  places: ItineraryPlace[],
  mode: 'walk' | 'car' | 'transit' = 'car'
) {
  const placesWithCoords = filterPlacesWithCoords(places);

  if (placesWithCoords.length < 2) {
    return {
      totalDistance: 0,
      totalDuration: 0,
      segments: [],
      placeCount: placesWithCoords.length,
    };
  }

  const segments = [];
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < placesWithCoords.length - 1; i++) {
    const route = calculateRoute(placesWithCoords[i], placesWithCoords[i + 1], mode);
    if (route) {
      segments.push({
        from: i,
        to: i + 1,
        fromPlace: placesWithCoords[i].place!.name,
        toPlace: placesWithCoords[i + 1].place!.name,
        distance: route.distance,
        duration: route.duration,
      });
      totalDistance += route.distance;
      totalDuration += route.duration;
    }
  }

  return {
    totalDistance,
    totalDuration,
    segments,
    placeCount: placesWithCoords.length,
  };
}
