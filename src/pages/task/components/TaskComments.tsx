import React, { useEffect, useState } from 'react';
import { useCommentsStore, useUsersStore } from '../../../store';
import { useCurrentUser } from '../../../context/CurrentUserContext';
import './TaskComments.scss';

interface TaskCommentsProps {
  taskId: string;
}

interface Comment {
  _id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const { currentUser } = useCurrentUser();
  const users = useUsersStore((s) => s.users);
  const comments = useCommentsStore((s) => s.comments);
  const fetchTaskComments = useCommentsStore((s) => s.fetchTaskComments);
  const createComment = useCommentsStore((s) => s.createComment);
  const updateComment = useCommentsStore((s) => s.updateComment);
  const deleteComment = useCommentsStore((s) => s.deleteComment);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTaskComments(taskId);
  }, [taskId, fetchTaskComments]);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await createComment(taskId, commentText, currentUser._id);
      setCommentText('');
      await fetchTaskComments(taskId);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      await fetchTaskComments(taskId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingText.trim()) return;

    try {
      await updateComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText('');
      await fetchTaskComments(taskId);
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  return (
    <div className="task-comments" onClick={(e) => e.stopPropagation()}>
      <h4>Comments ({comments.length})</h4>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <strong>{getUserName(comment.userId)}</strong>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              
              {editingCommentId === comment._id ? (
                <div className="comment-edit-form">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button
                      className="btn-save-comment"
                      onClick={() => handleUpdateComment(comment._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn-cancel-edit"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="comment-text">{comment.text}</p>
                  {currentUser?._id === comment.userId && (
                    <div className="comment-actions">
                      <button
                        className="btn-edit-comment"
                        onClick={() => handleEditComment(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete-comment"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="comment-form" onClick={(e) => e.stopPropagation()}>
        <textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
        />
        <button
          className="btn-submit-comment"
          onClick={handleAddComment}
          disabled={!commentText.trim() || isSubmitting || !currentUser}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
};

export default TaskComments;
