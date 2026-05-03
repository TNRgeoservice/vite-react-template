// ════════════════════════════════════════
// src/components/dm/ChatView.tsx
// One conversation (messages + input)
// ════════════════════════════════════════
'use client';

import { useEffect, useRef, useState } from 'react';
import { useDM } from '@/hooks/useDM';
import { useAuthStore } from '@/store/authStore';
import { MessageBubble } from './MessageBubble';
import { makeConvoId, isDirectConvo } from '@/types/dm';

export function ChatView({
  plotDocId, sellerUid, plotName, allowSelfOwner = false,
}: { plotDocId: string; sellerUid: string; plotName: string; allowSelfOwner?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const convoId = user ? makeConvoId(user.uid, sellerUid, plotDocId) : null;
  const { messages, otherTyping, setTyping, send } = useDM(convoId, plotDocId, sellerUid, plotName);
  const direct = isDirectConvo(plotDocId);

  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // auto-scroll to bottom on new msg
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function handleSend() {
    if (!text.trim() && !files.length) return;
    if (!user) { alert('กรุณาเข้าสู่ระบบ'); return; }
    setSending(true);
    try {
      await send(text, files);
      setText('');
      setFiles([]);
      setTyping(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'ส่งไม่สำเร็จ');
    } finally {
      setSending(false);
    }
  }

  if (!user) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">กรุณาเข้าสู่ระบบ</div>;
  }
  // Direct chat: ห้ามแชทตัวเองเท่านั้น (ไม่มี seller concept)
  // Plot chat: บล็อก seller ของแปลง ยกเว้น allowSelfOwner=true (owner ดู inbox)
  if (user.uid === sellerUid && !direct && !allowSelfOwner) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">คุณเป็นเจ้าของรายการนี้</div>;
  }
  if (user.uid === sellerUid && direct) {
    return <div className="p-6 text-center text-xs text-[#7a9ab8]">แชทกับตัวเองไม่ได้</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {messages.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#7a9ab8]">
            {direct
              ? 'เริ่มต้นพูดคุย'
              : <>เริ่มต้นคุยเกี่ยวกับ <b>{plotName || 'ที่ดิน'}</b></>}
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} msg={m} meUid={user.uid} />)
        )}
        {otherTyping && (
          <div className="text-xs text-[#40c4ff]" style={{ animation: 'pulse 1.2s infinite' }}>
            กำลังพิมพ์...
          </div>
        )}
      </div>

      {/* Image preview strip */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-[#213045] p-2">
          {files.map((f, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(f)} alt="" className="h-14 w-14 rounded border border-[#213045] object-cover" />
              <button
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#dc2626] text-[9px] text-white"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-1.5 border-t border-[#213045] p-2">
        <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#213045] bg-[#0d1520] text-base">
          📎
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => {
              const arr = Array.from(e.target.files || []);
              if (arr.length) setFiles((prev) => [...prev, ...arr]);
              e.target.value = '';
            }} />
        </label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setTyping(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="พิมพ์ข้อความ..."
          rows={1}
          className="min-h-[36px] max-h-24 flex-1 resize-none rounded-lg border border-[#213045] bg-[#0d1520] px-3 py-2 text-sm text-[#dce8f5] focus:border-[#40c4ff] focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={sending || (!text.trim() && !files.length)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00e676] text-lg font-bold text-[#001a0a] disabled:opacity-50"
        >➤</button>
      </div>
    </div>
  );
}
