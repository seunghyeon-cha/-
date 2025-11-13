'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { clsx } from 'clsx';
import Button from './Button';
import { uploadImages } from '@/lib/api/upload';
import { toast } from '@/stores/toastStore';

interface ImageUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

interface PreviewImage {
  file: File;
  preview: string;
}

const ImageUpload = ({
  onUploadComplete,
  maxFiles = 10,
  maxSizeMB = 5,
  className,
}: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 파일 개수 검증
    if (selectedImages.length + files.length > maxFiles) {
      toast.error(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다`);
      return;
    }

    // 파일 검증 및 미리보기 생성
    const validFiles: PreviewImage[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    files.forEach((file) => {
      // 파일 타입 검증
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name}: 지원하지 않는 파일 형식입니다 (jpg, jpeg, png, gif만 가능)`
        );
        return;
      }

      // 파일 크기 검증
      if (file.size > maxSizeBytes) {
        toast.error(
          `${file.name}: 파일 크기가 너무 큽니다 (최대 ${maxSizeMB}MB)`
        );
        return;
      }

      // 미리보기 URL 생성
      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview });
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      // 메모리 누수 방지를 위해 미리보기 URL 해제
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error('업로드할 이미지를 선택해주세요');
      return;
    }

    setIsUploading(true);

    try {
      const files = selectedImages.map((img) => img.file);
      const response = await uploadImages(files);

      toast.success(`${response.urls.length}개의 이미지가 업로드되었습니다`);

      // 업로드 완료 콜백 실행
      if (onUploadComplete) {
        onUploadComplete(response.urls);
      }

      // 초기화
      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setSelectedImages([]);
    } catch (error) {
      toast.error('이미지 업로드 중 오류가 발생했습니다');
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={clsx('space-y-4', className)}>
      {/* 파일 선택 버튼 */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSelectClick}
          disabled={isUploading || selectedImages.length >= maxFiles}
        >
          이미지 선택
        </Button>
        <span className="text-sm text-gray-500">
          {selectedImages.length} / {maxFiles}
        </span>
      </div>

      {/* 이미지 미리보기 */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                disabled={isUploading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 버튼 */}
      {selectedImages.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          isLoading={isUploading}
          fullWidth
        >
          {isUploading ? '업로드 중...' : '업로드'}
        </Button>
      )}

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500">
        jpg, jpeg, png, gif 형식만 가능 (최대 {maxSizeMB}MB, {maxFiles}개)
      </p>
    </div>
  );
};

export default ImageUpload;
