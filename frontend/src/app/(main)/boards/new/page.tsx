'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { createBoard } from '@/lib/api/boards';
import {
  BoardCategory,
  BOARD_CATEGORY_LABELS,
  CreateBoardDto,
} from '@/types/board';
import { useAuthStore } from '@/stores/authStore';
import RichTextEditor from '@/components/common/RichTextEditor';
import ImageUpload from '@/components/common/ImageUpload';
import { toast } from '@/stores/toastStore';


export default function NewBoardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState<CreateBoardDto>({
    category: 'FREE',
    title: '',
    content: '',
    images: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 확인
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      toast.warning('제목을 입력해주세요');
      return;
    }

    if (formData.title.length < 2) {
      toast.warning('제목은 최소 2자 이상이어야 합니다');
      return;
    }

    if (!formData.content.trim()) {
      toast.warning('내용을 입력해주세요');
      return;
    }

    if (formData.content.length < 10) {
      toast.warning('내용은 최소 10자 이상이어야 합니다');
      return;
    }

    try {
      setIsSubmitting(true);
      const board = await createBoard(formData);
      toast.success('게시글이 작성되었습니다');
      router.push(`/boards/${board.id}`);
    } catch (error) {
      console.error('Failed to create board:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || '게시글 작성에 실패했습니다');
      } else {
        toast.error('게시글 작성에 실패했습니다');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    if (formData.tags && formData.tags.includes(tagInput.trim())) {
      toast.warning('이미 추가된 태그입니다');
      return;
    }

    setFormData({
      ...formData,
      tags: [...(formData.tags || []), tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...urls],
    });
  };

  const categories: BoardCategory[] = [
    'REVIEW',
    'QNA',
    'RESTAURANT',
    'ACCOMMODATION',
    'TOURIST',
    'FREE',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>뒤로가기</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">게시글 작성</h1>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* 카테고리 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData({ ...formData, category })}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.category === category
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {BOARD_CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목을 입력하세요 (최소 2자)"
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length} / 200자
            </p>
          </div>

          {/* 내용 - 리치 텍스트 에디터 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="게시글 내용을 입력하세요... (최소 10자)"
              minHeight="400px"
            />
            <p className="mt-1 text-xs text-gray-500">
              최소 10자 이상 입력해주세요
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              이미지
            </label>
            <ImageUpload onUploadComplete={handleImageUpload} maxFiles={10} />

            {/* 업로드된 이미지 목록 */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">
                  업로드된 이미지 ({formData.images.length}개)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={url}
                          alt={`Uploaded ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images?.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 태그 */}
          <div className="mb-8">
            <label htmlFor="tag" className="block text-sm font-semibold text-gray-900 mb-2">
              태그
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                id="tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="태그를 입력하고 Enter를 누르세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                추가
              </button>
            </div>

            {/* 태그 목록 */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
