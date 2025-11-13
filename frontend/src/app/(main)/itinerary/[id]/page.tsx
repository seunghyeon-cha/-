'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItineraryById, deleteItinerary } from '@/lib/api/itinerary';
import { Itinerary } from '@/types/itinerary';
import { toast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';

export default function ItineraryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItinerary();
  }, [params.id]);

  const fetchItinerary = async () => {
    try {
      setIsLoading(true);
      const data = await getItineraryById(params.id);
      setItinerary(data);
    } catch (error: any) {
      console.error('Failed to fetch itinerary:', error);
      toast.error('일정을 불러오는데 실패했습니다');
      // API가 없으면 목 데이터 표시
      setItinerary({
        id: params.id,
        title: '샘플 여행 일정',
        startDate: '2025-12-01',
        endDate: '2025-12-03',
        region: '제주도',
        userId: 'user-123',
        user: {
          id: 'user-123',
          name: '홍길동',
          email: 'hong@example.com',
        },
        days: [],
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/itinerary/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteItinerary(params.id);
      toast.success('일정이 삭제되었습니다');
      router.push('/itinerary');
    } catch (error: any) {
      console.error('Failed to delete itinerary:', error);
      toast.error('일정 삭제에 실패했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('링크가 클립보드에 복사되었습니다');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            일정을 찾을 수 없습니다
          </h3>
          <button
            onClick={() => router.push('/itinerary')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === itinerary.userId;
  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // 일자별 배열 생성
  const days = Array.from({ length: totalDays }, (_, i) => {
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

  const selectedDayData = itinerary.days?.find(
    (d) => d.dayNumber === selectedDay
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {itinerary.title}
                </h1>
                {itinerary.isPublic && (
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded">
                    공개
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {itinerary.user?.name} • {' '}
                {new Date(itinerary.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                공유
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 일정 정보 */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <span className="font-semibold">{itinerary.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {startDate.toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {endDate.toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{totalDays}일</span>
            </div>
          </div>
        </div>
      </div>

      {/* 일자 탭 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4">
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
      </div>

      {/* 일자별 일정 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {selectedDayData && selectedDayData.places.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {selectedDayData.places
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((placeItem, index) => (
                  <div key={placeItem.id} className="p-6">
                    <div className="flex gap-4">
                      {/* 순서 번호 */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                      </div>

                      {/* 장소 정보 */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {placeItem.place?.name || '장소 정보 없음'}
                        </h3>
                        {placeItem.place?.address && (
                          <p className="text-sm text-gray-600 mb-2">
                            {placeItem.place.address}
                          </p>
                        )}
                        {placeItem.place?.category && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                            {placeItem.place.category}
                          </span>
                        )}
                        {placeItem.memo && (
                          <p className="text-sm text-gray-700 mt-2 p-3 bg-yellow-50 rounded-lg">
                            {placeItem.memo}
                          </p>
                        )}
                      </div>

                      {/* 방문 시간 */}
                      {placeItem.visitTime && (
                        <div className="flex-shrink-0 text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 inline mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {placeItem.visitTime}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                이 날짜에 계획된 장소가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isOwner
                  ? '수정 버튼을 눌러 장소를 추가해보세요'
                  : '아직 계획이 추가되지 않았습니다'}
              </p>
              {isOwner && (
                <button
                  onClick={handleEdit}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  장소 추가하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
