// ════════════════════════════════════════
// src/components/reminder/ReminderList.tsx
// แสดง reminders ของ user ปัจจุบัน + ยกเลิกได้ (Phase 2 #7)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot, orderBy,
  doc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { Reminder } from '@/types/reminder';

function fmtDate(ts: { toDate: () => Date } | null | undefined): string {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleString('th-TH', {
    dateStyle: 'medium', timeStyle: 'short',
  });
}

export function ReminderList() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(
      collection(db, 'reminders'),
      where('ownerUid', '==', user.uid),
      orderBy('scheduledAt', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Reminder, 'id'>) })));
        setLoading(false);
      },
      (err) => {
        console.warn('[ReminderList]', err);
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  if (!user) return null;
  if (loading) return <div style={{ fontSize: 12, color: '#7a9ab8' }}>กำลังโหลด...</div>;

  const upcoming = items.filter((r) => !r.sent && !r.cancelled);
  const past     = items.filter((r) => r.sent || r.cancelled).slice(0, 10);

  async function cancel(id: string) {
    await updateDoc(doc(db, 'reminders', id), { cancelled: true });
  }
  async function remove(id: string) {
    await deleteDoc(doc(db, 'reminders', id));
  }

  const Row = ({ r, done }: { r: Reminder; done: boolean }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      background: '#162030', border: '1px solid #213045',
      borderRadius: 10, marginBottom: 6,
      opacity: done ? 0.6 : 1,
    }}>
      <div style={{ fontSize: 18 }}>{done ? (r.sent ? '✅' : '🚫') : '⏰'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#dce8f5',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {r.plotName || 'ที่ดิน'} · {r.peerName || 'อีกฝ่าย'}
        </div>
        <div style={{ fontSize: 11, color: '#7a9ab8' }}>
          {fmtDate(r.scheduledAt)}
        </div>
        {r.note && (
          <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 2 }}>
            📝 {r.note}
          </div>
        )}
      </div>
      {!done && (
        <button onClick={() => cancel(r.id)}
          style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 11,
            border: '1px solid #213045', background: '#0d1520',
            color: '#ff5252', cursor: 'pointer',
          }}
        >ยกเลิก</button>
      )}
      {done && (
        <button onClick={() => remove(r.id)}
          title="ลบออกจากรายการ"
          style={{
            padding: '4px 8px', borderRadius: 6, fontSize: 11,
            border: '1px solid #213045', background: '#0d1520',
            color: '#7a9ab8', cursor: 'pointer',
          }}
        >ลบ</button>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
        ⏰ เตือนคุยต่อ ({upcoming.length})
      </div>
      {upcoming.length === 0 ? (
        <div style={{
          padding: 14, fontSize: 12, color: '#7a9ab8',
          background: '#162030', border: '1px solid #213045',
          borderRadius: 10, textAlign: 'center', marginBottom: 10,
        }}>ยังไม่มีเตือนที่ตั้งไว้</div>
      ) : (
        upcoming.map((r) => <Row key={r.id} r={r} done={false} />)
      )}

      {past.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#7a9ab8', margin: '10px 0 6px' }}>
            ประวัติ
          </div>
          {past.map((r) => <Row key={r.id} r={r} done={true} />)}
        </>
      )}
    </div>
  );
}
