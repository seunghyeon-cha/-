import { apiClient } from './client';

/**
 * 이미지 업로드 응답
 */
export interface UploadImagesResponse {
  urls: string[];
}

/**
 * 이미지 업로드
 */
export const uploadImages = async (
  files: File[]
): Promise<UploadImagesResponse> => {
  const formData = new FormData();

  // 모든 파일을 'images' 필드에 추가
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await apiClient.post<UploadImagesResponse>(
    '/api/api/upload/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
