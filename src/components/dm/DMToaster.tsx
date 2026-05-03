// ════════════════════════════════════════
// src/components/dm/DMToaster.tsx
// In-app toast เมื่อมีข้อความใหม่เข้า (ฟัง Firestore realtime)
// mount ใน root layout
// ════════════════════════════════════════
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { DMConvo } from '@/types/dm';

type Toast = {
  id: string;
  convoId: string;
  plotDocId: string;
  plotName: string;
  senderName: string;
  preview: string;
};

export function DMToaster() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname() || '';
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastMsgMap = useRef<Map<string, number>>(new Map()); // convoId -> updatedAt.seconds
  const initialized = useRef(false);

  useEffect(() => {
    if (!user) {
      lastMsgMap.current.clear();
      initialized.current = false;
      setToasts([]);
      return;
    }
    const q = query(
      collection(db, 'dms'),
      where(`participantUids.${user.uid}`, '==', true),
    );
    const unsub = onSnapshot(q, (snap) => {
      // Pass แรก: บันทึก state ปัจจุบัน ไม่ toast
      if (!initialized.current) {
        snap.docs.forEach((d) => {
          const c = d.data() as Omit<DMConvo, 'id'>;
          const ts = (c.updatedAt as { seconds?: number } | undefined)?.seconds || 0;
          lastMsgMap.current.set(d.id, ts);
        });
        initialized.current = true;
        return;
      }
      // Pass ถัดไป: หา convo ที่ updatedAt ใหม่กว่าที่จำไว้ และคนส่งไม่ใช่ฉัน
      snap.docChanges().forEach((chg) => {
        if (chg.type === 'removed') {
          lastMsgMap.current.delete(chg.doc.id);
          return;
        }
        const c = chg.doc.data() as Omit<DMConvo, 'id'>;
        const ts = (c.updatedAt as { seconds?: number } | undefined)?.seconds || 0;
        const prev = lastMsgMap.current.get(chg.doc.id) || 0;
        lastMsgMap.current.set(chg.doc.id, ts);
        if (ts <= prev) return;
        if (!c.lastSenderUid || c.lastSenderUid === user.uid) return;
        if (c.seenBy?.[user.uid]) return;

        // Skip ถ้ากำลังเปิดแชทนั้นอยู่
        if (pathname.includes(`/inbox/${chg.doc.id}`)) return;
        if (c.plotDocId && pathname.includes(`/plot/${c.plotDocId}`)) return;

        const t: Toast = {
          id: `${chg.doc.id}_${ts}`,
          convoId: chg.doc.id,
          plotDocId: c.plotDocId || '',
          plotName: c.plotName || 'ที่ดิน',
          senderName: c.lastSenderName || 'ผู้ขาย',
          preview: c.lastMessage || '(ส่งรูป)',
        };
        setToasts((prev2) => [...prev2, t]);

        // auto-dismiss หลัง 5 วิ
        setTimeout(() => {
          setToasts((prev2) => prev2.filter((x) => x.id !== t.id));
        }, 5000);
      });
    }, () => { /* ignore */ });
    return () => { unsub(); initialized.current = false; };
  }, [user, pathname]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-[calc(env(safe-area-inset-top)+12px)] z-[2300] flex w-[90%] max-w-[340px] flex-col gap-2">
      {toasts.map((t) => {
        const href = t.plotDocId ? `/plot/${t.plotDocId}?chat=1` : `/inbox/${t.convoId}`;
        return (
          <Link
            key={t.id}
            href={href}
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="pointer-events-auto block rounded-2xl border border-[#213045] bg-[#111c2b] p-3 shadow-2xl transition hover:border-[#00e676]"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0 text-xl">💬</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-[13px] font-bold text-[#00e676]">{t.senderName}</div>
                  <div className="shrink-0 text-[10px] text-[#7a9ab8]">{t.plotName}</div>
                </div>
                <div className="mt-0.5 line-clamp-2 text-[12px] text-[#dce8f5]">{t.preview}</div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setToasts((prev) => prev.filter((x) => x.id !== t.id));
                }}
                className="shrink-0 px-1 text-xs text-[#7a9ab8]"
              >✕</button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
