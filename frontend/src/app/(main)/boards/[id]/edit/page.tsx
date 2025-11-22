'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { getBoardById, updateBoard } from '@/lib/api/boards';
import {
  BoardCategory,
  BOARD_CATEGORY_LABELS,
  UpdateBoardDto,
} from '@/types/board';
import { useAuthStore } from '@/stores/authStore';
import RichTextEditor from '@/components/common/RichTextEditor';
import ImageUpload from '@/components/common/ImageUpload';
import { toast } from '@/stores/toastStore';


export default function EditBoardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<UpdateBoardDto>({
    category: 'FREE',
    title: '',
    content: '',
    images: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBoard = useCallback(async () => {
    try {
      setIsLoading(true);
      const boardData = await getBoardById(params.id);

      // 권한 확인
      if (!user || boardData.userId !== user.id) {
        toast.error('수정 권한이 없습니다');
        router.push(`/boards/${params.id}`);
        return;
      }

      setFormData({
        category: boardData.category,
        title: boardData.title,
        content: boardData.content,
        images: boardData.images || [],
        tags: boardData.boardTags?.map((bt) => bt.tag.name) || [],
      });
    } catch (error) {
      console.error('Failed to fetch board:', error);
      toast.error('게시글을 불러오는데 실패했습니다');
      router.push('/boards');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, user, router]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title || !formData.title.trim()) {
      toast.warning('제목을 입력해주세요');
      return;
    }

    if (formData.title.length < 2) {
      toast.warning('제목은 최소 2자 이상이어야 합니다');
      return;
    }

    if (!formData.content || !formData.content.trim()) {
      toast.warning('내용을 입력해주세요');
      return;
    }

    if (formData.content.length < 10) {
      toast.warning('내용은 최소 10자 이상이어야 합니다');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateBoard(params.id, formData);
      toast.success('게시글이 수정되었습니다');
      router.push(`/boards/${params.id}`);
    } catch (error) {
      console.error('Failed to update board:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || '게시글 수정에 실패했습니다');
      } else {
        toast.error('게시글 수정에 실패했습니다');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">게시글 수정</h1>
          <p className="text-gray-600">게시글을 수정하세요</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as BoardCategory })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(BOARD_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 내용 - 리치 텍스트 에디터 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content || ''}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="게시글 내용을 입력하세요..."
              minHeight="400px"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              이미지 (선택)
            </label>
            <ImageUpload
              onUploadComplete={(urls) =>
                setFormData({
                  ...formData,
                  images: [...(formData.images || []), ...urls],
                })
              }
              maxFiles={10}
            />
            {/* 기존 이미지 표시 */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative w-full h-32">
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: formData.images?.filter((_, i) => i !== index),
                        })
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              태그 (선택)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="태그를 입력하고 추가 버튼을 클릭하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                추가
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
