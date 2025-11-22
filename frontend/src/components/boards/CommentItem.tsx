'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Comment } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onReply: (parentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  depth?: number;
}

const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUserId === comment.userId;
  const maxDepth = 3; // 최대 대댓글 깊이

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* 사용자 정보 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {comment.user.profileImage ? (
                <Image
                  src={comment.user.profileImage}
                  alt={comment.user.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <span className="text-gray-600 font-semibold">
                  {comment.user.name.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <p className="font-semibold text-gray-900">{comment.user.name}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
                {comment.createdAt !== comment.updatedAt && ' (수정됨)'}
              </p>
            </div>
          </div>

          {/* 작성자 메뉴 */}
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-gray-600 hover:text-gray-900"
              >
                수정
              </button>
              <button
                onClick={() => {
                  if (window.confirm('댓글을 삭제하시겠습니까?')) {
                    onDelete(comment.id);
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 내용 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSubmit}
                className="px-4 py-1.5 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600"
              >
                저장
              </button>
              <button
                onClick={handleEditCancel}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 whitespace-pre-wrap mb-3">
              {comment.content}
            </p>

            {/* 답글 버튼 */}
            {depth < maxDepth && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                답글 쓰기
              </button>
            )}
          </>
        )}
      </div>

      {/* 대댓글 (재귀적으로 렌더링) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
