'use client';

import { useState, useEffect } from 'react';
import {
  getNotificationSettings,
  updateNotificationSettings,
  resetNotificationSettings,
  NotificationSettings,
} from '@/lib/api/notifications';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('설정을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await updateNotificationSettings(settings);
      toast.success('설정이 저장되었습니다');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('설정 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('설정을 초기화하시겠습니까?')) {
      return;
    }

    try {
      const defaultSettings = await resetNotificationSettings();
      setSettings(defaultSettings);
      toast.success('설정이 초기화되었습니다');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('설정 초기화에 실패했습니다');
    }
  };

  const togglePush = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      pushEnabled: !settings.pushEnabled,
    });
  };

  const toggleEmail = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      emailEnabled: !settings.emailEnabled,
    });
  };

  const toggleNotification = (key: keyof NotificationSettings['notifications']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  // 토글 스위치 컴포넌트
  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-600">설정을 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">알림 설정</h1>
        <p className="text-sm text-gray-600">
          알림 수신 방법과 종류를 설정하세요
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>참고:</strong> 현재 설정은 브라우저에 저장되며, 실제 알림 기능은 향후 추가될 예정입니다.
          </p>
        </div>
      </div>

      {/* 알림 수신 방법 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 수신 방법</h2>

        <div className="space-y-4">
          {/* 푸시 알림 */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900">푸시 알림</h3>
              <p className="text-sm text-gray-600 mt-1">
                브라우저 또는 앱에서 푸시 알림을 받습니다
              </p>
            </div>
            <Toggle enabled={settings.pushEnabled} onChange={togglePush} />
          </div>

          {/* 이메일 알림 */}
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900">이메일 알림</h3>
              <p className="text-sm text-gray-600 mt-1">
                이메일로 알림을 받습니다
              </p>
            </div>
            <Toggle enabled={settings.emailEnabled} onChange={toggleEmail} />
          </div>
        </div>
      </div>

      {/* 알림 종류 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 종류</h2>

        <div className="space-y-3">
          {/* 내 게시글에 댓글 */}
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.boardComment}
              onChange={() => toggleNotification('boardComment')}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                내 게시글에 댓글이 달렸을 때
              </div>
              <div className="text-xs text-gray-600">
                작성한 게시글에 새로운 댓글이 달리면 알림을 받습니다
              </div>
            </div>
          </label>

          {/* 내 게시글에 좋아요 */}
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.boardLike}
              onChange={() => toggleNotification('boardLike')}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                내 게시글에 좋아요가 눌렸을 때
              </div>
              <div className="text-xs text-gray-600">
                다른 사용자가 내 게시글에 좋아요를 누르면 알림을 받습니다
              </div>
            </div>
          </label>

          {/* 내 리뷰에 좋아요 */}
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.reviewLike}
              onChange={() => toggleNotification('reviewLike')}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                내 리뷰에 좋아요가 눌렸을 때
              </div>
              <div className="text-xs text-gray-600">
                다른 사용자가 내 리뷰에 좋아요를 누르면 알림을 받습니다
              </div>
            </div>
          </label>

          {/* 시스템 공지사항 */}
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.systemNotice}
              onChange={() => toggleNotification('systemNotice')}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                시스템 공지사항
              </div>
              <div className="text-xs text-gray-600">
                중요한 시스템 공지사항 및 업데이트 알림을 받습니다
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-between bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={handleReset}
          className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          초기화
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium transition-colors ${
            saving
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary-700'
          }`}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
