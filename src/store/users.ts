import { apiClient } from '../api/client';
import { User } from './types';
import { StateCreator } from 'zustand';

export interface UsersSlice {
  users: User[];
  fetchUsers: () => Promise<void>;
  createUser: (name: string, email: string) => Promise<User>;
  updateUser: (id: string, name: string, email: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

type UsersStateCreator = StateCreator<UsersSlice, [], [], UsersSlice>;

export const createUsersSlice: UsersStateCreator = (set) => ({
  users: [],

  fetchUsers: async () => {
    set({ loading: true, error: null } as any);
    try {
      const res = await apiClient.get('/users');
      set({ users: res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch users' } as any);
    } finally {
      set({ loading: false } as any);
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
});
