// ════════════════════════════════════════
// store/authStore.ts
// Auth state — current user + role
// ════════════════════════════════════════
import { create } from 'zustand';
import type { User } from 'firebase/auth';

type Role = 'user' | 'editor' | 'admin';

interface AuthState {
  user: User | null;
  role: Role;
  ready: boolean;      // true หลัง initial auth check เสร็จ
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setReady: (ready: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'user',
  ready: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setReady: (ready) => set({ ready }),
}));
