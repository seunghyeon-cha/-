'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImages } from '@/lib/api/upload';
import { toast } from '@/stores/toastStore';

interface ProfileImageUploadProps {
  currentImage: string | null;
  userName: string;
  onImageChange: (imageUrl: string) => void;
}

export default function ProfileImageUpload({
  currentImage,
  userName,
  onImageChange,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.warning('이미지 파일만 업로드 가능합니다');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    // 미리보기 설정
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 이미지 업로드
    try {
      setUploading(true);
      const response = await uploadImages([file]);
      if (response.urls && response.urls.length > 0) {
        onImageChange(response.urls[0]);
        toast.success('이미지가 업로드되었습니다');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('이미지 업로드에 실패했습니다');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 프로필 이미지 */}
      <div
        onClick={handleClick}
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 border-white shadow-lg"
      >
        {preview ? (
          <Image
            src={preview}
            alt={userName}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white text-5xl font-bold">
            {getInitial()}
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
          <div className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                <span>업로드 중...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">📷</span>
                <span>변경</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 파일 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* 안내 텍스트 */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        클릭하여 프로필 사진 변경
        <br />
        <span className="text-xs text-gray-500">
          (JPG, PNG, GIF / 최대 5MB)
        </span>
      </p>
    </div>
  );
}
