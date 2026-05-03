// ════════════════════════════════════════
// src/components/cobroker/CobrokerRequests.tsx
// Phase 3 D — owner เห็นคำขอจากนายหน้าที่ขอร่วมขาย → อนุมัติ/ปฏิเสธ
// Mount ใน /broker (tab "คำขอร่วมขาย")
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { Cobroker, CobrokerStatus } from '@/types/cobroker';

const statusBadge: Record<CobrokerStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: 'รออนุมัติ',  bg: '#ffb300', color: '#0d1520' },
  accepted: { label: 'อนุมัติแล้ว', bg: '#00e676', color: '#001a0a' },
  declined: { label: 'ปฏิเสธ',     bg: '#ef4444', color: '#fff' },
  revoked:  { label: 'ยกเลิก',     bg: '#7a9ab8', color: '#0d1520' },
};

export function CobrokerRequests() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Cobroker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setItems([]); setLoading(false); return; }
    const q = query(
      collection(db, 'cobrokers'),
      where('ownerUid', '==', user.uid),
      where('direction', '==', 'request'),
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cobroker, 'id'>) }));
      rows.sort((a, b) => {
        const stOrder: Record<CobrokerStatus, number> = { pending: 0, accepted: 1, revoked: 2, declined: 3 };
        if (stOrder[a.status] !== stOrder[b.status]) return stOrder[a.status] - stOrder[b.status];
        return (b.invitedAt?.toMillis?.() ?? 0) - (a.invitedAt?.toMillis?.() ?? 0);
      });
      setItems(rows);
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, [user]);

  async function respond(id: string, status: 'accepted' | 'declined') {
    try {
      await updateDoc(doc(db, 'cobrokers', id), {
        status, respondedAt: serverTimestamp(),
      });
    } catch (e) { alert('ผิดพลาด: ' + (e as Error).message); }
  }

  if (!user) return <div style={{ padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12 }}>กรุณาเข้าสู่ระบบ</div>;
  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12 }}>กำลังโหลด...</div>;
  if (items.length === 0) {
    return (
      <div style={{
        padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12,
        border: '1px dashed #213045', borderRadius: 12,
      }}>
        ยังไม่มีนายหน้าขอร่วมขายแปลงของคุณ
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((c) => {
        const badge = statusBadge[c.status];
        const canRespond = c.status === 'pending';
        return (
          <div key={c.id} style={{
            background: '#1e2d42', border: '1px solid #213045',
            borderRadius: 10, padding: 12,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              gap: 8, marginBottom: 8,
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <Link
                  href={`/plot/${c.plotDocId}`}
                  style={{
                    fontSize: 13, fontWeight: 700, color: '#dce8f5',
                    textDecoration: 'none', display: 'block',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >🏷 {c.plotName}</Link>
                <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 2 }}>
                  จากนายหน้า:{' '}
                  {c.brokerUid ? (
                    <Link href={`/user/${c.brokerUid}`} style={{ color: '#40c4ff', textDecoration: 'none' }}>
                      {c.brokerName || c.brokerEmail}
                    </Link>
                  ) : (c.brokerName || c.brokerEmail)}
                </div>
              </div>
              <span style={{
                background: badge.bg, color: badge.color,
                fontSize: 10, fontWeight: 700,
                padding: '3px 8px', borderRadius: 10, whiteSpace: 'nowrap',
              }}>{badge.label}</span>
            </div>

            <div style={{
              display: 'flex', gap: 12, fontSize: 12, color: '#dce8f5',
              padding: '8px 0', borderTop: '1px solid #213045',
            }}>
              <div>ขอแบ่ง: <strong style={{ color: '#40c4ff' }}>{c.commissionPct}%</strong></div>
            </div>

            {c.note && (
              <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 8 }}>
                📝 {c.note}
              </div>
            )}

            {canRespond && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => respond(c.id, 'declined')}
                  style={{
                    padding: '6px 12px', fontSize: 11,
                    background: 'transparent', color: '#ef4444',
                    border: '1px solid #ef4444', borderRadius: 6, cursor: 'pointer',
                  }}
                >ปฏิเสธ</button>
                <button
                  onClick={() => respond(c.id, 'accepted')}
                  style={{
                    padding: '6px 14px', fontSize: 11, fontWeight: 700,
                    background: '#00e676', color: '#001a0a',
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                  }}
                >อนุมัติ</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
