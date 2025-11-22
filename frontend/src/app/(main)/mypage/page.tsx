'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { getMyProfile } from '@/lib/api/user';
import { UserProfile } from '@/types/user';
import ProfileCard from '@/components/user/ProfileCard';
import StatsCard from '@/components/user/StatsCard';
import ActivityTabs from '@/components/user/ActivityTabs';
import { useAuthStore } from '@/stores/authStore';


export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      // 인증 에러 시 로그인 페이지로
      if (error instanceof AxiosError && error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // 인증 확인
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 프로필 데이터 로드
    loadProfile();
  }, [isAuthenticated, router, loadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">프로필을 불러올 수 없습니다</p>
          <button
            onClick={loadProfile}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="mt-2 text-gray-600">내 정보와 활동 내역을 확인하세요</p>
        </div>

        {/* 프로필 카드 */}
        <div className="mb-8">
          <ProfileCard profile={profile} />
        </div>

        {/* 통계 카드 */}
        <div className="mb-8">
          <StatsCard stats={profile.stats} />
        </div>

        {/* 활동 탭 */}
        <div>
          <ActivityTabs />
        </div>
      </div>
    </div>
  );
}
