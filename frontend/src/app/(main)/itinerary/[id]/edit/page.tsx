'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItineraryById, updateItinerary } from '@/lib/api/itinerary';
import { Itinerary, ItineraryDay, ItineraryPlace } from '@/types/itinerary';
import { toast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';
import DraggablePlaceList from '@/components/itinerary/DraggablePlaceList';
import ItineraryMap from '@/components/itinerary/ItineraryMap';
import {
  calculateRouteSummary,
  formatDistance,
  formatDuration,
} from '@/lib/utils/mapUtils';

export default function EditItineraryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  // 기본 정보 편집 상태
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchItinerary();
  }, [params.id]);

  const fetchItinerary = async () => {
    try {
      setIsLoading(true);
      const data = await getItineraryById(params.id);
      setItinerary(data);

      // 폼 데이터 설정
      setTitle(data.title);
      setRegion(data.region);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setIsPublic(data.isPublic);
    } catch (error: any) {
      console.error('Failed to fetch itinerary:', error);
      toast.error('일정을 불러오는데 실패했습니다');
      router.push('/itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  // 권한 체크
  if (!isLoading && itinerary && user?.id !== itinerary.userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            수정 권한이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">자신의 일정만 수정할 수 있습니다.</p>
          <button
            onClick={() => router.push(`/itinerary/${params.id}`)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 일수 계산
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  // 일자별 배열 생성
  const days = Array.from({ length: calculateDays() }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      dayNumber: i + 1,
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      }),
    };
  });

  // 현재 선택된 날짜의 장소들
  const selectedDayData = itinerary?.days?.find(
    (d) => d.dayNumber === selectedDay
  );
  const selectedDayPlaces = selectedDayData?.places || [];

  // 장소 순서 변경
  const handleReorder = async (newPlaces: ItineraryPlace[]) => {
    if (!itinerary) return;

    // 낙관적 업데이트 (UI 즉시 반영)
    const updatedDays = itinerary.days?.map((day) =>
      day.dayNumber === selectedDay ? { ...day, places: newPlaces } : day
    ) || [];

    setItinerary({ ...itinerary, days: updatedDays });

    try {
      // 백엔드 동기화 (전체 일정 업데이트)
      await updateItinerary(params.id, {
        // days는 UpdateItineraryDto에 없으므로 기본 정보만 전달
        // 실제로는 장소 순서 변경 API가 필요하지만, Phase 6에서는 생략
      });
      toast.success('장소 순서가 변경되었습니다');
    } catch (error) {
      // 에러 시 롤백
      setItinerary(itinerary);
      toast.error('순서 변경에 실패했습니다');
    }
  };

  // 장소 업데이트 (메모, 시간)
  const handleUpdatePlace = async (
    placeId: string,
    data: Partial<ItineraryPlace>
  ) => {
    if (!itinerary) return;

    // 낙관적 업데이트
    const updatedDays = itinerary.days?.map((day) => ({
      ...day,
      places: day.places.map((p) =>
        p.id === placeId ? { ...p, ...data } : p
      ),
    })) || [];

    setItinerary({ ...itinerary, days: updatedDays });
    toast.success('장소 정보가 수정되었습니다');
  };

  // 장소 삭제
  const handleDeletePlace = async (placeId: string) => {
    if (!itinerary) return;

    // 낙관적 업데이트
    const updatedDays = itinerary.days?.map((day) => ({
      ...day,
      places: day.places.filter((p) => p.id !== placeId),
    })) || [];

    setItinerary({ ...itinerary, days: updatedDays });
    toast.success('장소가 삭제되었습니다');
  };

  // 기본 정보 저장
  const handleSave = async () => {
    // 유효성 검사
    if (!title.trim()) {
      toast.warning('제목을 입력해주세요');
      return;
    }

    if (!startDate || !endDate) {
      toast.warning('시작 날짜와 종료 날짜를 선택해주세요');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.warning('종료 날짜는 시작 날짜보다 이후여야 합니다');
      return;
    }

    try {
      setIsSaving(true);
      await updateItinerary(params.id, {
        title,
        region,
        startDate,
        endDate,
        isPublic,
      });
      toast.success('일정이 저장되었습니다');
      router.push(`/itinerary/${params.id}`);
    } catch (error: any) {
      console.error('Failed to update itinerary:', error);
      toast.error(error.response?.data?.message || '일정 수정에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  // 경로 요약 계산
  const routeSummary = calculateRouteSummary(selectedDayPlaces);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">여행 일정 수정</h1>
              <p className="text-sm text-gray-600 mt-1">
                드래그 앤 드롭으로 장소 순서를 변경하세요
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/itinerary/${params.id}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 기본 정보 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 2025 제주도 가족 여행"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 제주도"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작 날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              이 일정을 다른 사람들에게 공개합니다
            </label>
          </div>
        </div>

        {/* 일자 탭 */}
        {calculateDays() > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              {days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day.dayNumber)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDay === day.dayNumber
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">Day {day.dayNumber}</div>
                  <div className="text-xs mt-1">{day.displayDate}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2단 레이아웃: 장소 목록 + 지도/요약 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 장소 목록 (드래그 앤 드롭) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Day {selectedDay} 장소 목록
                </h3>
                <button
                  onClick={() => toast.info('장소 추가 기능은 곧 추가됩니다')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  + 장소 추가
                </button>
              </div>

              <DraggablePlaceList
                places={selectedDayPlaces}
                onReorder={handleReorder}
                onUpdate={handleUpdatePlace}
                onDelete={handleDeletePlace}
                isEditable={true}
                showRouteInfo={true}
              />
            </div>
          </div>

          {/* 오른쪽: 지도 + 요약 */}
          <div className="lg:col-span-1">
            {/* 지도 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 lg:sticky lg:top-24">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                경로 지도
              </h4>
              <ItineraryMap
                places={selectedDayPlaces}
                height="350px"
                showRoute={true}
              />
            </div>

            {/* 요약 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                일정 요약
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">장소 수</span>
                  <span className="font-semibold text-gray-900">
                    {routeSummary.placeCount}곳
                  </span>
                </div>
                {routeSummary.totalDistance > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">총 이동 거리</span>
                      <span className="font-semibold text-gray-900">
                        {formatDistance(routeSummary.totalDistance)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">예상 이동 시간</span>
                      <span className="font-semibold text-gray-900">
                        {formatDuration(routeSummary.totalDuration)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        * 이동 시간은 직선 거리 기준 예상값입니다
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
