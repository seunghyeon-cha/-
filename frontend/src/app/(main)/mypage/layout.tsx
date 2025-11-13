'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '대시보드', icon: '🏠', href: '/mypage', section: '내 정보' },
  { id: 'edit', label: '프로필 수정', icon: '✏️', href: '/mypage/edit', section: '내 정보' },
  { id: 'password', label: '비밀번호 변경', icon: '🔒', href: '/mypage/password', section: '내 정보' },

  { id: 'boards', label: '내가 쓴 글', icon: '📝', href: '/mypage/boards', section: '내 활동' },
  { id: 'reviews', label: '내가 쓴 리뷰', icon: '⭐', href: '/mypage/reviews', section: '내 활동' },
  { id: 'bookmarks', label: '북마크', icon: '🔖', href: '/mypage/bookmarks', section: '관리' },

  { id: 'settings', label: '알림 설정', icon: '🔔', href: '/mypage/settings', section: '설정' },
];

// 섹션별로 그룹화
const groupedNav = navItems.reduce((acc, item) => {
  const section = item.section || '기타';
  if (!acc[section]) {
    acc[section] = [];
  }
  acc[section].push(item);
  return acc;
}, {} as Record<string, NavItem[]>);

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // 인증 확인
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">마이페이지</h2>

                <nav className="space-y-6">
                  {Object.entries(groupedNav).map(([section, items]) => (
                    <div key={section}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {section}
                      </h3>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span className="mr-3 text-lg">{item.icon}</span>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
