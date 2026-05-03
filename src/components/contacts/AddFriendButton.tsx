// ════════════════════════════════════════
// src/components/contacts/AddFriendButton.tsx
// Client button: เพิ่มเพื่อน / รอตอบรับ / เป็นเพื่อนแล้ว / รับคำขอ
// Mount ในหน้า /user/[uid]
// ════════════════════════════════════════
'use client';

import { useMemo, useState } from 'react';
import {
  collection, doc, getDocs, query, serverTimestamp, setDoc, where,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useFriends } from '@/hooks/useFriends';
import { makeFriendshipId } from '@/types/friendship';

interface Props {
  targetUid: string;
  targetName: string;
}

export function AddFriendButton({ targetUid, targetName }: Props) {
  const user = useAuthStore((s) => s.user);
  const { friends, incoming, outgoing, accept, decline, remove, loading } = useFriends();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>('');

  const state = useMemo(() => {
    if (!user) return 'guest' as const;
    if (user.uid === targetUid) return 'self' as const;
    const id = makeFriendshipId(user.uid, targetUid);
    if (friends.find((f) => f.id === id)) return 'friend' as const;
    if (incoming.find((f) => f.id === id)) return 'incoming' as const;
    if (outgoing.find((f) => f.id === id)) return 'outgoing' as const;
    return 'none' as const;
  }, [user, targetUid, friends, incoming, outgoing]);

  if (!user || state === 'self') return null;

  async function sendByUid() {
    if (!user) return;
    setBusy(true); setMsg('');
    try {
      // ดึง email/displayName ของ target จาก users (เพื่อ denormalize)
      const us = await getDocs(query(collection(db, 'users'), where('__name__', '==', targetUid)));
      const data = us.docs[0]?.data() || {};
      const tEmail = (data.email as string) || '';
      const tName = (data.displayName as string) || targetName || 'ผู้ใช้';
      const [a, b] = [user.uid, targetUid].sort();
      const myName = user.displayName || user.email?.split('@')[0] || 'ผู้ใช้';
      const myEmail = (user.email || '').toLowerCase();
      const id = makeFriendshipId(user.uid, targetUid);
      await setDoc(doc(db, 'friendships', id), {
        uidA: a, uidB: b, requesterUid: user.uid,
        status: 'pending', createdAt: serverTimestamp(),
        uidAName: a === user.uid ? myName : tName,
        uidBName: b === user.uid ? myName : tName,
        uidAEmail: a === user.uid ? myEmail : tEmail,
        uidBEmail: b === user.uid ? myEmail : tEmail,
      });
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'friend_request',
          toUid: targetUid,
          fromName: myName,
          title: '👥 คำขอเป็นเพื่อนใหม่',
          body: `${myName} ขอเพิ่มคุณเป็นเพื่อน`,
          url: '/contacts?tab=incoming',
          createdAt: serverTimestamp(),
          sent: false,
        });
      } catch {/* notify optional */}
      setMsg('ส่งคำขอแล้ว');
    } catch (e) {
      setMsg('ผิดพลาด: ' + (e as Error).message);
    } finally { setBusy(false); }
  }

  const id = makeFriendshipId(user.uid, targetUid);

  const baseStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, padding: '8px 14px',
    borderRadius: 8, border: 'none', cursor: 'pointer',
  };

  if (loading) {
    return <button disabled style={{ ...baseStyle, background: '#213045', color: '#7a9ab8' }}>กำลังโหลด...</button>;
  }

  if (state === 'friend') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ ...baseStyle, background: '#0d1520', color: '#00e676', border: '1px solid #213045' }}>
          ✓ เป็นเพื่อนแล้ว
        </span>
        <button
          onClick={() => { if (confirm(`ลบ ${targetName} ออกจากรายชื่อ?`)) remove(id); }}
          style={{ ...baseStyle, background: 'transparent', color: '#ef4444', border: '1px solid #213045' }}
          title="ลบเพื่อน"
        >×</button>
      </div>
    );
  }

  if (state === 'incoming') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => accept(id)}
          style={{ ...baseStyle, background: '#00e676', color: '#0d1520' }}
        >✓ ยอมรับคำขอ</button>
        <button
          onClick={() => decline(id)}
          style={{ ...baseStyle, background: 'transparent', color: '#ef4444', border: '1px solid #213045' }}
        >ปฏิเสธ</button>
      </div>
    );
  }

  if (state === 'outgoing') {
    return (
      <button
        onClick={() => { if (confirm('ยกเลิกคำขอ?')) decline(id); }}
        style={{ ...baseStyle, background: '#0d1520', color: '#ffb300', border: '1px solid #213045' }}
      >⏳ รอตอบรับ — กดเพื่อยกเลิก</button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <button
        onClick={sendByUid}
        disabled={busy}
        style={{
          ...baseStyle,
          background: '#40c4ff', color: '#0d1520',
          opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer',
        }}
      >{busy ? 'กำลังส่ง...' : '➕ เพิ่มเพื่อน'}</button>
      {msg && <span style={{ fontSize: 11, color: '#00e676' }}>{msg}</span>}
    </div>
  );
}
