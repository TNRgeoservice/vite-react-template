// ════════════════════════════════════════
// src/components/dm/InboxList.tsx
// Realtime list of conversations for current user
// Click → open chat as floating window (no navigation)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useChatWindowsStore } from '@/store/chatWindowsStore';
import type { DMConvo } from '@/types/dm';

export function InboxList() {
  const user = useAuthStore((s) => s.user);
  const openWindow = useChatWindowsStore((s) => s.openWindow);
  const [convos, setConvos] = useState<DMConvo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setConvos([]); setLoading(false); return; }
    // ใช้ array-contains + orderBy(updatedAt) — Firestore auto-index ให้ฟรี
    const q = query(
      collection(db, 'dms'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setConvos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DMConvo, 'id'>) })));
      setLoading(false);
    }, (err) => {
      console.warn('[Inbox]', err);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (!user) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">กรุณาเข้าสู่ระบบ</div>;
  }
  if (loading) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">กำลังโหลด...</div>;
  }
  if (convos.length === 0) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">ยังไม่มีบทสนทนา</div>;
  }

  return (
    <ul className="divide-y divide-[#213045]">
      {convos.map((c) => {
        const unread = c.lastSenderUid !== user.uid && !c.seenBy?.[user.uid];
        const time = c.updatedAt?.toDate ? fmtTime(c.updatedAt.toDate()) : '';
        const preview = (c.lastSenderUid === user.uid ? 'คุณ: ' : '') + (c.lastMessage || '');
        const peer = (c.participants || []).find((p) => p !== user.uid) || '';
        const handleClick = () => {
          if (!peer || !c.plotDocId) return;
          openWindow({
            plotDocId: c.plotDocId,
            peerUid: peer,
            plotName: c.plotName || 'ที่ดิน',
            peerName: '',
          });
        };
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={handleClick}
              className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-[#111c2b]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e2d42] text-sm font-bold text-[#40c4ff]">
                {(c.plotName || '?').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-bold text-[#dce8f5]">{c.plotName || 'ที่ดิน'}</div>
                  <div className="shrink-0 text-[10px] text-[#7a9ab8]">{time}</div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`truncate text-xs ${unread ? 'font-bold text-[#dce8f5]' : 'text-[#7a9ab8]'}`}>
                    {preview || '—'}
                  </div>
                  {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#00e676]" />}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function fmtTime(d: Date) {
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return 'เมื่อกี้';
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + ' นาที';
  if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + ' ชม.';
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}
