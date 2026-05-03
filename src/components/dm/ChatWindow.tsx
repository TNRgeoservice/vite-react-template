// ════════════════════════════════════════
// src/components/dm/ChatWindow.tsx
// Single chat window (used inside ChatWindowStack)
// - Desktop: floating window (FB style)
// - Mobile: bottom sheet
// - Header: peer name (→ /user/[peerUid]) + ⏰ reminder button
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useChatWindowsStore, type ChatWindow as ChatWindowT } from '@/store/chatWindowsStore';
import {
  makeConvoId, PIPELINE_STAGES, DEFAULT_PIPELINE_STAGE, isDirectConvo,
  type PipelineStage,
} from '@/types/dm';
import { ChatView } from './ChatView';
import { ReminderModal } from '@/components/reminder/ReminderModal';
import { RatingModal } from '@/components/rating/RatingModal';

interface Props {
  win: ChatWindowT;
  rightOffset: number;
  isDesktop: boolean;
  activeOnMobile: boolean;
}

const WIN_WIDTH = 320;
const WIN_GAP = 12;
const EDGE_MARGIN = 16;

export function ChatWindow({ win, rightOffset, isDesktop, activeOnMobile }: Props) {
  const user = useAuthStore((s) => s.user);
  const closeWindow = useChatWindowsStore((s) => s.closeWindow);
  const toggleMinimize = useChatWindowsStore((s) => s.toggleMinimize);
  const setMinimized = useChatWindowsStore((s) => s.setMinimized);
  const setPeerName = useChatWindowsStore((s) => s.setPeerName);
  const [peerNameLocal, setPeerNameLocal] = useState(win.peerName || '');
  const [showReminder, setShowReminder] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [stage, setStage] = useState<PipelineStage>(DEFAULT_PIPELINE_STAGE);
  const [isOwner, setIsOwner] = useState(false);
  const [plotOwnerUid, setPlotOwnerUid] = useState<string>('');
  // #18 closeType ของแปลง — rating ปลดล็อกเฉพาะเมื่อ verified
  const [plotCloseType, setPlotCloseType] = useState<string | null>(null);

  useEffect(() => {
    if (!win.peerUid) return;
    if (win.peerName) { setPeerNameLocal(win.peerName); return; }
    let cancelled = false;
    getDoc(doc(db, 'users', win.peerUid))
      .then((snap) => {
        if (cancelled) return;
        const name = (snap.data()?.displayName as string) || '';
        setPeerNameLocal(name);
        if (name) setPeerName(win.key, name);
      })
      .catch((err) => console.warn('[ChatWindow] peer name lookup', err));
    return () => { cancelled = true; };
  }, [win.peerUid, win.peerName, win.key, setPeerName]);

  const isSelfOwner = !!(user && user.uid === win.peerUid);
  const headerName = peerNameLocal || win.peerName || 'ผู้ใช้';
  const direct = isDirectConvo(win.plotDocId);
  const subline = direct ? 'แชทตรง' : win.plotName;
  const convoId = user && win.peerUid ? makeConvoId(user.uid, win.peerUid, win.plotDocId) : '';

  // Subscribe convo doc → ดู pipelineStage + ตรวจว่า user คือ plotOwner ไหม
  useEffect(() => {
    if (!convoId || !user) return;
    const unsub = onSnapshot(doc(db, 'dms', convoId), (snap) => {
      const d = snap.data();
      if (!d) return;
      setStage((d.pipelineStage as PipelineStage) || DEFAULT_PIPELINE_STAGE);
      setIsOwner(!!d.plotOwnerUid && d.plotOwnerUid === user.uid);
      setPlotOwnerUid((d.plotOwnerUid as string) || '');
    });
    return unsub;
  }, [convoId, user]);

  // #18 Subscribe plot doc → ตรวจ closeType สำหรับปลดล็อก rating
  useEffect(() => {
    if (direct || !win.plotDocId) { setPlotCloseType(null); return; }
    const unsub = onSnapshot(doc(db, 'fieldsurvey_points', win.plotDocId), (snap) => {
      const d = snap.data();
      setPlotCloseType((d?.closeType as string) || null);
    });
    return unsub;
  }, [direct, win.plotDocId]);

  async function changeStage(next: PipelineStage) {
    if (!convoId) return;
    setStage(next); // optimistic
    try { await updateDoc(doc(db, 'dms', convoId), { pipelineStage: next }); }
    catch (e) { console.warn('[Pipeline] ChatWindow changeStage', e); }
  }

  const stageSelector = (compact: boolean) => {
    if (!isOwner) return null;
    const cur = PIPELINE_STAGES.find((s) => s.key === stage);
    return (
      <select
        value={stage}
        onChange={(e) => changeStage(e.target.value as PipelineStage)}
        onClick={(e) => e.stopPropagation()}
        title="เปลี่ยนสถานะดีล (Pipeline)"
        style={{
          fontSize: compact ? 10 : 11,
          padding: compact ? '2px 4px' : '3px 6px',
          background: '#0d1520',
          border: `1px solid ${cur?.color || '#213045'}`,
          borderRadius: 6,
          color: cur?.color || '#dce8f5',
          cursor: 'pointer',
          maxWidth: compact ? 70 : 88,
        }}
      >
        {PIPELINE_STAGES.map((s) => (
          <option key={s.key} value={s.key} style={{ color: '#dce8f5', background: '#111c2b' }}>
            {s.label}
          </option>
        ))}
      </select>
    );
  };

  // ปุ่ม rating: แสดงเมื่อ stage=closed + ไม่ใช่ owner + ไม่ใช่ direct chat
  // #18 ปลดล็อกเฉพาะเมื่อ plot.closeType==='verified' — กันคนขายปั่น rating ด้วยการกดปิดเอง
  const ratingBtn = (size: 'sm' | 'md') => {
    if (stage !== 'closed') return null;
    if (isOwner) return null;
    if (direct) return null;
    if (!plotOwnerUid) return null;
    if (plotCloseType !== 'verified') return null;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setShowRating(true); }}
        title="ให้ดาวนายหน้า"
        style={{
          width: size === 'md' ? 32 : 26,
          height: size === 'md' ? 32 : 26,
          borderRadius: size === 'md' ? 8 : 6,
          border: '1px solid #ffb300', background: '#0d1520',
          color: '#ffb300', fontSize: size === 'md' ? 16 : 13,
          cursor: 'pointer',
        }}
      >⭐</button>
    );
  };

  const reminderBtn = (size: 'sm' | 'md') => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!user) return;
        setShowReminder(true);
      }}
      title="ตั้งเตือนคุยต่อ"
      disabled={!user}
      style={{
        width: size === 'md' ? 32 : 26,
        height: size === 'md' ? 32 : 26,
        borderRadius: size === 'md' ? 8 : 6,
        border: '1px solid #213045', background: '#0d1520',
        color: '#ffb300', fontSize: size === 'md' ? 16 : 13,
        cursor: user ? 'pointer' : 'default',
        opacity: user ? 1 : 0.4,
      }}
    >⏰</button>
  );

  if (!isDesktop) {
    if (!activeOnMobile) return null;
    return (
      <>
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1300,
            background: 'rgba(0,0,0,.55)',
          }}
          onClick={() => closeWindow(win.key)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: '80vh', maxHeight: 640,
              background: '#0d1520',
              borderTopLeftRadius: 16, borderTopRightRadius: 16,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 14px', borderBottom: '1px solid #213045',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <a
                  href={win.peerUid ? `/user/${win.peerUid}` : '#'}
                  onClick={(e) => { if (!win.peerUid) e.preventDefault(); }}
                  style={{
                    display: 'block',
                    fontSize: 14, fontWeight: 700, color: '#dce8f5',
                    textDecoration: 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                  title="ดูโปรไฟล์"
                >
                  💬 {headerName}
                </a>
                <div style={{
                  fontSize: 11, color: '#7a9ab8',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{subline}</div>
              </div>
              {stageSelector(false)}
              {ratingBtn('md')}
              {reminderBtn('md')}
              <button
                onClick={() => closeWindow(win.key)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: '1px solid #213045', background: '#0d1520',
                  color: '#7a9ab8', fontSize: 18, cursor: 'pointer',
                }}
              >×</button>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ChatView
                plotDocId={win.plotDocId}
                sellerUid={win.peerUid}
                plotName={win.plotName}
                allowSelfOwner={isSelfOwner}
              />
            </div>
          </div>
        </div>
        {showReminder && convoId && (
          <ReminderModal
            convoId={convoId}
            plotDocId={win.plotDocId}
            plotName={win.plotName}
            peerUid={win.peerUid}
            peerName={headerName}
            onClose={() => setShowReminder(false)}
          />
        )}
        {showRating && plotOwnerUid && (
          <RatingModal
            plotDocId={win.plotDocId}
            plotName={win.plotName}
            ownerUid={plotOwnerUid}
            onClose={() => setShowRating(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          right: EDGE_MARGIN + rightOffset,
          bottom: 20,
          zIndex: 1300,
          width: WIN_WIDTH,
          height: win.minimized ? 44 : 460,
          background: '#0d1520',
          border: '1px solid #213045',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0,0,0,.5)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          transition: 'height .18s ease',
        }}
      >
        <div
          onClick={() => win.minimized && setMinimized(win.key, false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 12px',
            borderBottom: win.minimized ? 'none' : '1px solid #213045',
            background: '#111c2b',
            cursor: win.minimized ? 'pointer' : 'default',
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <a
              href={win.peerUid ? `/user/${win.peerUid}` : '#'}
              onClick={(e) => {
                if (win.minimized) { e.preventDefault(); return; }
                if (!win.peerUid)  { e.preventDefault(); return; }
                e.stopPropagation();
              }}
              style={{
                display: 'block',
                fontSize: 13, fontWeight: 700, color: '#dce8f5',
                textDecoration: 'none',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
              title="ดูโปรไฟล์"
            >
              💬 {headerName}
            </a>
            <div style={{
              fontSize: 10, color: '#7a9ab8',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{subline}</div>
          </div>
          {!win.minimized && stageSelector(true)}
          {!win.minimized && ratingBtn('sm')}
          {!win.minimized && reminderBtn('sm')}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMinimize(win.key); }}
            title={win.minimized ? 'ขยาย' : 'ย่อ'}
            style={{
              width: 26, height: 26, borderRadius: 6,
              border: '1px solid #213045', background: '#0d1520',
              color: '#7a9ab8', fontSize: 14, cursor: 'pointer',
            }}
          >{win.minimized ? '▢' : '–'}</button>
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(win.key); }}
            title="ปิด"
            style={{
              width: 26, height: 26, borderRadius: 6,
              border: '1px solid #213045', background: '#0d1520',
              color: '#7a9ab8', fontSize: 16, cursor: 'pointer',
            }}
          >×</button>
        </div>
        {!win.minimized && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <ChatView
              plotDocId={win.plotDocId}
              sellerUid={win.peerUid}
              plotName={win.plotName}
              allowSelfOwner={isSelfOwner}
            />
          </div>
        )}
      </div>
      {showReminder && convoId && (
        <ReminderModal
          convoId={convoId}
          plotDocId={win.plotDocId}
          plotName={win.plotName}
          peerUid={win.peerUid}
          peerName={headerName}
          onClose={() => setShowReminder(false)}
        />
      )}
      {showRating && plotOwnerUid && (
        <RatingModal
          plotDocId={win.plotDocId}
          plotName={win.plotName}
          ownerUid={plotOwnerUid}
          onClose={() => setShowRating(false)}
        />
      )}
    </>
  );
}

export const CHAT_WIN_WIDTH = WIN_WIDTH;
export const CHAT_WIN_GAP = WIN_GAP;
