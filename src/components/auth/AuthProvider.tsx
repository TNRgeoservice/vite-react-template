// ════════════════════════════════════════
// components/auth/AuthProvider.tsx
// Firebase auth listener + role fetch
// Wrap root layout ครั้งเดียว
// ════════════════════════════════════════
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { fsGet } from '@/lib/firestore';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setRole = useAuthStore((s) => s.setRole);
  const setReady = useAuthStore((s) => s.setReady);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await fsGet<{ role?: 'user' | 'editor' | 'admin' }>(
          'users',
          user.uid
        );
        setRole(profile?.role ?? 'user');
      } else {
        setRole('user');
      }
      setReady(true);
    });
    return () => unsub();
  }, [setUser, setRole, setReady]);

  return <>{children}</>;
}
