// ════════════════════════════════════════
// src/components/rating/RatingModal.tsx
// Phase 4 #14 — buyer ให้ดาวนายหน้า/เจ้าของ หลัง pipeline=closed
// เลือกได้ว่า rate ใคร: owner หรือ co-broker (accepted)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { makeRatingId, type AgentRating } from '@/types/rating';
import type { Cobroker } from '@/types/cobroker';

interface Props {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  onClose: () => void;
}

interface AgentOption {
  uid: string;
  name: string;
  role: string;
  rated?: boolean;
}

export function RatingModal({ plotDocId, plotName, ownerUid, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [selectedUid, setSelectedUid] = useState<string>('');
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // build agent list (owner + accepted brokers) + ตรวจว่าเคย rate แล้วหรือยัง
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const list: AgentOption[] = [];
      // owner
      try {
        const snap = await getDoc(doc(db, 'users', ownerUid));
        list.push({
          uid: ownerUid,
          name: (snap.data()?.displayName as string) || 'เจ้าของแปลง',
          role: 'เจ้าของแปลง',
        });
      } catch {
        list.push({ uid: ownerUid, name: 'เจ้าของแปลง', role: 'เจ้าของแปลง' });
      }
      // accepted co-brokers
      try {
        const cbSnap = await onSnapshotOnce(
          query(collection(db, 'cobrokers'),
            where('plotDocId', '==', plotDocId),
            where('status', '==', 'accepted'))
        );
        cbSnap.forEach((c) => {
          if (c.brokerUid && c.brokerUid !== ownerUid) {
            list.push({
              uid: c.brokerUid,
              name: c.brokerName || c.brokerEmail || 'นายหน้า',
              role: 'นายหน้าร่วม',
            });
          }
        });
      } catch {}
      // ตรวจ rated
      const checked = await Promise.all(list.map(async (a) => {
        const id = makeRatingId(user.uid, a.uid, plotDocId);
        try {
          const r = await getDoc(doc(db, 'ratings', id));
          return { ...a, rated: r.exists() };
        } catch { return a; }
      }));
      if (cancelled) return;
      setAgents(checked);
      const firstAvail = checked.find((a) => !a.rated && a.uid !== user.uid);
      if (firstAvail) setSelectedUid(firstAvail.uid);
    })();
    return () => { cancelled = true; };
  }, [user, ownerUid, plotDocId]);

  async function submit() {
    if (!user) return;
    if (!selectedUid) { setMsg('เลือกผู้ที่จะให้ดาวก่อน'); return; }
    if (stars < 1 || stars > 5) return;
    setBusy(true);
    setMsg('');
    try {
      const id = makeRatingId(user.uid, selectedUid, plotDocId);
      const ratingData: Omit<AgentRating, 'id'> = {
        agentUid: selectedUid,
        raterUid: user.uid,
        raterName: user.displayName || user.email?.split('@')[0] || 'ผู้ใช้',
        plotDocId,
        plotName,
        stars,
        comment: comment.trim().slice(0, 500),
        createdAt: serverTimestamp() as any,
      };
      await setDoc(doc(db, 'ratings', id), ratingData);
      setMsg('✅ ขอบคุณสำหรับรีวิว');
      setTimeout(onClose, 1500);
    } catch (e) {
      setMsg('❌ ' + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 380,
        background: '#0d1520', border: '1px solid #213045',
        borderRadius: 12, padding: 18,
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
          ⭐ ให้คะแนนนายหน้า
        </div>
        <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 14 }}>
          แปลง: {plotName}
        </div>

        {/* Agent picker */}
        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 6 }}>
          เลือกผู้ที่จะให้คะแนน
        </label>
        <div style={{
          maxHeight: 180, overflowY: 'auto', marginBottom: 14,
          border: '1px solid #213045', borderRadius: 8, background: '#111c2b',
        }}>
          {agents.length === 0 && (
            <div style={{ padding: 12, fontSize: 12, color: '#7a9ab8' }}>กำลังโหลด...</div>
          )}
          {agents.map((a) => {
            const disabled = a.rated || a.uid === user?.uid;
            return (
              <label key={a.uid} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', cursor: disabled ? 'not-allowed' : 'pointer',
                borderBottom: '1px solid #213045', opacity: disabled ? 0.5 : 1,
              }}>
                <input
                  type="radio" name="agent-pick"
                  value={a.uid}
                  disabled={disabled}
                  checked={selectedUid === a.uid}
                  onChange={() => setSelectedUid(a.uid)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: '#7a9ab8' }}>
                    {a.role}{a.rated ? ' · ให้คะแนนแล้ว' : a.uid === user?.uid ? ' · คุณ' : ''}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Stars */}
        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 6 }}>
          คะแนน
        </label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, fontSize: 28 }}>
          {[1,2,3,4,5].map((n) => (
            <button
              key={n}
              onClick={() => setStars(n)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: n <= stars ? '#ffb300' : '#213045',
                lineHeight: 1,
              }}
              title={`${n} ดาว`}
            >★</button>
          ))}
          <span style={{ marginLeft: 6, fontSize: 12, alignSelf: 'center', color: '#7a9ab8' }}>
            ({stars}/5)
          </span>
        </div>

        {/* Comment */}
        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          ความคิดเห็น (ไม่บังคับ)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder="ตอบเร็ว ชัดเจน เช็คข้อมูลให้ ฯลฯ"
          rows={3}
          style={{
            width: '100%', padding: '8px 10px', marginBottom: 14,
            background: '#111c2b', border: '1px solid #213045',
            borderRadius: 8, color: '#dce8f5', fontSize: 12,
            resize: 'vertical',
          }}
        />

        {msg && <div style={{ fontSize: 11, marginBottom: 10, color: msg.startsWith('✅') ? '#00e676' : '#ef4444' }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={busy} style={{
            padding: '8px 14px', fontSize: 12,
            background: 'transparent', color: '#7a9ab8',
            border: '1px solid #213045', borderRadius: 8, cursor: 'pointer',
          }}>ปิด</button>
          <button onClick={submit} disabled={busy || !selectedUid} style={{
            padding: '8px 16px', fontSize: 12, fontWeight: 700,
            background: '#00e676', color: '#001a0a',
            border: 'none', borderRadius: 8,
            cursor: busy ? 'wait' : 'pointer',
            opacity: selectedUid ? 1 : 0.5,
          }}>{busy ? 'กำลังส่ง...' : 'ส่งรีวิว'}</button>
        </div>
      </div>
    </div>
  );
}

// helper: getDocs onceShot
async function onSnapshotOnce(q: any): Promise<Cobroker[]> {
  const { getDocs } = await import('firebase/firestore');
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}
