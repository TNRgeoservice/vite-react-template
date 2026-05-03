// ════════════════════════════════════════
// src/hooks/useDM.ts
// Realtime DM — messages + typing + read receipts + send
// Port จาก js/chat-realtime.js (ย่อ — ไม่มี offline queue / lightbox)
// ════════════════════════════════════════
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  collection, doc, getDoc, onSnapshot, orderBy, query, limitToLast,
  setDoc, serverTimestamp, writeBatch, addDoc,
} from 'firebase/firestore';
import { ref as sref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, COL } from '@/lib/firebase';
import { DEFAULT_PIPELINE_STAGE, isDirectConvo, DIRECT_PLOT_ID } from '@/types/dm';
import { useAuthStore } from '@/store/authStore';
import { applyWatermark } from '@/lib/watermark';
import type { DMMessage } from '@/types/dm';

const MSG_PAGE = 50;

export function useDM(convoId: string | null, plotDocId: string, sellerUid: string, plotName: string) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<DMMessage[]>([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe messages
  useEffect(() => {
    if (!convoId) { setMessages([]); return; }
    const q = query(
      collection(db, 'dms', convoId, 'messages'),
      orderBy('sentAt', 'asc'),
      limitToLast(MSG_PAGE),
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DMMessage, 'id'>) })));
    });
    return unsub;
  }, [convoId]);

  // Subscribe convo for typing + mark seen
  useEffect(() => {
    if (!convoId || !user) return;
    const unsub = onSnapshot(doc(db, 'dms', convoId), (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      setOtherTyping(!!d.typing?.[sellerUid] && user.uid !== sellerUid);
    });
    // mark seen
    setDoc(doc(db, 'dms', convoId), {
      seenBy: { [user.uid]: true },
    }, { merge: true }).catch(() => {});
    return unsub;
  }, [convoId, user, sellerUid]);

  // Typing indicator (call on input)
  const setTyping = useCallback((typing: boolean) => {
    if (!convoId || !user) return;
    setDoc(doc(db, 'dms', convoId), {
      typing: { [user.uid]: typing },
    }, { merge: true }).catch(() => {});
    if (typing) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setTyping(false), 2500);
    }
  }, [convoId, user]);

  // Send message
  const send = useCallback(async (text: string, files: File[] = []) => {
    if (!convoId || !user || (!text.trim() && !files.length)) return;
    const direct = isDirectConvo(plotDocId);
    // Self-send guard: บล็อกเฉพาะกรณีแชทผูกแปลง (เจ้าของแปลงไม่ส่งหาตัวเอง)
    // — direct chat: peerUid != self ก็พอ (ChatView guard อยู่แล้ว)
    if (!direct && user.uid === sellerUid) throw new Error('คุณเป็นเจ้าของรายการนี้');
    if (user.uid === sellerUid) throw new Error('ส่งหาตัวเองไม่ได้');

    // Upload images (with watermark)
    const imageUrls: string[] = [];
    for (const f of files) {
      try {
        const blob = await applyWatermark(f, { text: 'TNR Geoservice', opacity: 0.5, position: 'br' });
        const r = sref(storage, `chats/${convoId}/${Date.now()}_${f.name || 'img.jpg'}`);
        await uploadBytes(r, blob, { contentType: 'image/jpeg' });
        imageUrls.push(await getDownloadURL(r));
      } catch (e) { console.warn('[DM img]', e); }
    }

    const senderName = user.displayName || user.email?.split('@')[0] || 'ผู้ใช้';
    const batch = writeBatch(db);
    const msgRef = doc(collection(db, 'dms', convoId, 'messages'));
    const convoRef = doc(db, 'dms', convoId);

    // Lookup plotOwnerUid + cobrokerUids (denormalize) เฉพาะ convo ที่ผูกแปลง — direct chat ข้าม
    let plotOwnerUid: string | null = null;
    let cobrokerUids: string[] | null = null;
    let needSetStage = false;
    if (!direct) {
      try {
        const convoSnap = await getDoc(convoRef);
        const existing = convoSnap.exists() ? convoSnap.data() : null;
        if (!existing || !existing.plotOwnerUid) {
          const plotSnap = await getDoc(doc(db, COL, plotDocId));
          plotOwnerUid = (plotSnap.data()?.ownerUid as string) || null;
          needSetStage = !existing || !existing.pipelineStage;
        }
        if (!existing || !Array.isArray(existing.cobrokerUids)) {
          // query accepted cobrokers ของแปลงนี้
          const { query: q, where: w, getDocs, collection: col } = await import('firebase/firestore');
          const cbSnap = await getDocs(q(col(db, 'cobrokers'),
            w('plotDocId', '==', plotDocId),
            w('status', '==', 'accepted')));
          cobrokerUids = cbSnap.docs
            .map((d) => (d.data().brokerUid as string) || '')
            .filter(Boolean);
        }
      } catch (e) { console.warn('[DM ownerUid lookup]', e); }
    }

    batch.set(msgRef, {
      text: text.trim(),
      imageUrls,
      senderUid: user.uid,
      senderName,
      sentAt: serverTimestamp(),
      seenBy: { [user.uid]: true },
    });
    const convoPayload: Record<string, unknown> = {
      participants: [user.uid, sellerUid],
      participantUids: { [user.uid]: true, [sellerUid]: true },
      plotDocId: direct ? DIRECT_PLOT_ID : plotDocId,
      plotName: plotName || (direct ? 'แชทตรง' : ''),
      lastMessage: text.trim() || (imageUrls.length ? '📷 รูปภาพ' : ''),
      lastSenderUid: user.uid,
      lastSenderName: senderName,
      updatedAt: serverTimestamp(),
      seenBy: { [user.uid]: true },
      typing: { [user.uid]: false },
    };
    if (plotOwnerUid) convoPayload.plotOwnerUid = plotOwnerUid;
    if (cobrokerUids) convoPayload.cobrokerUids = cobrokerUids;
    if (needSetStage) convoPayload.pipelineStage = DEFAULT_PIPELINE_STAGE;
    batch.set(convoRef, convoPayload, { merge: true });
    await batch.commit();

    // Trigger FCM (Cloud Function picks up)
    addDoc(collection(db, 'notifications'), {
      type: 'chat',
      toUid: sellerUid,
      fromName: senderName,
      plotName: plotName || (direct ? 'แชทตรง' : 'ที่ดิน'),
      body: (text.trim() || '📷 รูปภาพ').slice(0, 120),
      convoId,
      createdAt: serverTimestamp(),
      sent: false,
    }).catch(() => {});
  }, [convoId, user, sellerUid, plotDocId, plotName]);

  return { messages, otherTyping, setTyping, send };
}
