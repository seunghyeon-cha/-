'use client';

import { useState } from 'react';
import CommentItem from './CommentItem';
import { Comment, CreateCommentDto } from '@/types/comment';
import { createComment, updateComment, deleteComment } from '@/lib/api/comments';
import { toast } from '@/stores/toastStore';

interface CommentListProps {
  comments: Comment[];
  boardId: string;
  currentUserId?: string;
  onCommentsChange: () => void;
}

const CommentList = ({
  comments,
  boardId,
  currentUserId,
  onCommentsChange,
}: CommentListProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 댓글 트리 구조 생성
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // 모든 댓글을 Map에 저장
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 트리 구조 생성
    comments.forEach((comment) => {
      const commentNode = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(commentNode);
        }
      } else {
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  // 새 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.warning('댓글 내용을 입력해주세요');
      return;
    }

    try {
      setIsSubmitting(true);
      const data: CreateCommentDto = {
        boardId,
        content: newComment,
      };
      await createComment(data);
      setNewComment('');
      toast.success('댓글이 작성되었습니다');
      onCommentsChange();
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error('댓글 작성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 답글 작성
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim() || !replyToId) {
      toast.warning('답글 내용을 입력해주세요');
      return;
    }

    try {
      setIsSubmitting(true);
      const data: CreateCommentDto = {
        boardId,
        parentId: replyToId,
        content: replyContent,
      };
      await createComment(data);
      setReplyContent('');
      setReplyToId(null);
      toast.success('답글이 작성되었습니다');
      onCommentsChange();
    } catch (error) {
      console.error('Failed to create reply:', error);
      toast.error('답글 작성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, { content });
      toast.success('댓글이 수정되었습니다');
      onCommentsChange();
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('댓글 수정에 실패했습니다');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success('댓글이 삭제되었습니다');
      onCommentsChange();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('댓글 삭제에 실패했습니다');
    }
  };

  return (
    <div className="space-y-6">
      {/* 댓글 수 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          댓글 {comments.length}개
        </h3>
      </div>

      {/* 새 댓글 작성 */}
      {currentUserId && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      )}

      {/* 댓글 목록 */}
      {commentTree.length > 0 ? (
        <div className="space-y-4">
          {commentTree.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                onReply={setReplyToId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* 답글 입력 폼 */}
              {replyToId === comment.id && currentUserId && (
                <form
                  onSubmit={handleSubmitReply}
                  className="ml-8 md:ml-12 mt-3 space-y-2"
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="답글을 입력하세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !replyContent.trim()}
                      className="px-4 py-1.5 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 disabled:opacity-50"
                    >
                      {isSubmitting ? '작성 중...' : '답글 작성'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyToId(null);
                        setReplyContent('');
                      }}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">첫 번째 댓글을 작성해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default CommentList;
