// ════════════════════════════════════════
// src/hooks/useUnreadDM.ts
// นับจำนวน conversation ที่มีข้อความใหม่ (unread) ของ user ปัจจุบัน
// logic: lastSenderUid !== me && !seenBy[me]
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { DMConvo } from '@/types/dm';

export function useUnreadDM(): number {
  const user = useAuthStore((s) => s.user);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) { setCount(0); return; }
    const q = query(
      collection(db, 'dms'),
      where(`participantUids.${user.uid}`, '==', true),
    );
    const unsub = onSnapshot(q, (snap) => {
      let n = 0;
      snap.docs.forEach((d) => {
        const c = d.data() as Omit<DMConvo, 'id'>;
        if (c.lastSenderUid && c.lastSenderUid !== user.uid && !c.seenBy?.[user.uid]) n++;
      });
      setCount(n);
    }, () => setCount(0));
    return unsub;
  }, [user]);

  return count;
}
