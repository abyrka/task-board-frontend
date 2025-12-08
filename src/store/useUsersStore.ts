import { create } from 'zustand';
import { apiClient } from '../api/client';
import { User } from './types';

interface UsersStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (name: string, email: string) => Promise<User>;
  updateUser: (id: string, name: string, email: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
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

  updateUser: async (id, name, email) => {
    try {
      await apiClient.patch(`/users/${id}`, { name, email });
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? { ...u, name, email } : u)),
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update user');
    }
  },

  deleteUser: async (id) => {
    try {
      await apiClient.delete(`/users/${id}`);
      set((state) => ({ users: state.users.filter((u) => u._id !== id) }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete user');
    }
  },
}));
