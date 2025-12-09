import { create } from 'zustand';
import { apiClient } from '../../api/client';
import { Board } from './types';

interface BoardsStore {
  boards: Board[];
  loading: boolean;
  error: string | null;
  fetchBoards: (userId: string) => Promise<void>;
  createBoard: (name: string, ownerId: string) => Promise<Board>;
  updateBoard: (id: string, name: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards: [],
  loading: false,
  error: null,

  fetchBoards: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/boards/user/${userId}`);
      set({ boards: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch boards' });
    } finally {
      set({ loading: false });
    }
  },

  createBoard: async (name, ownerId) => {
    try {
      const res = await apiClient.post('/boards', { name, ownerId });
      set((state) => ({ boards: [...state.boards, res.data] }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create board');
    }
  },

  updateBoard: async (id, name) => {
    try {
      await apiClient.patch(`/boards/${id}`, { name });
      set((state) => ({
        boards: state.boards.map((b) => (b._id === id ? { ...b, name } : b)),
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update board');
    }
  },

  deleteBoard: async (id) => {
    try {
      await apiClient.delete(`/boards/${id}`);
      set((state) => ({ boards: state.boards.filter((b) => b._id !== id) }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete board');
    }
  },
}));
