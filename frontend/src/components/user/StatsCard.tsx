'use client';

import { UserStats } from '@/types/user';

interface StatsCardProps {
  stats: UserStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      label: '게시글',
      value: stats.boardsCount,
      icon: '📝',
      color: 'text-blue-500',
    },
    {
      label: '리뷰',
      value: stats.reviewsCount,
      icon: '⭐',
      color: 'text-yellow-500',
    },
    {
      label: '북마크',
      value: stats.bookmarksCount,
      icon: '🔖',
      color: 'text-red-500',
    },
    {
      label: '좋아요',
      value: stats.likesReceived,
      icon: '❤️',
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
        >
          <div className={`text-4xl mb-2 ${item.color}`}>{item.icon}</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {item.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
