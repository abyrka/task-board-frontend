import { Comment } from './types';

export interface CommentsSlice {
  fetchTaskComments: (taskId: string) => Promise<void>;
  createComment: (taskId: string, text: string, userId: string) => Promise<Comment>;
  updateComment: (commentId: string, text: string) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
}
