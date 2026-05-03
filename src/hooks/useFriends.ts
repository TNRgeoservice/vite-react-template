// ════════════════════════════════════════
// src/hooks/useFriends.ts
// Friend system — list, send/accept/decline/remove + lookup by email
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp,
  setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import {
  type Friendship,
  makeFriendshipId,
  otherUid,
} from '@/types/friendship';

interface UseFriends {
  loading: boolean;
  friends: Friendship[];           // accepted
  incoming: Friendship[];          // pending where requester != me
  outgoing: Friendship[];          // pending where requester == me
  friendUids: Set<string>;         // accepted other-uids (fast contains)
  sendRequest: (targetEmail: string) => Promise<{ ok: true } | { ok: false; reason: string }>;
  accept: (id: string) => Promise<void>;
  decline: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useFriends(): UseFriends {
  const user = useAuthStore((s) => s.user);
  const [rowsA, setRowsA] = useState<Friendship[]>([]);
  const [rowsB, setRowsB] = useState<Friendship[]>([]);
  const [readyA, setReadyA] = useState(false);
  const [readyB, setReadyB] = useState(false);

  // Listen 2 ทาง: where uidA==me + where uidB==me — auto-index ทั้งคู่
  useEffect(() => {
    if (!user) { setRowsA([]); setRowsB([]); setReadyA(true); setReadyB(true); return; }
    setReadyA(false); setReadyB(false);
    const qA = query(collection(db, 'friendships'), where('uidA', '==', user.uid));
    const qB = query(collection(db, 'friendships'), where('uidB', '==', user.uid));
    const unsubA = onSnapshot(qA, (snap) => {
      setRowsA(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Friendship, 'id'>) })));
      setReadyA(true);
    }, (e) => { console.warn('[useFriends A]', e); setReadyA(true); });
    const unsubB = onSnapshot(qB, (snap) => {
      setRowsB(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Friendship, 'id'>) })));
      setReadyB(true);
    }, (e) => { console.warn('[useFriends B]', e); setReadyB(true); });
    return () => { unsubA(); unsubB(); };
  }, [user]);

  const all = useMemo(() => {
    const map = new Map<string, Friendship>();
    [...rowsA, ...rowsB].forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [rowsA, rowsB]);

  const friends = useMemo(
    () => all.filter((r) => r.status === 'accepted'),
    [all],
  );
  const incoming = useMemo(
    () => all.filter((r) => r.status === 'pending' && r.requesterUid !== user?.uid),
    [all, user],
  );
  const outgoing = useMemo(
    () => all.filter((r) => r.status === 'pending' && r.requesterUid === user?.uid),
    [all, user],
  );
  const friendUids = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(friends.map((f) => otherUid(f, user.uid)));
  }, [friends, user]);

  const sendRequest = useCallback(async (targetEmail: string) => {
    if (!user) return { ok: false as const, reason: 'กรุณาเข้าสู่ระบบ' };
    const em = targetEmail.trim().toLowerCase();
    if (!em || !em.includes('@')) return { ok: false as const, reason: 'อีเมลไม่ถูกต้อง' };
    if (em === (user.email || '').toLowerCase()) return { ok: false as const, reason: 'เพิ่มตัวเองไม่ได้' };
    // Lookup target user
    const us = await getDocs(query(collection(db, 'users'), where('email', '==', em)));
    if (us.empty) return { ok: false as const, reason: 'ไม่พบผู้ใช้อีเมลนี้ในระบบ' };
    const targetDoc = us.docs[0];
    const targetUid = targetDoc.id;
    const targetName = (targetDoc.data().displayName as string) || em.split('@')[0];
    const targetEmailDb = (targetDoc.data().email as string) || em;
    if (targetUid === user.uid) return { ok: false as const, reason: 'เพิ่มตัวเองไม่ได้' };
    // Check existing
    const id = makeFriendshipId(user.uid, targetUid);
    const existing = await getDoc(doc(db, 'friendships', id));
    if (existing.exists()) {
      const s = existing.data().status as string;
      if (s === 'accepted') return { ok: false as const, reason: 'เป็นเพื่อนกันอยู่แล้ว' };
      if (s === 'pending') return { ok: false as const, reason: 'มีคำขออยู่แล้ว' };
      if (s === 'blocked') return { ok: false as const, reason: 'ถูกบล็อก' };
    }
    const [a, b] = [user.uid, targetUid].sort();
    const myName = user.displayName || user.email?.split('@')[0] || 'ผู้ใช้';
    const myEmail = (user.email || '').toLowerCase();
    await setDoc(doc(db, 'friendships', id), {
      uidA: a,
      uidB: b,
      requesterUid: user.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      uidAName: a === user.uid ? myName : targetName,
      uidBName: b === user.uid ? myName : targetName,
      uidAEmail: a === user.uid ? myEmail : targetEmailDb,
      uidBEmail: b === user.uid ? myEmail : targetEmailDb,
    });
    // Notify (FCM)
    try {
      const { addDoc } = await import('firebase/firestore');
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
    return { ok: true as const };
  }, [user]);

  const accept = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'friendships', id), {
      status: 'accepted',
      respondedAt: serverTimestamp(),
    });
  }, []);

  const decline = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'friendships', id));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'friendships', id));
  }, []);

  return {
    loading: !readyA || !readyB,
    friends, incoming, outgoing, friendUids,
    sendRequest, accept, decline, remove,
  };
}
