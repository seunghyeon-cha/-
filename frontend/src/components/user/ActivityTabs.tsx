'use client';

import { useState, useEffect } from 'react';
import { getMyBoards, getMyReviews } from '@/lib/api/user';
import { getMyBookmarks } from '@/lib/api/bookmarks';
import ReviewCard from '@/components/reviews/ReviewCard';
import PlaceCard from '@/components/places/PlaceCard';
import Pagination from '@/components/common/Pagination';
import Link from 'next/link';

type TabType = 'boards' | 'reviews' | 'bookmarks';

interface ActivityTabsProps {
  initialTab?: TabType;
}

export default function ActivityTabs({
  initialTab = 'boards',
}: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [boards, setBoards] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 탭 변경 시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [activeTab, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'boards') {
        const response = await getMyBoards({ page, limit: 10 });
        setBoards(response.boards);
        setTotalPages(response.pagination.totalPages);
      } else if (activeTab === 'reviews') {
        const response = await getMyReviews({ page, limit: 10 });
        setReviews(response.reviews);
        setTotalPages(response.pagination.totalPages);
      } else if (activeTab === 'bookmarks') {
        const response = await getMyBookmarks(page, 10);
        setBookmarks(response.data);
        setTotalPages(response.meta.totalPages);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'boards' as TabType, label: '내 게시글', icon: '📝' },
    { id: 'reviews' as TabType, label: '내 리뷰', icon: '⭐' },
    { id: 'bookmarks' as TabType, label: '북마크', icon: '🔖' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    // 게시글 탭
    if (activeTab === 'boards') {
      if (boards.length === 0) {
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 mb-4">작성한 게시글이 없습니다</p>
            <Link
              href="/boards/new"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              첫 게시글 작성하기
            </Link>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                  {board.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(board.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{board.content}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>조회 {board.views || 0}</span>
                <span>좋아요 {board.likesCount || 0}</span>
                <span>댓글 {board._count?.comments || 0}</span>
              </div>
            </Link>
          ))}
        </div>
      );
    }

    // 리뷰 탭
    if (activeTab === 'reviews') {
      if (reviews.length === 0) {
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⭐</div>
            <p className="text-gray-600 mb-4">작성한 리뷰가 없습니다</p>
            <Link
              href="/places"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              장소 둘러보기
            </Link>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      );
    }

    // 북마크 탭
    if (activeTab === 'bookmarks') {
      if (bookmarks.length === 0) {
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔖</div>
            <p className="text-gray-600 mb-4">북마크한 장소가 없습니다</p>
            <Link
              href="/places"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              장소 둘러보기
            </Link>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <PlaceCard
              key={bookmark.id}
              id={bookmark.place.id}
              image={bookmark.place.images?.[0]}
              category={bookmark.place.category}
              name={bookmark.place.name}
              address={bookmark.place.address}
              rating={bookmark.place.averageRating || 0}
              reviewCount={bookmark.place.reviewCount || 0}
              isBookmarked={true}
              onClick={(id) => (window.location.href = `/places/${id}`)}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 탭 헤더 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="p-6">{renderContent()}</div>

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className="p-6 border-t border-gray-200">
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
