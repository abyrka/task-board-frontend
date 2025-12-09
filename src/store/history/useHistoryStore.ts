import { create } from 'zustand';
import { apiClient } from '../../api/client';
import { HistoryLog } from './types';

interface HistoryStore {
  historyLogs: HistoryLog[];
  loading: boolean;
  error: string | null;
  fetchTaskHistory: (taskId: string) => Promise<void>;
  fetchUserHistory: (userId: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  historyLogs: [],
  loading: false,
  error: null,

  fetchTaskHistory: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/history?taskId=${taskId}`);
      set({ historyLogs: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch history' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserHistory: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/history/user/${userId}`);
      set({ historyLogs: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch user history' });
    } finally {
      set({ loading: false });
    }
  },
}));
