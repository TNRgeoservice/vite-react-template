// ════════════════════════════════════════
// src/components/cobroker/SharedListings.tsx
// Phase 3 B — broker เห็นแปลงที่ตัวเองร่วมขาย (accepted) รวมที่เดียว
// Mount ใน /broker (tab "แปลงที่ร่วมขาย")
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection, doc, getDoc, onSnapshot, query, where,
} from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { Cobroker } from '@/types/cobroker';
import type { PlotPoint } from '@/types/plot';

interface Row extends Cobroker {
  plot?: PlotPoint;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

export function SharedListings() {
  const user = useAuthStore((s) => s.user);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRows([]); setLoading(false); return; }

    const q1 = query(
      collection(db, 'cobrokers'),
      where('brokerUid', '==', user.uid),
      where('status', '==', 'accepted'),
    );
    let arr: Cobroker[] = [];
    let arr2: Cobroker[] = [];
    const merge = async () => {
      const map = new Map<string, Cobroker>();
      [...arr, ...arr2].forEach((c) => map.set(c.id, c));
      const list = Array.from(map.values());
      // hydrate plots
      const hydrated: Row[] = await Promise.all(list.map(async (c) => {
        try {
          const snap = await getDoc(doc(db, COL, c.plotDocId));
          return snap.exists()
            ? { ...c, plot: { id: snap.id, ...(snap.data() as Record<string, unknown>) } as PlotPoint }
            : { ...c };
        } catch { return { ...c }; }
      }));
      hydrated.sort((a, b) => (b.invitedAt?.toMillis?.() ?? 0) - (a.invitedAt?.toMillis?.() ?? 0));
      setRows(hydrated);
      setLoading(false);
    };

    const unsub1 = onSnapshot(q1, (snap) => {
      arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cobroker, 'id'>) }));
      merge();
    }, () => setLoading(false));

    let unsub2 = () => {};
    if (user.email) {
      const q2 = query(
        collection(db, 'cobrokers'),
        where('brokerEmail', '==', user.email.toLowerCase()),
        where('status', '==', 'accepted'),
      );
      unsub2 = onSnapshot(q2, (snap) => {
        arr2 = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cobroker, 'id'>) }));
        merge();
      }, () => {});
    }
    return () => { unsub1(); unsub2(); };
  }, [user]);

  if (!user) return <div style={{ padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12 }}>กรุณาเข้าสู่ระบบ</div>;
  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12 }}>กำลังโหลด...</div>;
  if (rows.length === 0) {
    return (
      <div style={{
        padding: 32, textAlign: 'center', color: '#7a9ab8', fontSize: 12,
        border: '1px dashed #213045', borderRadius: 12,
      }}>
        ยังไม่มีแปลงที่คุณร่วมขาย — ขอร่วมขายแปลงของคนอื่น หรือรอเจ้าของแปลงเชิญ
      </div>
    );
  }

  const totalValue = rows.reduce((s, r) => s + (Number(r.plot?.priceTotal) || 0), 0);
  const expectedCommission = rows.reduce((s, r) => {
    const p = Number(r.plot?.priceTotal) || 0;
    return s + p * (r.commissionPct / 100);
  }, 0);

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12,
      }}>
        <div style={{ background: '#1e2d42', padding: 12, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#7a9ab8' }}>📋 แปลงร่วมขาย</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#40c4ff', marginTop: 2 }}>
            {rows.length} แปลง
          </div>
        </div>
        <div style={{ background: '#1e2d42', padding: 12, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#7a9ab8' }}>💰 มูลค่ารวม</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#b388ff', marginTop: 2 }}>
            {fmt(totalValue)} ฿
          </div>
        </div>
        <div style={{ gridColumn: 'span 2', background: '#1e2d42', padding: 12, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: '#7a9ab8' }}>🎯 ค่าคอมที่คาดหวัง (ถ้าขายได้ทั้งหมด)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#00e676', marginTop: 2 }}>
            {fmt(Math.round(expectedCommission))} ฿
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r) => {
          const status = r.plot?.status || 'available';
          const statusBg = { available: '#00e676', reserved: '#ffb300', sold: '#ff5252' };
          const statusTx = { available: '#001a0a', reserved: '#0d1520', sold: '#fff' };
          const statusLabel = { available: 'ว่าง', reserved: 'จอง', sold: 'ขายแล้ว' }[status];
          const price = r.plot?.priceTotal ? fmt(Number(r.plot.priceTotal)) + ' ฿' : '–';
          const myShare = r.plot?.priceTotal
            ? Math.round(Number(r.plot.priceTotal) * r.commissionPct / 100)
            : 0;
          const img = r.plot?.photos?.[0] || r.plot?.photoUrls?.[0];
          return (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#1e2d42', padding: 12, borderRadius: 10,
            }}>
              {img ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={img} alt="" style={{ width: 54, height: 54, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 54, height: 54, borderRadius: 6, background: '#213045',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>🗺</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#dce8f5',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{r.plotName}</div>
                <div style={{ fontSize: 11, color: '#7a9ab8' }}>
                  จากเจ้าของ: {r.ownerName}
                </div>
                <div style={{ fontSize: 11, color: '#dce8f5', marginTop: 2 }}>
                  💰 {price} · ส่วนแบ่ง <strong style={{ color: '#40c4ff' }}>{r.commissionPct}%</strong>
                  {myShare > 0 && (
                    <span style={{ color: '#00e676' }}> (~{fmt(myShare)} ฿)</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
                  background: statusBg[status], color: statusTx[status], whiteSpace: 'nowrap',
                }}>{statusLabel}</span>
                <Link
                  href={`/plot/${r.plotDocId}`}
                  style={{
                    background: '#213045', color: '#40c4ff',
                    padding: '4px 10px', fontSize: 10,
                    borderRadius: 6, textDecoration: 'none',
                  }}
                >ดูแปลง</Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
