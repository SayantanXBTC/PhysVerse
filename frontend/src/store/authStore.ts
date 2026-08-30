import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const hasToken = () => typeof window !== 'undefined' && !!localStorage.getItem('token');

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: hasToken(),
      setUser: (user) => set({ user, isAuthenticated: !!user && hasToken() }),
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        // If no auth token, drop any persisted user — never show stale identity
        if (!state) return;
        if (!hasToken()) {
          state.user = null;
          state.isAuthenticated = false;
        }
      }
    }
  )
);
