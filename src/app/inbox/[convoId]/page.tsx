// ════════════════════════════════════════
// src/app/inbox/[convoId]/page.tsx
// Single conversation — parses convoId (uidA_uidB_plotDocId)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { ChatView } from '@/components/dm/ChatView';
import type { DMConvo } from '@/types/dm';

export default function ConvoPage() {
  const params = useParams();
  const router = useRouter();
  const convoId = typeof params?.convoId === 'string' ? params.convoId : '';
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const [convo, setConvo] = useState<DMConvo | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    if (!ready || !user || !convoId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'dms', convoId));
        if (!snap.exists()) { setErr('ไม่พบบทสนทนา'); setLoading(false); return; }
        const d = snap.data() as Omit<DMConvo, 'id'>;
        if (!d.participantUids?.[user.uid]) { setErr('ไม่มีสิทธิ์เข้าถึง'); setLoading(false); return; }
        // Desktop: redirect ไปหน้า /plot/{id}?chat=1 เพื่อให้ PlotChatDrawer จัดการเป็น floating window
        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches && d.plotDocId) {
          router.replace(`/plot/${d.plotDocId}?chat=1`);
          return;
        }
        setConvo({ id: convoId, ...d });
        setLoading(false);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : 'โหลดไม่สำเร็จ');
        setLoading(false);
      }
    })();
  }, [ready, user, convoId, router]);

  if (!ready) return null;
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d1520] p-6 text-center text-sm text-[#7a9ab8]">
        กรุณาเข้าสู่ระบบ
      </main>
    );
  }
  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0d1520] text-xs text-[#7a9ab8]">กำลังโหลด...</main>;
  }
  if (err || !convo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0d1520] p-6 text-center">
        <div className="text-sm text-[#dc2626]">{err || 'ไม่พบบทสนทนา'}</div>
        <Link href="/inbox" className="rounded-lg border border-[#213045] px-4 py-2 text-xs text-[#dce8f5]">← กลับ</Link>
      </main>
    );
  }

  // Determine the "other" participant
  const otherUid = (convo.participants || []).find((u) => u !== user.uid) || '';

  return (
    <main className="flex h-screen flex-col bg-[#0d1520] text-[#dce8f5]">
      <header className="flex items-center gap-3 border-b border-[#213045] px-3 py-3">
        <Link href="/inbox" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#213045] text-base">
          ←
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-[#dce8f5]">{convo.plotName || 'ที่ดิน'}</div>
          <div className="truncate text-[10px] text-[#7a9ab8]">
            {convo.lastSenderName ? `กับ ${convo.lastSenderUid === user.uid ? '...' : convo.lastSenderName}` : ''}
          </div>
        </div>
        {convo.plotDocId && (
          <Link
            href={`/plot/${convo.plotDocId}`}
            className="shrink-0 rounded-lg border border-[#213045] bg-[#0d1520] px-3 py-1.5 text-[11px] text-[#40c4ff]"
          >ดูแปลง</Link>
        )}
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatView
          plotDocId={convo.plotDocId}
          sellerUid={otherUid}
          plotName={convo.plotName}
        />
      </div>
    </main>
  );
}
