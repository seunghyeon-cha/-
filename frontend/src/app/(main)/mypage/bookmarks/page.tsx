'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyBookmarks, deleteBookmark } from '@/lib/api/bookmarks';
import { Bookmark } from '@/lib/api/bookmarks';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/common/Pagination';

export default function MyBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBookmarks();
  }, [page]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const response = await getMyBookmarks(page, 12); // 그리드 레이아웃용 12개
      setBookmarks(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      toast.error('북마크를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id: string, placeName: string) => {
    if (!confirm(`"${placeName}" 북마크를 해제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteBookmark(id);
      toast.success('북마크가 해제되었습니다');
      loadBookmarks();
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error('북마크 해제에 실패했습니다');
    }
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-400">평점 없음</span>;

    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400">★</span>
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">북마크</h1>
            <p className="mt-1 text-sm text-gray-600">
              총 {bookmarks.length}개의 장소
            </p>
          </div>
          <Link
            href="/places"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            장소 더 찾기
          </Link>
        </div>
      </div>

      {/* 북마크 그리드 */}
      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            북마크한 장소가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            마음에 드는 장소를 북마크하여 나중에 쉽게 찾아보세요
          </p>
          <Link
            href="/places"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            장소 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              {/* 이미지 */}
              <Link
                href={`/places/${bookmark.place.id}`}
                className="block relative h-48 bg-gray-200 overflow-hidden"
              >
                {bookmark.place.images && bookmark.place.images[0] ? (
                  <img
                    src={bookmark.place.images[0]}
                    alt={bookmark.place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">📍</span>
                  </div>
                )}

                {/* 카테고리 뱃지 */}
                {bookmark.place.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                      {bookmark.place.category}
                    </span>
                  </div>
                )}
              </Link>

              {/* 정보 */}
              <div className="p-4">
                <Link
                  href={`/places/${bookmark.place.id}`}
                  className="block mb-2"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {bookmark.place.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {bookmark.place.address}
                </p>

                {/* 평점 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    {renderRating(bookmark.place.averageRating)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(bookmark.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                {/* 북마크 해제 버튼 */}
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id, bookmark.place.name)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  북마크 해제
                </button>
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
