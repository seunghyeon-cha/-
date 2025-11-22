'use client';

import { useEffect, useRef, useState } from 'react';
import { ItineraryPlace } from '@/types/itinerary';
import { filterPlacesWithCoords } from '@/lib/utils/mapUtils';

// Kakao Maps 타입은 src/types/kakao.d.ts에서 전역으로 정의됨

interface ItineraryMapProps {
  places: ItineraryPlace[];
  selectedPlaceId?: string;
  onPlaceClick?: (placeId: string) => void;
  height?: string;
  showRoute?: boolean;
}

export default function ItineraryMap({
  places,
  selectedPlaceId,
  onPlaceClick,
  height = '500px',
  showRoute = true,
}: ItineraryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoCustomOverlay[]>([]);
  const polylineRef = useRef<KakaoPolyline | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 카카오맵 로드 확인
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao!.maps!) {
        window.kakao!.maps!.load(() => {
          setIsMapLoaded(true);
        });
      } else {
        // 카카오맵이 로드되지 않은 경우 재시도
        setTimeout(checkKakaoMap, 100);
      }
    };

    checkKakaoMap();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao!.maps!) return;

    const placesWithCoords = filterPlacesWithCoords(places);

    if (placesWithCoords.length === 0) return;

    // 지도 생성
    const firstPlace = placesWithCoords[0].place!;
    const initialPosition = new window.kakao!.maps!.LatLng(
      firstPlace.latitude || 37.5665,
      firstPlace.longitude || 126.9780
    );

    const mapOptions = {
      center: initialPosition,
      level: 7,
    };

    const map = new window.kakao!.maps!.Map(mapContainer.current, mapOptions);
    mapInstance.current = map;

    // 지도 컨트롤 추가
    const zoomControl = new window.kakao!.maps!.ZoomControl();
    map.addControl(zoomControl, window.kakao!.maps!.ControlPosition.RIGHT);

    return () => {
      // 클린업
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [isMapLoaded, places]);

  // 마커 및 경로 업데이트
  useEffect(() => {
    if (!mapInstance.current || !window.kakao!.maps!) return;

    const map = mapInstance.current;
    const placesWithCoords = filterPlacesWithCoords(places);

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 기존 polyline 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (placesWithCoords.length === 0) return;

    const bounds = new window.kakao!.maps!.LatLngBounds();
    const positions: KakaoLatLng[] = [];

    // 마커 생성
    placesWithCoords.forEach((place, index) => {
      const position = new window.kakao!.maps!.LatLng(
        place.place!.latitude!,
        place.place!.longitude!
      );

      positions.push(position);
      bounds.extend(position);

      // 커스텀 오버레이 (번호 마커)
      const content = `
        <div style="position: relative; cursor: pointer;">
          <div style="
            width: 36px;
            height: 36px;
            background: ${selectedPlaceId === place.id ? '#E53E3E' : '#3B82F6'};
            color: white;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            ${index + 1}
          </div>
        </div>
      `;

      const customOverlay = new window.kakao!.maps!.CustomOverlay({
        position,
        content,
        yAnchor: 0.5,
      });

      customOverlay.setMap(map);
      markersRef.current.push(customOverlay);

      // 클릭 이벤트 (InfoWindow 표시)
      const infowindow = new window.kakao!.maps!.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 150px;">
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${place.place!.name}
            </div>
            ${place.visitTime ? `<div style="font-size: 12px; color: #666;">⏰ ${place.visitTime}</div>` : ''}
            ${place.memo ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">📝 ${place.memo}</div>` : ''}
          </div>
        `,
        removable: true,
      });

      // 마커 클릭 이벤트
      window.kakao!.maps!.event.addListener(
        customOverlay.a,
        'click',
        function () {
          infowindow.open(map, position);
          if (onPlaceClick) {
            onPlaceClick(place.id);
          }
        }
      );
    });

    // 경로 선 (Polyline) 생성
    if (showRoute && positions.length > 1) {
      const polyline = new window.kakao!.maps!.Polyline({
        path: positions,
        strokeWeight: 5,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
      polylineRef.current = polyline;
    }

    // 지도 범위 조정 (모든 마커가 보이도록)
    if (placesWithCoords.length === 1) {
      map.setCenter(positions[0]);
      map.setLevel(3);
    } else {
      map.setBounds(bounds);
    }
  }, [places, selectedPlaceId, showRoute, onPlaceClick]);

  const placesWithCoords = filterPlacesWithCoords(places);

  if (!isMapLoaded) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">지도 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (placesWithCoords.length === 0) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-sm font-medium text-gray-900">
            좌표 정보가 있는 장소가 없습니다
          </p>
          <p className="text-xs text-gray-500 mt-1">
            장소에 위도/경도 정보가 필요합니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        style={{ height }}
        className="rounded-lg overflow-hidden shadow-md"
      />

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          <span className="text-gray-700">장소 순서</span>
        </div>
        {showRoute && placesWithCoords.length > 1 && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-primary-500 rounded"></div>
            <span className="text-gray-700">이동 경로</span>
          </div>
        )}
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
          총 {placesWithCoords.length}곳
        </div>
      </div>
    </div>
  );
}
