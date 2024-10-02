import { create } from 'zustand';
import { APPWRITE_CLIENT } from '@/lib/appwrite';
import { ID, Models } from 'appwrite';

const { account } = APPWRITE_CLIENT;

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });

      await account.create(ID.unique(), email, password, name);

      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      set({ user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });

      await account.deleteSession('current');

      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });

      const user = await account.get();

      set({ user, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ user: null, isLoading: false });
    }
  },
}));
