import { apiClient } from '../api/client';
import { Task } from './types';
import { StateCreator } from 'zustand';

export interface TasksSlice {
  tasks: Task[];
  fetchBoardTasks: (boardId: string) => Promise<void>;
  createTask: (boardId: string, title: string, status: string, assigneeId?: string) => Promise<Task>;
  updateTask: (id: string, updates: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

type TasksStateCreator = StateCreator<TasksSlice, [], [], TasksSlice>;

export const createTasksSlice: TasksStateCreator = (set) => ({
  tasks: [],

  fetchBoardTasks: async (boardId) => {
    set({ loading: true, error: null } as any);
    try {
      const res = await apiClient.get('/tasks', { params: { boardId } });
      set({ tasks: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks' } as any);
    } finally {
      set({ loading: false } as any);
    }
  },

  createTask: async (boardId, title, status, assigneeId) => {
    try {
      const res = await apiClient.post('/tasks', {
        boardId,
        title,
        status,
        assigneeId,
      });
      set((state) => ({ tasks: [...state.tasks, res.data] }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  },

  updateTask: async (id, updates) => {
    try {
      await apiClient.patch(`/tasks/${id}`, updates);
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
});
