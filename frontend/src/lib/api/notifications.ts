/**
 * 알림 설정 API
 * 현재는 로컬 스토리지를 사용하며, 향후 백엔드 API 연동 시 쉽게 전환 가능하도록 설계
 */

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  notifications: {
    boardComment: boolean;    // 내 게시글에 댓글
    boardLike: boolean;        // 내 게시글에 좋아요
    reviewLike: boolean;       // 내 리뷰에 좋아요
    systemNotice: boolean;     // 시스템 공지사항
  };
}

const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  notifications: {
    boardComment: true,
    boardLike: true,
    reviewLike: true,
    systemNotice: true,
  },
};

const STORAGE_KEY = 'notification_settings';

/**
 * 알림 설정 조회
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  // TODO: 향후 백엔드 API 연동
  // const response = await apiClient.get('/api/users/me/notification-settings');
  // return response.data;

  // 현재: 로컬 스토리지 사용
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }

  return DEFAULT_SETTINGS;
};

/**
 * 알림 설정 업데이트
 */
export const updateNotificationSettings = async (
  settings: NotificationSettings
): Promise<NotificationSettings> => {
  // TODO: 향후 백엔드 API 연동
  // const response = await apiClient.put('/api/users/me/notification-settings', settings);
  // return response.data;

  // 현재: 로컬 스토리지에 저장
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    throw error;
  }
};

/**
 * 알림 설정 초기화
 */
export const resetNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to reset notification settings:', error);
    throw error;
  }
};
