'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getFestivals, searchFestivals, Festival, AREA_LABELS, AREA_CODES } from '@/lib/api/festivals';

export default function FestivalsPage() {
  const router = useRouter();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 20;

  // 축제 목록 조회 또는 검색
  const fetchFestivals = async (areaCode: string = '', page: number = 1, keyword: string = '') => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (keyword.trim()) {
        // 검색 모드
        response = await searchFestivals({
          keyword: keyword.trim(),
          areaCode,
          numOfRows: itemsPerPage,
          pageNo: page,
        });
      } else {
        // 일반 목록 모드
        response = await getFestivals({
          areaCode,
          numOfRows: itemsPerPage,
          pageNo: page,
        });
      }

      if (response.response.header.resultCode === '0000') {
        const items = response.response.body.items?.item || [];
        setFestivals(items);
        setTotalCount(response.response.body.totalCount || 0);
      } else {
        setError('축제 정보를 불러오는데 실패했습니다.');
        setFestivals([]);
      }
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
      setError('축제 정보를 불러오는데 실패했습니다.');
      setFestivals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 필터/검색 변경 시 재조회
  useEffect(() => {
    fetchFestivals(selectedArea, currentPage, searchKeyword);
  }, [selectedArea, currentPage, searchKeyword]);

  // 지역 변경
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
    setCurrentPage(1);
  };

  // 검색 입력 핸들러 (debounce 적용)
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // 이전 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 300ms 후에 검색 실행
    debounceTimer.current = setTimeout(() => {
      setSearchKeyword(value);
      setCurrentPage(1);
    }, 300);
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    setCurrentPage(1);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  // 축제 카드 클릭
  const handleFestivalClick = (contentId: string) => {
    router.push(`/festivals/${contentId}`);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">축제 정보</h1>
          <p className="text-gray-600">전국 각지의 다양한 축제를 만나보세요</p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* 검색창 */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="축제명으로 검색..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="검색 초기화"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* 지역 선택 */}
            <div className="flex items-center gap-2">
              <label htmlFor="area" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                지역 선택
              </label>
              <select
                id="area"
                value={selectedArea}
                onChange={handleAreaChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">전체</option>
                <option value={AREA_CODES.SEOUL}>서울</option>
                <option value={AREA_CODES.BUSAN}>부산</option>
                <option value={AREA_CODES.DAEGU}>대구</option>
                <option value={AREA_CODES.INCHEON}>인천</option>
                <option value={AREA_CODES.GWANGJU}>광주</option>
                <option value={AREA_CODES.DAEJEON}>대전</option>
                <option value={AREA_CODES.ULSAN}>울산</option>
                <option value={AREA_CODES.SEJONG}>세종</option>
                <option value={AREA_CODES.GYEONGGI}>경기</option>
                <option value={AREA_CODES.GANGWON}>강원</option>
                <option value={AREA_CODES.CHUNGBUK}>충북</option>
                <option value={AREA_CODES.CHUNGNAM}>충남</option>
                <option value={AREA_CODES.JEONBUK}>전북</option>
                <option value={AREA_CODES.JEONNAM}>전남</option>
                <option value={AREA_CODES.GYEONGBUK}>경북</option>
                <option value={AREA_CODES.GYEONGNAM}>경남</option>
                <option value={AREA_CODES.JEJU}>제주</option>
              </select>
            </div>

            {/* 결과 수 */}
            {totalCount > 0 && (
              <span className="text-sm text-gray-600 whitespace-nowrap">
                총 {totalCount.toLocaleString()}개의 축제
                {searchKeyword && (
                  <span className="ml-1 text-primary-600">
                    (검색: "{searchKeyword}")
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : festivals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchKeyword
                ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                : selectedArea
                ? '해당 지역의 축제 정보가 없습니다.'
                : '축제 정보가 없습니다.'}
            </p>
            {searchKeyword && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                검색 초기화
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 축제 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {festivals.map((festival) => (
                <div
                  key={festival.contentid}
                  onClick={() => handleFestivalClick(festival.contentid)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* 이미지 */}
                  <div className="relative w-full aspect-[4/3] bg-gray-200">
                    {festival.firstimage ? (
                      <Image
                        src={festival.firstimage}
                        alt={festival.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {festival.title}
                    </h3>

                    {festival.addr1 && (
                      <div className="flex items-start gap-1 text-sm text-gray-600 mb-1">
                        <svg
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
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
                        <span className="line-clamp-1">{festival.addr1}</span>
                      </div>
                    )}

                    {festival.tel && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{festival.tel}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    이전
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
