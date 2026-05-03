// ════════════════════════════════════════
// src/components/cobroker/CobrokerRequestButton.tsx
// Phase 3 D — broker ส่งคำขอเป็น co-broker ให้เจ้าของแปลง
// แสดงเมื่อ: login + ไม่ใช่ owner + ยังไม่มี cobroker doc สำหรับ user นี้กับแปลงนี้
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, where, writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { DIRECT_PLOT_ID, makeConvoId } from '@/types/dm';
import type { Cobroker, CobrokerStatus } from '@/types/cobroker';

interface Props {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  ownerName?: string;
}

export function CobrokerRequestButton({ plotDocId, plotName, ownerUid, ownerName }: Props) {
  const user = useAuthStore((s) => s.user);
  const [existing, setExisting] = useState<Cobroker | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || !plotDocId) return;
    const q = query(
      collection(db, 'cobrokers'),
      where('plotDocId', '==', plotDocId),
      where('brokerUid', '==', user.uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const docSnap = snap.docs[0];
      setExisting(docSnap ? { id: docSnap.id, ...(docSnap.data() as Omit<Cobroker, 'id'>) } : null);
    });
    return unsub;
  }, [user, plotDocId]);

  if (!user) return null;
  if (user.uid === ownerUid) return null;

  // ถ้ามี doc อยู่แล้ว → แสดง state ตาม status
  if (existing) {
    return <StatusPill status={existing.status} direction={existing.direction || 'invite'} />;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontSize: 11, padding: '6px 12px',
          background: '#0d2030', color: '#40c4ff',
          border: '1px solid #40c4ff', borderRadius: 6, cursor: 'pointer',
          fontWeight: 600,
        }}
      >🤝 ขอร่วมขายแปลงนี้</button>
      {open && (
        <RequestModal
          plotDocId={plotDocId}
          plotName={plotName}
          ownerUid={ownerUid}
          ownerName={ownerName || ''}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function StatusPill({ status, direction }: { status: CobrokerStatus; direction: string }) {
  const map: Record<CobrokerStatus, { label: string; bg: string; color: string }> = {
    pending:  { label: direction === 'request' ? 'รอเจ้าของอนุมัติ' : 'รอตอบรับเชิญ', bg: '#ffb300', color: '#0d1520' },
    accepted: { label: '✓ ร่วมขายอยู่',  bg: '#00e676', color: '#001a0a' },
    declined: { label: 'ถูกปฏิเสธ',      bg: '#ef4444', color: '#fff' },
    revoked:  { label: 'ยกเลิกแล้ว',     bg: '#7a9ab8', color: '#0d1520' },
  };
  const m = map[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      background: m.bg, color: m.color,
      padding: '5px 10px', borderRadius: 10,
    }}>{m.label}</span>
  );
}

interface ModalProps {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  ownerName: string;
  onClose: () => void;
}

function RequestModal({ plotDocId, plotName, ownerUid, ownerName, onClose }: ModalProps) {
  const user = useAuthStore((s) => s.user)!;
  const [pct, setPct] = useState(10);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (pct <= 0 || pct > 100) { alert('% ต้องอยู่ระหว่าง 1-100'); return; }
    setBusy(true);
    try {
      // lookup owner name ถ้ายังไม่มี
      let resolvedOwnerName = ownerName;
      if (!resolvedOwnerName) {
        try {
          const snap = await getDoc(doc(db, 'users', ownerUid));
          resolvedOwnerName = (snap.data()?.displayName as string) || 'เจ้าของ';
        } catch {}
      }

      const myName = user.displayName || user.email?.split('@')[0] || 'นายหน้า';
      const myEmail = user.email || '';

      const cobrokerRef = await addDoc(collection(db, 'cobrokers'), {
        plotDocId, plotName,
        ownerUid, ownerName: resolvedOwnerName,
        brokerUid: user.uid,
        brokerEmail: myEmail.toLowerCase(),
        brokerName: myName,
        commissionPct: pct,
        status: 'pending' as CobrokerStatus,
        direction: 'request',
        invitedAt: serverTimestamp(),
        note: note.trim() || '',
      });

      // System DM ไปหา owner — กดเปิดแล้วเห็นทันที + link ไปหน้าอนุมัติ
      try {
        const convoId = makeConvoId(ownerUid, user.uid, DIRECT_PLOT_ID);
        const body = `🤝 ${myName} ขอร่วมขายแปลง "${plotName}" (ขอแบ่ง ${pct}%)\nกดเปิด /broker?tab=requests เพื่ออนุมัติ`;
        const batch = writeBatch(db);
        const msgRef = doc(collection(db, 'dms', convoId, 'messages'));
        const convoRef = doc(db, 'dms', convoId);
        batch.set(msgRef, {
          text: body,
          imageUrls: [],
          senderUid: 'system',
          senderName: 'TNR Cobroker',
          sentAt: serverTimestamp(),
          seenBy: {},
          isSystem: true,
          cobrokerId: cobrokerRef.id,
          actionUrl: '/broker?tab=requests',
        });
        batch.set(convoRef, {
          participants: [ownerUid, user.uid],
          participantUids: { [ownerUid]: true, [user.uid]: true },
          plotDocId: DIRECT_PLOT_ID,
          plotName: 'แชทตรง',
          lastMessage: body.split('\n')[0],
          lastSenderUid: 'system',
          lastSenderName: 'TNR Cobroker',
          updatedAt: serverTimestamp(),
        }, { merge: true });
        await batch.commit();
      } catch (e) { console.warn('[cobroker request DM]', e); }

      // FCM notify
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'cobroker_request',
          toUid: ownerUid,
          fromName: myName,
          plotName,
          title: '🤝 มีคำขอร่วมขาย',
          body: `${myName} ขอร่วมขาย "${plotName}" — แบ่ง ${pct}%`,
          url: '/broker?tab=requests',
          createdAt: serverTimestamp(),
          sent: false,
        });
      } catch {}
      onClose();
    } catch (e) {
      alert('ส่งไม่สำเร็จ: ' + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          background: '#0d1520',
          border: '1px solid #213045', borderRadius: 12,
          padding: 18,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#dce8f5' }}>
          🤝 ขอร่วมขายแปลงนี้
        </div>
        <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 14 }}>
          เสนอตัวเป็นนายหน้าร่วมให้เจ้าของแปลง — ถ้าอนุมัติคุณจะแสดงในหน้าแปลงและรับลูกค้าได้
        </div>

        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          ขอส่วนแบ่งค่าคอม (% ของยอดขาย)
        </label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <input
            type="range" min={1} max={50} value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <input
            type="number" min={1} max={100} value={pct}
            onChange={(e) => setPct(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
            style={{
              width: 60, padding: '6px 8px',
              background: '#111c2b', border: '1px solid #213045',
              borderRadius: 6, color: '#dce8f5', fontSize: 13, textAlign: 'right',
            }}
          />
          <span style={{ fontSize: 13, color: '#7a9ab8' }}>%</span>
        </div>

        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          ข้อความถึงเจ้าของแปลง (ไม่บังคับ)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          placeholder="เช่น มีลูกค้าสนใจอยู่แล้ว / ผลงานที่ผ่านมา"
          rows={3}
          style={{
            width: '100%', padding: '8px 10px', marginBottom: 14,
            background: '#111c2b', border: '1px solid #213045',
            borderRadius: 8, color: '#dce8f5', fontSize: 12,
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={busy}
            style={{
              padding: '8px 14px', fontSize: 12,
              background: 'transparent', color: '#7a9ab8',
              border: '1px solid #213045', borderRadius: 8, cursor: 'pointer',
            }}
          >ยกเลิก</button>
          <button
            onClick={submit}
            disabled={busy}
            style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 700,
              background: '#00e676', color: '#001a0a',
              border: 'none', borderRadius: 8,
              cursor: busy ? 'wait' : 'pointer',
            }}
          >{busy ? 'กำลังส่ง...' : 'ส่งคำขอ'}</button>
        </div>
      </div>
    </div>
  );
}
