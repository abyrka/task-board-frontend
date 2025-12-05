import { create } from 'zustand';
import { apiClient } from '../api/client';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  boardId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
}

interface Board {
  _id: string;
  name: string;
  ownerId: string;
  members?: string[];
  tasks?: Task[];
}

interface BoardStore {
  users: User[];
  boards: Board[];
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Users
  fetchUsers: () => Promise<void>;
  createUser: (name: string, email: string) => Promise<User>;

  // Boards
  fetchBoards: () => Promise<void>;
  createBoard: (name: string, ownerId: string) => Promise<Board>;
  deleteBoard: (id: string) => Promise<void>;

  // Tasks
  fetchBoardTasks: (boardId: string) => Promise<void>;
  createTask: (boardId: string, title: string, status: string, assigneeId?: string) => Promise<Task>;
  updateTask: (id: string, updates: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  users: [],
  boards: [],
  tasks: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/users');
      set({ users: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch users' });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (name, email) => {
    try {
      const res = await apiClient.post('/users', { name, email });
      set((state) => ({ users: [...state.users, res.data] }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create user');
    }
  },

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/boards');
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

  deleteBoard: async (id) => {
    try {
      await apiClient.delete(`/boards/${id}`);
      set((state) => ({ boards: state.boards.filter((b) => b._id !== id) }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete board');
    }
  },

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
}));