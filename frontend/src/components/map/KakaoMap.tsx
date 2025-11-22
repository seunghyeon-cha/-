'use client';

import { useEffect, useRef } from 'react';

export interface Place {
  id?: number | string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface KakaoMapProps {
  lat: number;
  lng: number;
  name?: string;
  places?: Place[]; // 다중 마커를 위한 장소 목록
  zoom?: number; // 지도 줌 레벨 (기본: 3)
}

// Kakao Maps 타입은 src/types/kakao.d.ts에서 전역으로 정의됨

export default function KakaoMap({ lat, lng, name, places, zoom = 3 }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('=== Kakao Map Component Debug ===');
    console.log('window.kakao:', window.kakao);
    console.log('window.kakao?.maps:', window.kakao!.maps!);
    console.log('API Key:', process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ? '설정됨' : '미설정');
    console.log('Coordinates:', { lat, lng });
    console.log('Places count:', places?.length || 0);

    // Kakao Map Script 로드
    const loadKakaoMap = () => {
      if (!window.kakao!.maps!) {
        console.error('❌ Kakao Map API not loaded yet');
        return;
      }

      console.log('✅ Starting to initialize Kakao Map...');

      if (!mapContainer.current) return;

      // 지도 옵션
      const options = {
        center: new window.kakao!.maps!.LatLng(lat, lng),
        level: zoom,
      };

      // 지도 생성
      const map = new window.kakao!.maps!.Map(mapContainer.current, options);

      // 다중 마커 표시 (places가 있을 경우)
      if (places && places.length > 0) {
        const bounds = new window.kakao!.maps!.LatLngBounds();

        places.forEach((place) => {
          // 유효한 좌표인지 확인
          if (!place.latitude || !place.longitude || place.latitude === 0 || place.longitude === 0) {
            return;
          }

          const markerPosition = new window.kakao!.maps!.LatLng(place.latitude, place.longitude);
          const marker = new window.kakao!.maps!.Marker({
            position: markerPosition,
            title: place.name,
          });
          marker.setMap(map);

          // 지도 범위에 추가
          bounds.extend(markerPosition);

          // 마커 클릭 이벤트
          const infowindow = new window.kakao!.maps!.InfoWindow({
            content: `
              <div style="padding:10px;min-width:150px;">
                <div style="font-weight:bold;margin-bottom:5px;">${place.name}</div>
                ${place.address ? `<div style="font-size:12px;color:#666;">${place.address}</div>` : ''}
              </div>
            `,
          });

          window.kakao!.maps!.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });
        });

        // 모든 마커가 보이도록 지도 범위 설정
        map.setBounds(bounds);
        console.log(`✅ ${places.length}개의 마커가 표시되었습니다.`);
      } else {
        // 단일 마커 표시 (기존 방식)
        const markerPosition = new window.kakao!.maps!.LatLng(lat, lng);
        const marker = new window.kakao!.maps!.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 생성 (장소명이 있을 경우)
        if (name) {
          const infowindow = new window.kakao!.maps!.InfoWindow({
            content: `<div style="padding:10px;font-size:14px;">${name}</div>`,
          });
          infowindow.open(map, marker);
        }
        console.log('✅ 단일 마커가 표시되었습니다.');
      }

      console.log('✅ Kakao Map initialized successfully!');
    };

    // Kakao Map API가 이미 로드되어 있으면 바로 실행
    if (window.kakao!.maps!) {
      console.log('✅ Kakao Maps SDK detected, loading map...');
      window.kakao!.maps!.load(loadKakaoMap);
    } else {
      console.warn('⏳ Waiting for Kakao Maps SDK to load...');
      // SDK 로딩 대기
      const checkInterval = setInterval(() => {
        if (window.kakao!.maps!) {
          console.log('✅ Kakao Maps SDK loaded, initializing map...');
          clearInterval(checkInterval);
          window.kakao!.maps!.load(loadKakaoMap);
        }
      }, 100);

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.kakao!.maps!) {
          console.error('❌ Kakao Maps SDK failed to load within 10 seconds');
        }
      }, 10000);
    }
  }, [lat, lng, name, places, zoom]);

  // Kakao Map API 키가 없거나 좌표가 유효하지 않을 경우
  if (!lat || !lng || lat === 0 || lng === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-sm">위치 정보가 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* 지도 컨테이너 */}
      <div ref={mapContainer} className="w-full h-full rounded-xl" />

      {/* Kakao Map API가 로드되지 않았을 경우 표시 */}
      {!window.kakao && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-gray-600 font-medium mb-1">Kakao Map (준비 중)</p>
          <p className="text-xs text-gray-500">
            좌표: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
          <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              Kakao Map API 키를 설정하면 지도가 표시됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
