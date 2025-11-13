'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, updateProfile } from '@/lib/api/user';
import { UserProfile, UpdateProfileDto } from '@/types/user';
import ProfileImageUpload from '@/components/user/ProfileImageUpload';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';


export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfileDto>({
    name: '',
    bio: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.bio || '',
        profileImage: data.profileImage || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      if ((error as any)?.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = '이름은 최소 2자 이상이어야 합니다';
    }
    if (formData.name.trim().length > 50) {
      newErrors.name = '이름은 최대 50자까지 가능합니다';
    }
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = '자기소개는 최대 500자까지 가능합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateProfile(formData);
      toast.success('프로필이 성공적으로 수정되었습니다');
      router.push('/mypage');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('프로필 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      router.push('/mypage');
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({ ...formData, profileImage: imageUrl });
  };

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
        <p className="text-gray-600">프로필을 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">프로필 수정</h1>
          <p className="mt-2 text-gray-600">
            내 정보를 수정하고 업데이트하세요
          </p>
        </div>

        {/* 프로필 수정 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* 프로필 이미지 */}
            <div className="mb-8">
              <ProfileImageUpload
                currentImage={formData.profileImage || null}
                userName={profile.name}
                onImageChange={handleImageChange}
              />
            </div>

            {/* 이메일 (읽기 전용) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                이메일은 변경할 수 없습니다
              </p>
            </div>

            {/* 이름 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="이름을 입력하세요 (2-50자)"
                maxLength={50}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length} / 50자
              </p>
            </div>

            {/* 자기소개 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자기소개
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="자신을 소개하는 글을 작성해보세요 (최대 500자)"
                maxLength={500}
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {(formData.bio || '').length} / 500자
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
