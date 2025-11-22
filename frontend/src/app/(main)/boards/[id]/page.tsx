'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getBoardById, toggleBoardLike, checkBoardLike, deleteBoard } from '@/lib/api/boards';
import { getComments } from '@/lib/api/comments';
import { Board, BOARD_CATEGORY_LABELS } from '@/types/board';
import { Comment } from '@/types/comment';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';
import CommentList from '@/components/boards/CommentList';
import RichTextEditor from '@/components/common/RichTextEditor';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function BoardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [board, setBoard] = useState<Board | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 게시글 조회
      const boardData = await getBoardById(params.id);
      setBoard(boardData);

      // 댓글 조회
      const commentsData = await getComments({ boardId: params.id });
      setComments(commentsData);

      // 좋아요 상태 확인 (로그인한 경우만)
      if (isAuthenticated) {
        const likeStatus = await checkBoardLike(params.id);
        setIsLiked(likeStatus.liked);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
      return;
    }

    try {
      const result = await toggleBoardLike(params.id);
      setIsLiked(result.liked);

      // 좋아요 수 업데이트
      if (board) {
        setBoard({
          ...board,
          likesCount: result.liked ? board.likesCount + 1 : board.likesCount - 1,
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      await deleteBoard(params.id);
      toast.success('게시글이 삭제되었습니다');
      router.push('/boards');
    } catch (error) {
      console.error('Failed to delete board:', error);
      toast.error('게시글 삭제에 실패했습니다');
    }
  };

  const handleEdit = () => {
    router.push(`/boards/${params.id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8 animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            게시글을 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/boards')}
            className="text-primary-600 hover:text-primary-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === board.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>뒤로가기</span>
        </button>

        {/* 게시글 */}
        <article className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-semibold">
              {BOARD_CATEGORY_LABELS[board.category]}
            </span>

            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{board.title}</h1>

          {/* 메타 정보 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden">
                {board.user.profileImage ? (
                  <Image
                    src={board.user.profileImage}
                    alt={board.user.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-600 font-semibold text-sm">
                    {board.user.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="font-medium">{board.user.name}</span>
            </div>
            <span>
              {formatDistanceToNow(new Date(board.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
            <span>조회 {board.views || 0}</span>
          </div>

          {/* 본문 - HTML 렌더링 */}
          <div className="prose max-w-none mb-6">
            <RichTextEditor value={board.content} onChange={() => {}} editable={false} />
          </div>

          {/* 이미지 */}
          {board.images && board.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {board.images.map((image, index) => (
                <div key={index} className="relative w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {/* 태그 */}
          {board.boardTags && board.boardTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {board.boardTags.map((boardTag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{boardTag.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 좋아요 */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{board.likesCount}</span>
            </button>
          </div>
        </article>

        {/* 댓글 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <CommentList
            comments={comments}
            boardId={params.id}
            currentUserId={user?.id}
            onCommentsChange={fetchData}
          />
        </div>
      </div>
    </div>
  );
}
