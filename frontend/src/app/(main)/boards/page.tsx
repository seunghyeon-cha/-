'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getBoards } from '@/lib/api/boards';
import {
  Board,
  BoardCategory,
  BOARD_CATEGORY_LABELS,
} from '@/types/board';

type TabCategory = 'ALL' | BoardCategory;

export default function BoardsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabCategory>('ALL');
  const [sortOption, setSortOption] = useState<'latest' | 'popular' | 'views'>(
    'latest',
  );
  const [boards, setBoards] = useState<Board[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 게시글 목록 조회
  const fetchBoards = useCallback(async (
    category?: BoardCategory,
    sort?: 'latest' | 'popular' | 'views',
    page: number = 1,
    search?: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await getBoards({
        category,
        sort: sort || sortOption,
        page,
        limit: 20,
        search,
      });
      setBoards(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOption]);

  // 탭 변경 시
  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    const category = tab === 'ALL' ? undefined : tab;
    fetchBoards(category, sortOption, 1, searchQuery);
  };

  // 정렬 변경 시
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as 'latest' | 'popular' | 'views';
    setSortOption(newSort);
    const category = activeTab === 'ALL' ? undefined : activeTab;
    fetchBoards(category, newSort, 1, searchQuery);
  };

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const category = activeTab === 'ALL' ? undefined : activeTab;
    fetchBoards(category, sortOption, 1, searchQuery);
  };

  // 페이지 변경 시
  const handlePageChange = (page: number) => {
    const category = activeTab === 'ALL' ? undefined : activeTab;
    fetchBoards(category, sortOption, page, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 글쓰기 버튼
  const handleWriteClick = () => {
    router.push('/boards/new');
  };

  // 게시글 클릭
  const handleBoardClick = (id: string) => {
    router.push(`/boards/${id}`);
  };

  // 초기 로드
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const tabs: { key: TabCategory; label: string }[] = [
    { key: 'ALL', label: '전체' },
    { key: 'REVIEW', label: BOARD_CATEGORY_LABELS.REVIEW },
    { key: 'QNA', label: BOARD_CATEGORY_LABELS.QNA },
    { key: 'RESTAURANT', label: BOARD_CATEGORY_LABELS.RESTAURANT },
    { key: 'ACCOMMODATION', label: BOARD_CATEGORY_LABELS.ACCOMMODATION },
    { key: 'TOURIST', label: BOARD_CATEGORY_LABELS.TOURIST },
    { key: 'FREE', label: BOARD_CATEGORY_LABELS.FREE },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
            <button
              onClick={handleWriteClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              글쓰기
            </button>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${
                  activeTab === tab.key
                    ? 'text-primary-600 border-primary-500'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 검색 및 정렬 */}
          <div className="mt-4 flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="views">조회순</option>
            </select>
          </div>

          {/* 총 개수 */}
          <div className="mt-4 text-sm text-gray-600">
            총 <span className="font-semibold text-gray-900">{meta.total}</span>
            개의 게시글
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          // 로딩 스켈레톤
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
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
        ) : boards.length > 0 ? (
          <>
            {/* 게시글 리스트 */}
            <div className="space-y-4">
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded">
                          {BOARD_CATEGORY_LABELS[board.category]}
                        </span>
                        {board.isPinned && (
                          <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded">
                            📌 공지
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {board.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {board.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{board.user.name}</span>
                        <span>
                          {new Date(board.createdAt).toLocaleDateString()}
                        </span>
                        <span>조회 {board.views}</span>
                        <span>좋아요 {board.likesCount}</span>
                        <span>댓글 {board.commentsCount}</span>
                      </div>
                    </div>
                    {board.images && board.images.length > 0 && (
                      <div className="ml-4 relative w-24 h-24 flex-shrink-0 bg-gray-100">
                        <Image
                          src={board.images[0]}
                          alt={board.title}
                          fill
                          className="rounded-lg object-cover"
                          sizes="96px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
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
                ),
              )}
            </div>
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              게시글이 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
