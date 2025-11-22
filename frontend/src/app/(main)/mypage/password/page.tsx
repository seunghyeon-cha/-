'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { changePassword } from '@/lib/api/user';
import { ChangePasswordDto } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';


export default function ChangePasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력하세요';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력하세요';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    if (!formData.newPasswordConfirm) {
      newErrors.newPasswordConfirm = '새 비밀번호를 다시 입력하세요';
    } else if (formData.newPassword !== formData.newPasswordConfirm) {
      newErrors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다';
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword = '현재 비밀번호와 다른 비밀번호를 입력하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('비밀번호가 성공적으로 변경되었습니다');
      router.push('/mypage');
    } catch (error) {
      console.error('Failed to change password:', error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        setErrors({ currentPassword: '현재 비밀번호가 일치하지 않습니다' });
      } else {
        toast.error('비밀번호 변경에 실패했습니다');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.newPasswordConfirm
    ) {
      if (
        confirm('변경을 취소하시겠습니까? 입력한 내용이 저장되지 않습니다.')
      ) {
        router.push('/mypage');
      }
    } else {
      router.push('/mypage');
    }
  };

  const togglePasswordVisibility = (
    field: 'current' | 'new' | 'confirm'
  ) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">비밀번호 변경</h1>
          <p className="mt-2 text-gray-600">
            보안을 위해 주기적으로 비밀번호를 변경하세요
          </p>
        </div>

        {/* 비밀번호 변경 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* 현재 비밀번호 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="현재 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* 새 비밀번호 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
              )}
              {!errors.newPassword && formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-1 flex-1 rounded ${
                        formData.newPassword.length >= 12
                          ? 'bg-green-500'
                          : formData.newPassword.length >= 8
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="text-gray-600">
                      {formData.newPassword.length >= 12
                        ? '강함'
                        : formData.newPassword.length >= 8
                        ? '보통'
                        : '약함'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.newPasswordConfirm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPasswordConfirm: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12 ${
                    errors.newPasswordConfirm
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.newPasswordConfirm && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newPasswordConfirm}
                </p>
              )}
              {!errors.newPasswordConfirm &&
                formData.newPasswordConfirm &&
                formData.newPassword === formData.newPasswordConfirm && (
                  <p className="mt-1 text-sm text-green-600">
                    ✓ 비밀번호가 일치합니다
                  </p>
                )}
            </div>

            {/* 안내 메시지 */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                안전한 비밀번호 만들기
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 8자 이상의 비밀번호를 사용하세요</li>
                <li>• 영문, 숫자, 특수문자를 조합하세요</li>
                <li>• 다른 사이트와 다른 비밀번호를 사용하세요</li>
                <li>• 주기적으로 비밀번호를 변경하세요</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? '변경 중...' : '변경'}
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
