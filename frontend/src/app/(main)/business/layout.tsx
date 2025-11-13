'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  section: string;
}

const navItems: NavItem[] = [
  { id: 'stats', label: '통계 대시보드', icon: '📊', href: '/business/stats', section: '대시보드' },
  { id: 'places', label: '업장 관리', icon: '🏪', href: '/business/places', section: '관리' },
  { id: 'promotions', label: '프로모션', icon: '🎯', href: '/business/promotions', section: '관리' },
  { id: 'verify', label: '사업자 인증', icon: '✅', href: '/business/verify', section: '설정' },
];

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 인증 확인
    if (!user) {
      router.push('/login?redirect=/business/stats');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  // Section별로 그룹화
  const sections = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const isActive = (href: string) => {
    // Dynamic routes 처리 (/business/places/[id] 등)
    if (href === '/business/places' && pathname?.startsWith('/business/places')) {
      return true;
    }
    return pathname === href;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">사업자 관리</h2>
                <p className="text-sm text-gray-600 mt-1">
                  업장 및 프로모션 관리
                </p>
              </div>

              <nav className="space-y-6">
                {Object.entries(sections).map(([section, items]) => (
                  <div key={section}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* 도움말 카드 */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 도움말
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  사업자 인증이 승인되어야 업장 등록 및 프로모션 기능을 사용할 수 있습니다.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
