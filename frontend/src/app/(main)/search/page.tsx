'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPlaces, Place } from '@/lib/api/places';
import { getBoards } from '@/lib/api/boards';
import { Board } from '@/types/board';

type SearchType = 'all' | 'places' | 'boards';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [places, setPlaces] = useState<Place[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryParam) {
      handleSearch();
    }
  }, [queryParam]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setHasSearched(true);

      // 장소 검색
      if (searchType === 'all' || searchType === 'places') {
        const placesResponse = await getPlaces({
          search: searchQuery,
          limit: 20,
        });
        setPlaces(placesResponse.data);
      } else {
        setPlaces([]);
      }

      // 게시글 검색
      if (searchType === 'all' || searchType === 'boards') {
        const boardsResponse = await getBoards({
          search: searchQuery,
          limit: 20,
        });
        setBoards(boardsResponse.data);
      } else {
        setBoards([]);
      }

      // URL 업데이트
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Search failed:', error);
      setPlaces([]);
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults = places.length + boards.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 검색 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">검색</h1>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="장소, 게시글 검색..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                검색
              </button>
            </div>
          </form>

          {/* 검색 타입 탭 */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'places', label: '장소' },
              { key: 'boards', label: '게시글' },
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setSearchType(type.key as SearchType)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  searchType === type.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <>
            {/* 검색 결과 헤더 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {searchQuery ? (
                  <>
                    '<span className="text-primary-600">{searchQuery}</span>' 검색
                    결과{' '}
                    <span className="text-gray-600">({totalResults}개)</span>
                  </>
                ) : (
                  '검색 결과'
                )}
              </h2>
            </div>

            {totalResults === 0 ? (
              // 검색 결과 없음
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  검색 결과가 없습니다
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  다른 키워드로 검색해보세요
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 장소 검색 결과 */}
                {places.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">
                      장소 ({places.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {places.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => router.push(`/places/${place.id}`)}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          {place.images && place.images.length > 0 && (
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {place.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {place.address}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {place.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4 text-yellow-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{place.averageRating.toFixed(1)}</span>
                              <span>({place.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 게시글 검색 결과 */}
                {boards.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">
                      게시글 ({boards.length})
                    </h3>
                    <div className="space-y-3">
                      {boards.map((board) => (
                        <div
                          key={board.id}
                          onClick={() => router.push(`/boards/${board.id}`)}
                          className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded">
                                  {board.category}
                                </span>
                                {board.isPinned && (
                                  <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded">
                                    공지
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {board.title}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {board.content}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{board.user.name}</span>
                                <span>
                                  {new Date(board.createdAt).toLocaleDateString()}
                                </span>
                                <span>조회 {board.views}</span>
                                <span>좋아요 {board.likesCount}</span>
                              </div>
                            </div>
                            {board.images && board.images.length > 0 && (
                              <img
                                src={board.images[0]}
                                alt={board.title}
                                className="w-20 h-20 rounded-lg object-cover ml-4"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // 초기 상태 (검색 전)
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              검색어를 입력하세요
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              원하시는 장소나 게시글을 찾아보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
