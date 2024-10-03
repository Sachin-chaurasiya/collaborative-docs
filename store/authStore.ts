import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APPWRITE_CLIENT } from '@/lib/appwrite';
import { ID, Models } from 'appwrite';
import { syncUserWithPermit } from '@/app/actions';

const { account } = APPWRITE_CLIENT;

const ERROR_TIMEOUT = 8000;

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,
      session: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          await account.createEmailPasswordSession(email, password);

          const session = await account.getSession('current');

          const user = await account.get();

          set({ user, isLoading: false, session });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      register: async (email, password, name) => {
        try {
          set({ isLoading: true, error: null });

          await account.create(ID.unique(), email, password, name);

          await account.createEmailPasswordSession(email, password);

          const session = await account.getSession('current');

          const user = await account.get();

          set({ user, isLoading: false, session });

          // sync user with permit.io
          await syncUserWithPermit({ email: user.email, key: user.email });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await account.deleteSession('current');

          set({ user: null, isLoading: false, session: null });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          const user = await account.get();
          const session = await account.getSession('current');

          set({ user, session });
        } catch (error) {
          console.error("Couldn't get user", (error as Error).message);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'collabdocs-session', // name of item in the storage (must be unique)
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);
