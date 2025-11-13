'use client';

import { UserProfile } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  // 프로필 이미지 또는 기본 이니셜
  const getProfileDisplay = () => {
    if (profile.profileImage) {
      return (
        <Image
          src={profile.profileImage}
          alt={profile.name}
          width={120}
          height={120}
          className="rounded-full object-cover border-2 border-white shadow-md"
        />
      );
    }

    // 기본 이미지: 이름 첫 글자
    const initial = profile.name.charAt(0).toUpperCase();
    return (
      <div className="w-[120px] h-[120px] rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold border-2 border-white shadow-md">
        {initial}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">{getProfileDisplay()}</div>

        {/* 프로필 정보 */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {profile.name}
          </h2>
          <p className="text-sm text-gray-600 mb-3">{profile.email}</p>
          {profile.bio && (
            <p className="text-gray-700 mb-4 line-clamp-3">{profile.bio}</p>
          )}

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="/mypage/edit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              프로필 수정
            </Link>
            <Link
              href="/mypage/password"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              비밀번호 변경
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
