// ════════════════════════════════════════
// src/components/dm/MessageBubble.tsx
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { DMMessage } from '@/types/dm';

export function MessageBubble({ msg, meUid }: { msg: DMMessage; meUid: string }) {
  const isMe = msg.senderUid === meUid;
  const isSystem = msg.isSystem || msg.senderUid === 'system';
  const time = msg.sentAt?.toDate ? fmtTime(msg.sentAt.toDate()) : '';
  const seenByOther = Object.keys(msg.seenBy || {}).some((u) => u !== meUid);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // System message — render เป็น banner กลางจอ + ปุ่ม action
  if (isSystem) {
    return (
      <div className="mb-2 flex flex-col items-center">
        <div className="max-w-[90%] rounded-xl border border-[#40c4ff66] bg-[#0d2a3d] px-3 py-2 text-center">
          <div className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[#dce8f5]">
            {msg.text}
          </div>
          {msg.actionUrl && (
            <Link
              href={msg.actionUrl}
              className="mt-2 inline-block rounded-md bg-[#40c4ff] px-3 py-1 text-[11px] font-bold text-[#0d1520] hover:opacity-90"
            >เปิดดู →</Link>
          )}
        </div>
        <div className="mt-0.5 text-[10px] text-[#7a9ab8]">{msg.senderName || 'ระบบ'} · {time}</div>
      </div>
    );
  }

  // ESC to close
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <>
      <div className={`mb-2 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
          isMe ? 'bg-[#00e676] text-[#001a0a]' : 'bg-[#1e2d42] text-[#dce8f5]'
        }`}>
          {msg.imageUrls?.map((u, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={u}
              alt=""
              onClick={() => setLightbox(u)}
              className="mb-1 max-h-[200px] max-w-[200px] cursor-zoom-in rounded-lg transition-opacity hover:opacity-90"
            />
          ))}
          {msg.text && <div className="whitespace-pre-wrap break-words">{msg.text}</div>}
        </div>
        <div className="mt-0.5 text-[10px] text-[#7a9ab8]">
          {!isMe && msg.senderName ? `${msg.senderName} · ` : ''}{time}
          {isMe && (seenByOther ? <span className="ml-1 text-[#00e676]">✓✓</span> : <span className="ml-1">✓</span>)}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 p-4"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white hover:bg-black/80"
            aria-label="ปิด"
          >×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-default rounded-lg object-contain"
          />
        </div>
      )}
    </>
  );
}

function fmtTime(d: Date) {
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return 'เมื่อกี้';
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + ' นาที';
  if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + ' ชม.';
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}
