'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PlaceCard from '@/components/places/PlaceCard';
import TourPlaceCard from '@/components/places/TourPlaceCard';
import Pagination from '@/components/common/Pagination';
import KakaoMap from '@/components/map/KakaoMap';
import { getPlaces, PlaceCategory, SortOption, Place } from '@/lib/api/places';
import {
  getTourPlaces,
  extractTourItems,
  TourPlace,
  CONTENT_TYPE_IDS,
} from '@/lib/api/tour';

type ViewMode = 'internal' | 'tour';
type DisplayMode = 'list' | 'map';

// 고정 카테고리: 숙소
const FIXED_CATEGORY: PlaceCategory = 'ACCOMMODATION';
const PAGE_TITLE = '숙소';
const PAGE_DESCRIPTION = '편안한 숙소를 찾아보세요';

const KOREA_REGIONS = [
  { code: '', name: '전체 지역' },
  { code: '서울', name: '서울특별시' },
  { code: '부산', name: '부산광역시' },
  { code: '인천', name: '인천광역시' },
  { code: '대구', name: '대구광역시' },
  { code: '광주', name: '광주광역시' },
  { code: '대전', name: '대전광역시' },
  { code: '울산', name: '울산광역시' },
  { code: '세종', name: '세종특별자치시' },
  { code: '경기', name: '경기도' },
  { code: '강원', name: '강원특별자치도' },
  { code: '충북', name: '충청북도' },
  { code: '충남', name: '충청남도' },
  { code: '전북', name: '전북특별자치도' },
  { code: '전남', name: '전라남도' },
  { code: '경북', name: '경상북도' },
  { code: '경남', name: '경상남도' },
  { code: '제주', name: '제주특별자치도' },
];

export default function AccommodationsPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('internal');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [places, setPlaces] = useState<Place[]>([]);
  const [tourPlaces, setTourPlaces] = useState<TourPlace[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // 내부 장소 목록 조회 (관광지만)
  const fetchPlaces = useCallback(async (
    sort?: SortOption,
    page: number = 1,
  ) => {
    try {
      setIsLoading(true);
      const response = await getPlaces({
        category: FIXED_CATEGORY, // 관광지 고정
        sort: sort || sortOption,
        page,
        limit: 20,
        search: debouncedSearchQuery || undefined,
        region: selectedRegion || undefined,
      });
      setPlaces(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch places:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOption, debouncedSearchQuery, selectedRegion]);

  // Tour API 관광지 조회
  const fetchTourPlaces = async (areaCode: string = '1') => {
    try {
      setIsLoading(true);
      const response = await getTourPlaces({
        areaCode,
        contentTypeId: CONTENT_TYPE_IDS.TOURIST_SPOT,
        numOfRows: 20,
        pageNo: 1,
      });
      const items = extractTourItems(response);
      setTourPlaces(items);
    } catch (error) {
      console.error('Failed to fetch tour places:', error);
      setTourPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  // View Mode 변경 시
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'internal') {
      fetchPlaces(sortOption, 1);
    } else {
      fetchTourPlaces('1'); // 서울 지역 기본
    }
  };

  // 정렬 변경 시
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SortOption;
    setSortOption(newSort);
    fetchPlaces(newSort, 1);
  };

  // 페이지 변경 시
  const handlePageChange = (page: number) => {
    fetchPlaces(sortOption, page);
    // 스크롤 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 내부 장소 카드 클릭 시
  const handleCardClick = (id: string) => {
    router.push(`/places/${id}`);
  };

  // Tour API 장소 카드 클릭 시
  const handleTourCardClick = (contentId: string) => {
    router.push(`/places/tour/${contentId}`);
  };

  // 북마크 토글
  const handleBookmark = (id: string) => {
    // TODO: 북마크 API 연동
    console.log('Bookmark toggled:', id);
  };

  // 지역 변경 핸들러
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // URL 쿼리 파라미터 업데이트는 나중에 추가 가능
  };

  // 모든 필터 초기화
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSortOption('latest');
  };

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 디바운스된 검색어 변경 시 재조회
  useEffect(() => {
    if (viewMode === 'internal') {
      fetchPlaces(sortOption, 1);
    }
  }, [debouncedSearchQuery, selectedRegion, viewMode, sortOption, fetchPlaces]);

  // 초기 로드
  useEffect(() => {
    if (viewMode === 'internal') {
      fetchPlaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* View Mode 전환 버튼 */}
          <div className="flex items-center gap-3 mb-6" role="group" aria-label="데이터 소스 선택">
            <button
              onClick={() => handleViewModeChange('internal')}
              aria-pressed={viewMode === 'internal'}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'internal'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              내부 장소
            </button>
            <button
              onClick={() => handleViewModeChange('tour')}
              aria-pressed={viewMode === 'tour'}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                viewMode === 'tour'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              Tour API (공공데이터)
            </button>
          </div>

          {/* 검색창 - 내부 장소일 때만 표시 */}
          {viewMode === 'internal' && (
            <div className="mb-6">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="장소명 또는 주소로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  aria-label="장소 검색"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="검색어 지우기"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 필터 영역 */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            {/* 지역 선택 - 내부 장소일 때만 표시 */}
            {viewMode === 'internal' && (
              <div className="flex items-center gap-2">
                <label htmlFor="region-select" className="text-sm font-medium text-gray-700">
                  지역
                </label>
                <select
                  id="region-select"
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  aria-label="지역 선택"
                >
                  {KOREA_REGIONS.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tour API 지역 선택 */}
            {viewMode === 'tour' && (
              <div className="flex items-center gap-2">
                <label htmlFor="tour-area-select" className="text-sm font-medium text-gray-700">
                  관광지 지역
                </label>
                <select
                  id="tour-area-select"
                  onChange={(e) => fetchTourPlaces(e.target.value)}
                  defaultValue="1"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="관광지 지역 선택"
                >
                  <option value="1">서울</option>
                  <option value="6">부산</option>
                  <option value="32">강원</option>
                  <option value="39">제주</option>
                  <option value="31">경기</option>
                  <option value="35">경북</option>
                  <option value="36">경남</option>
                  <option value="37">전북</option>
                  <option value="38">전남</option>
                  <option value="33">충북</option>
                  <option value="34">충남</option>
                </select>
              </div>
            )}

            {/* 페이지 타이틀 */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{PAGE_TITLE}</h1>
              <p className="text-sm text-gray-600 mt-1">{PAGE_DESCRIPTION}</p>
            </div>

            {/* 정렬 - 내부 장소일 때만 표시 */}
            {viewMode === 'internal' && (
              <div className="flex items-center gap-2 ml-auto">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                  정렬
                </label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="장소 정렬 기준"
                >
                  <option value="latest">최신순</option>
                  <option value="rating">평점순</option>
                  <option value="reviews">리뷰 많은 순</option>
                </select>
              </div>
            )}

            {/* 리스트/지도 뷰 토글 */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden" role="group" aria-label="표시 모드 선택">
              <button
                onClick={() => setDisplayMode('list')}
                aria-pressed={displayMode === 'list'}
                aria-label="리스트 보기"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  displayMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>리스트</span>
                </div>
              </button>
              <button
                onClick={() => setDisplayMode('map')}
                aria-pressed={displayMode === 'map'}
                aria-label="지도 보기"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  displayMode === 'map'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>지도</span>
                </div>
              </button>
            </div>
          </div>

          {/* 활성 필터 표시 - 내부 장소일 때만 */}
          {viewMode === 'internal' && (searchQuery || selectedRegion) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">활성 필터:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  검색: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-primary-900 transition-colors"
                    aria-label="검색 필터 제거"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedRegion && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {KOREA_REGIONS.find(r => r.code === selectedRegion)?.name}
                  <button
                    onClick={() => setSelectedRegion('')}
                    className="hover:text-primary-900 transition-colors"
                    aria-label="지역 필터 제거"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
              >
                모두 초기화
              </button>
            </div>
          )}


          {/* 총 개수 */}
          <div className="mt-4 text-sm text-gray-600">
            {viewMode === 'internal' ? (
              <>
                총 <span className="font-semibold text-gray-900">{meta.total}</span>
                개의 장소
              </>
            ) : (
              <>
                Tour API 관광지{' '}
                <span className="font-semibold text-gray-900">{tourPlaces.length}</span>개
              </>
            )}
          </div>
        </div>
      </div>

      {/* 장소 그리드 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'internal' ? (
          // 내부 장소 표시
          places.length > 0 ? (
            displayMode === 'list' ? (
              <>
                {/* 장소 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {places.map((place) => (
                    <PlaceCard
                      key={place.id}
                      id={place.id}
                      image={place.images?.[0]}
                      category={place.category}
                      name={place.name}
                      address={place.address}
                      rating={place.averageRating}
                      reviewCount={place.reviewCount}
                      isBookmarked={false}
                      onBookmark={handleBookmark}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>

                {/* 페이지네이션 */}
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              // 지도 뷰
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <KakaoMap
                  lat={places[0]?.lat ?? 37.5665}
                  lng={places[0]?.lng ?? 126.9780}
                  name="숙소 목록"
                  places={places.map(place => ({
                    id: place.id,
                    name: place.name,
                    latitude: place.lat,
                    longitude: place.lng,
                    address: place.address
                  }))}
                  zoom={5}
                />
              </div>
            )
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                장소가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                해당 조건에 맞는 장소를 찾을 수 없습니다.
              </p>
            </div>
          )
        ) : (
          // Tour API 장소 표시
          tourPlaces.length > 0 ? (
            displayMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourPlaces.map((place) => (
                  <TourPlaceCard
                    key={place.contentid}
                    place={place}
                    onClick={handleTourCardClick}
                  />
                ))}
              </div>
            ) : (
              // Tour 지도 뷰
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <KakaoMap
                  lat={tourPlaces[0]?.mapy ? parseFloat(tourPlaces[0].mapy) : 37.5665}
                  lng={tourPlaces[0]?.mapx ? parseFloat(tourPlaces[0].mapx) : 126.9780}
                  name="Tour 장소 목록"
                />
              </div>
            )
          ) : (
            // Tour API 빈 상태
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
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                관광지 정보가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                선택한 지역의 관광지 정보를 불러올 수 없습니다.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
