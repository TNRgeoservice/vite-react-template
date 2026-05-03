// ════════════════════════════════════════
// src/components/dm/PlotChatDrawer.tsx
// Trigger button on plot detail page.
// Opens a floating chat window via chatWindowsStore (no self-render).
// - Auto-opens when URL has ?chat=1 (supports ?peer=uid for multi-buyer)
// - Seller on own plot: button hidden; only opens via ?chat=1 from inbox
// ════════════════════════════════════════
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useChatWindowsStore } from '@/store/chatWindowsStore';

export function PlotChatDrawer({
  plotDocId, sellerUid: sellerUidProp, plotName,
}: { plotDocId: string; sellerUid: string; plotName: string }) {
  const user = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const openWindow = useChatWindowsStore((s) => s.openWindow);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fallback peer uid (lookup from convo when plot has no ownerUid)
  const [peerUid, setPeerUid] = useState<string>('');

  const peerFromUrl = searchParams?.get('peer') || '';
  const isSelf = !!(user && sellerUidProp && user.uid === sellerUidProp);

  // Resolve peer:
  // 1) ?peer=uid from URL
  // 2) sellerUidProp (buyer viewing seller's plot)
  // 3) peerUid from convo lookup (fallback)
  const resolvedPeer = peerFromUrl
    || (isSelf ? peerUid : (sellerUidProp || peerUid));

  // Lookup peer from convo when prop is missing or self
  useEffect(() => {
    if (!user || !plotDocId) return;
    if (sellerUidProp && !isSelf) return;
    const q = query(
      collection(db, 'dms'),
      where('plotDocId', '==', plotDocId),
      where('participants', 'array-contains', user.uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const docSnap = snap.docs[0];
      if (!docSnap) return;
      const parts = (docSnap.data().participants || []) as string[];
      const peer = parts.find((p) => p !== user.uid) || '';
      if (peer) setPeerUid(peer);
    }, (err) => console.warn('[Drawer] peer lookup', err));
    return unsub;
  }, [sellerUidProp, isSelf, user, plotDocId]);

  // Auto-open from ?chat=1 — run once per peer resolution
  const autoOpenedRef = useRef<string>('');
  useEffect(() => {
    if (searchParams?.get('chat') !== '1') return;
    if (!resolvedPeer) return;
    const key = `${plotDocId}:${resolvedPeer}`;
    if (autoOpenedRef.current === key) return;
    autoOpenedRef.current = key;
    openWindow({ plotDocId, peerUid: resolvedPeer, plotName, peerName: '' });
    // clean URL so refresh doesn't re-open
    router.replace(window.location.pathname);
  }, [searchParams, resolvedPeer, plotDocId, plotName, openWindow, router]);

  // Hide button: seller on own plot, or no peer available
  if (isSelf) return null;
  if (!resolvedPeer) return null;

  function handleOpen() {
    if (!user) { setLoginOpen(true); return; }
    if (!resolvedPeer) return;
    openWindow({ plotDocId, peerUid: resolvedPeer, plotName, peerName: '' });
  }

  return (
    <button
      onClick={handleOpen}
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 1200,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 18px', borderRadius: 999,
        background: '#40c4ff', color: '#0d1520',
        fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0,0,0,.4)',
      }}
    >
      💬 แชทกับผู้ขาย
    </button>
  );
}
