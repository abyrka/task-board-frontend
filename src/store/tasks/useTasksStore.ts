import { create } from 'zustand';
import { apiClient } from '../../api/client';
import { Task } from './types';

interface TaskFilterParams {
  boardId?: string;
  status?: string;
  assigneeId?: string;
  title?: string;
  description?: string;
}

interface TasksStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchBoardTasks: (boardId: string) => Promise<void>;
  fetchFilteredTasks: (filters: TaskFilterParams) => Promise<void>;
  createTask: (boardId: string, title: string, status: string, description?: string, assigneeId?: string, changedByUserId?: string) => Promise<Task>;
  updateTask: (id: string, updates: any, changedByUserId?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchBoardTasks: async (boardId) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/tasks', { params: { boardId } });
      set({ tasks: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      set({ loading: false });
    }
  },

  fetchFilteredTasks: async (filters) => {
    set({ loading: true, error: null });
    try {
      const params: any = {};
      if (filters.boardId) params.boardId = filters.boardId;
      if (filters.status) params.status = filters.status;
      if (filters.assigneeId) params.assigneeId = filters.assigneeId;
      if (filters.title) params.title = filters.title;
      if (filters.description) params.description = filters.description;

      const res = await apiClient.get('/tasks', { params });
      set({ tasks: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (boardId, title, status, description, assigneeId, changedByUserId) => {
    try {
      const res = await apiClient.post('/tasks', {
        boardId,
        title,
        status,
        description,
        assigneeId,
        changedByUserId,
      });
      set((state) => ({ tasks: [...state.tasks, res.data] }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  },

  updateTask: async (id, updates, changedByUserId) => {
    try {
      await apiClient.patch(`/tasks/${id}`, { ...updates, changedByUserId });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  },

  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  },
}));
