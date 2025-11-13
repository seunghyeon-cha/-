'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMyBoards } from '@/lib/api/user';
import { deleteBoard } from '@/lib/api/boards';
import { Board } from '@/types/board';
import { BOARD_CATEGORY_LABELS } from '@/types/board';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';

type SortType = 'latest' | 'popular' | 'views';

export default function MyBoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBoards();
  }, [page, sortBy]);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await getMyBoards({
        page,
        limit: 10,
        sort: sortBy === 'latest' ? 'latest' : 'popular',
      });
      setBoards(response.boards);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load boards:', error);
      toast.error('게시글을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteBoard(id);
      toast.success('게시글이 삭제되었습니다');
      // 목록 새로고침
      loadBoards();
    } catch (error) {
      console.error('Failed to delete board:', error);
      toast.error('게시글 삭제에 실패했습니다');
    }
  };

  // 검색 필터링 (프론트엔드)
  const filteredBoards = boards.filter((board) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      board.title.toLowerCase().includes(query) ||
      board.content.toLowerCase().includes(query)
    );
  });

  // 정렬 (프론트엔드 추가 정렬)
  const sortedBoards = [...filteredBoards].sort((a, b) => {
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    return 0; // 나머지는 API에서 처리
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {/* 헤더 스켈레톤 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* 게시글 스켈레톤 */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내가 쓴 글</h1>
            <p className="mt-1 text-sm text-gray-600">
              총 {filteredBoards.length}개의 게시글
            </p>
          </div>
          <Link
            href="/boards/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + 새 글 작성
          </Link>
        </div>

        {/* 검색 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 또는 내용으로 검색..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 정렬 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순 (좋아요)</option>
            <option value="views">조회수순</option>
          </select>
        </div>
      </div>

      {/* 게시글 목록 */}
      {sortedBoards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? '검색 결과가 없습니다' : '작성한 게시글이 없습니다'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? '다른 검색어로 시도해보세요'
              : '첫 게시글을 작성하여 다른 여행자들과 소통해보세요'}
          </p>
          {!searchQuery && (
            <Link
              href="/boards/new"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              첫 게시글 작성하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBoards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* 카테고리 뱃지 */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {BOARD_CATEGORY_LABELS[board.category]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(board.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {/* 제목 */}
                <Link
                  href={`/boards/${board.id}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 transition-colors">
                    {board.title}
                  </h3>
                </Link>

                {/* 내용 미리보기 */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {board.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                  {board.content.length > 150 ? '...' : ''}
                </p>

                {/* 통계 및 액션 */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      👁 {board.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      👍 {board.likesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {board._count?.comments || 0}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/boards/${board.id}/edit`)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(board.id, board.title)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
