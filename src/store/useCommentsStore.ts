import { create } from 'zustand';
import { apiClient } from '../api/client';
import { Comment } from './types';

interface CommentsStore {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchTaskComments: (taskId: string) => Promise<void>;
  createComment: (taskId: string, text: string, userId: string) => Promise<Comment>;
  updateComment: (commentId: string, text: string) => Promise<Comment>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const useCommentsStore = create<CommentsStore>((set) => ({
  comments: [],
  loading: false,
  error: null,

  fetchTaskComments: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/comments', { params: { taskId } });
      set({ comments: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch comments' });
    } finally {
      set({ loading: false });
    }
  },

  createComment: async (taskId, text, userId) => {
    try {
      const res = await apiClient.post('/comments', { taskId, text, userId });
      set((state) => ({ comments: [...state.comments, res.data] }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create comment');
    }
  },

  updateComment: async (commentId, text) => {
    try {
      const res = await apiClient.patch(`/comments/${commentId}`, { text });
      set((state) => ({
        comments: state.comments.map((c) =>
          c._id === commentId ? { ...c, text } : c
        ),
      }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update comment');
    }
  },

  deleteComment: async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((c) => c._id !== commentId),
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete comment');
    }
  },
}));
