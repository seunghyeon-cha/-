'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getItineraries } from '@/lib/api/itinerary';
import { Itinerary } from '@/types/itinerary';

export default function ItineraryPage() {
  const router = useRouter();

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'latest' | 'oldest'>('latest');

  // 여행 일정 목록 조회
  const fetchItineraries = useCallback(async (
    sort?: 'latest' | 'oldest',
    page: number = 1,
    search?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await getItineraries({
        sort: sort || sortOption,
        page,
        limit: 12,
        search,
      });
      setItineraries(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
      // API가 아직 구현되지 않았으면 빈 배열로 설정
      setItineraries([]);
      setMeta({ total: 0, page: 1, limit: 12, totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [sortOption]);

  // 정렬 변경 시
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as 'latest' | 'oldest';
    setSortOption(newSort);
    fetchItineraries(newSort, 1, searchQuery);
  };

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItineraries(sortOption, 1, searchQuery);
  };

  // 페이지 변경 시
  const handlePageChange = (page: number) => {
    fetchItineraries(sortOption, page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 새 일정 만들기 버튼
  const handleCreateClick = () => {
    router.push('/itinerary/new');
  };

  // 일정 클릭
  const handleItineraryClick = (id: string) => {
    router.push(`/itinerary/${id}`);
  };

  // 초기 로드
  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      formatted: `${start.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`,
      days: diffDays,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">내 여행 일정</h1>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + 새 일정 만들기
            </button>
          </div>

          {/* 검색 및 정렬 */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="일정 제목 또는 지역 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>

          {/* 총 개수 */}
          <div className="mt-4 text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{meta.total}</span>
            개의 일정
          </div>
        </div>
      </div>

      {/* 일정 목록 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : itineraries.length > 0 ? (
          <>
            {/* 일정 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => {
                const dateRange = formatDateRange(
                  itinerary.startDate,
                  itinerary.endDate
                );
                return (
                  <div
                    key={itinerary.id}
                    onClick={() => handleItineraryClick(itinerary.id)}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* 일정 제목 */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {itinerary.title}
                    </h3>

                    {/* 지역 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded">
                        {itinerary.region}
                      </span>
                      {itinerary.isPublic && (
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded">
                          공개
                        </span>
                      )}
                    </div>

                    {/* 날짜 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <svg
                        className="w-4 h-4"
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
                      <span>{dateRange.formatted}</span>
                    </div>

                    {/* 일수 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4"
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
                      <span>{dateRange.days}일</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 페이지네이션 */}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        meta.page === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          // 빈 상태
          <div className="text-center py-16">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              여행 일정이 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              첫 번째 여행 일정을 만들어보세요!
            </p>
            <button
              onClick={handleCreateClick}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + 새 일정 만들기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
