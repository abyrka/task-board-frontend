import { apiClient } from '../api/client';
import { Board } from './types';
import { StateCreator } from 'zustand';

export interface BoardsSlice {
  boards: Board[];
  fetchBoards: () => Promise<void>;
  createBoard: (name: string, ownerId: string) => Promise<Board>;
  updateBoard: (id: string, name: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
}

type BoardsStateCreator = StateCreator<BoardsSlice, [], [], BoardsSlice>;

export const createBoardsSlice: BoardsStateCreator = (set) => ({
  boards: [],

  fetchBoards: async () => {
    set({ loading: true, error: null } as any);
    try {
      const res = await apiClient.get('/boards');
      set({ boards: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch boards' } as any);
    } finally {
      set({ loading: false } as any);
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
});
