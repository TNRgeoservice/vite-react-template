// ════════════════════════════════════════
// components/auth/AuthBar.tsx
// Avatar + email + login/logout button (in Drawer)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

const ROLE_LABEL: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ',
  editor: 'ผู้แก้ไข',
  user: 'ผู้ใช้ทั่วไป',
};

export function AuthBar() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);

  // Subscribe to users/{uid} for realtime avatar + displayName
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  useEffect(() => {
    if (!user) { setAvatarUrl(''); setName(''); return; }
    setAvatarUrl(user.photoURL || '');
    setName(user.displayName || '');
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const d = snap.exists() ? snap.data() : {};
      if (d.avatarUrl) setAvatarUrl(d.avatarUrl);
      if (d.displayName) setName(d.displayName);
    });
    return unsub;
  }, [user]);

  const initial = (name || user?.email || '?')[0].toUpperCase();

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="flex items-center gap-3 border-b border-[#213045] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e2d42] text-lg font-semibold text-[#00e676]">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-[#dce8f5]">
          {user ? (name || user.email) : 'ยังไม่ได้เข้าสู่ระบบ'}
        </div>
        <div className="text-xs text-[#7a9ab8]">
          {user ? ROLE_LABEL[role] || role : 'โหมดดูข้อมูล (view only)'}
        </div>
      </div>
      {user ? (
        <button
          onClick={handleLogout}
          className="rounded-lg bg-[#ff5252]/15 px-3 py-1.5 text-xs font-medium text-[#ff5252]"
        >
          ออกจากระบบ
        </button>
      ) : (
        <button
          onClick={() => setLoginOpen(true)}
          className="rounded-lg bg-[#00e676] px-3 py-1.5 text-xs font-semibold text-black"
        >
          เข้าสู่ระบบ
        </button>
      )}
    </div>
  );
}
