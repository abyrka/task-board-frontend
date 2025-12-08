import React, { useEffect, useState } from 'react';
import { useCommentsStore, useTasksStore, useUsersStore } from '../store';
import { useCurrentUser } from '../context/CurrentUserContext';
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
  const tasks = useTasksStore((s) => s.tasks);
  const users = useUsersStore((s) => s.users);
  const fetchTaskComments = useCommentsStore((s) => s.fetchTaskComments);
  const createComment = useCommentsStore((s) => s.createComment);
  const deleteComment = useCommentsStore((s) => s.deleteComment);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = tasks.find((t) => t._id === taskId);
  const comments = task?.comments || [];

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

  return (
    <div className="task-comments">
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
              <p className="comment-text">{comment.text}</p>
              {currentUser?._id === comment.userId && (
                <button
                  className="btn-delete-comment"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="comment-form">
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
