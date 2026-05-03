'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useFriends } from '@/hooks/useFriends';
import { useChatWindowsStore } from '@/store/chatWindowsStore';
import { otherUid, type Friendship } from '@/types/friendship';
import { DIRECT_PLOT_ID } from '@/types/dm';

type Tab = 'friends' | 'incoming' | 'outgoing';

export function ContactsView() {
  const user = useAuthStore((s) => s.user);
  const sp = useSearchParams();
  const router = useRouter();
  const initialTab = (sp?.get('tab') as Tab) || 'friends';
  const [tab, setTab] = useState<Tab>(initialTab);
  const { loading, friends, incoming, outgoing, sendRequest, accept, decline, remove } = useFriends();
  const openWindow = useChatWindowsStore((s) => s.openWindow);

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/');
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <div className="rounded-lg border border-[#213045] bg-[#111c2b] p-8 text-sm text-[#7a9ab8]">
          กรุณาเข้าสู่ระบบเพื่อใช้รายชื่อเพื่อน
        </div>
      </div>
    );
  }

  async function submit() {
    setBusy(true); setMsg(null);
    const r = await sendRequest(email);
    setBusy(false);
    if (r.ok) { setEmail(''); setMsg({ type: 'ok', text: 'ส่งคำขอแล้ว' }); }
    else { setMsg({ type: 'err', text: r.reason }); }
  }

  function startDirectChat(peerUid: string, peerName: string) {
    openWindow({ plotDocId: DIRECT_PLOT_ID, peerUid, plotName: '', peerName });
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={goBack}
          className="rounded-md border border-[#213045] bg-[#111c2b] px-3 py-1.5 text-xs text-[#dce8f5] hover:bg-[#0d1520]"
        >← ย้อนกลับ</button>
        <h1 className="text-lg font-bold text-[#dce8f5]">👥 รายชื่อเพื่อน</h1>
      </div>

      <div className="mb-4 rounded-lg border border-[#213045] bg-[#111c2b] p-3">
        <div className="mb-2 text-xs text-[#7a9ab8]">เพิ่มเพื่อนด้วยอีเมล</div>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1 rounded-md border border-[#213045] bg-[#0d1520] px-3 py-2 text-sm text-[#dce8f5] focus:border-[#40c4ff] focus:outline-none"
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          />
          <button
            onClick={submit}
            disabled={busy || !email.trim()}
            className="rounded-md bg-[#40c4ff] px-4 py-2 text-xs font-bold text-[#0d1520] disabled:opacity-50"
          >{busy ? 'กำลังส่ง...' : 'ส่งคำขอ'}</button>
        </div>
        {msg && (
          <div className={`mt-2 text-xs ${msg.type === 'ok' ? 'text-[#00e676]' : 'text-[#ef4444]'}`}>
            {msg.type === 'ok' ? '✓ ' : '⚠ '}{msg.text}
          </div>
        )}
      </div>

      <div className="mb-3 flex gap-1 border-b border-[#213045]">
        <TabBtn active={tab === 'friends'}  onClick={() => setTab('friends')}  label={`เพื่อน (${friends.length})`} />
        <TabBtn active={tab === 'incoming'} onClick={() => setTab('incoming')} label={`คำขอเข้ามา (${incoming.length})`} highlight={incoming.length > 0} />
        <TabBtn active={tab === 'outgoing'} onClick={() => setTab('outgoing')} label={`ส่งคำขอ (${outgoing.length})`} />
      </div>

      {loading && <div className="py-6 text-center text-xs text-[#7a9ab8]">กำลังโหลด...</div>}

      {!loading && tab === 'friends' && (
        <List
          rows={friends}
          meUid={user.uid}
          empty="ยังไม่มีเพื่อน — เพิ่มจากอีเมลด้านบน"
          renderActions={(f, peerUid, peerName) => (
            <>
              <button
                onClick={() => startDirectChat(peerUid, peerName)}
                className="rounded-md bg-[#00e676] px-3 py-1 text-[11px] font-bold text-[#001a0a]"
              >💬 แชท</button>
              <Link
                href={`/user/${peerUid}`}
                className="rounded-md border border-[#213045] px-3 py-1 text-[11px] text-[#dce8f5]"
              >โปรไฟล์</Link>
              <button
                onClick={() => { if (confirm('ลบเพื่อนคนนี้?')) remove(f.id); }}
                className="rounded-md border border-[#213045] px-2 py-1 text-[11px] text-[#ef4444]"
              >×</button>
            </>
          )}
        />
      )}

      {!loading && tab === 'incoming' && (
        <List
          rows={incoming}
          meUid={user.uid}
          empty="ไม่มีคำขอเข้ามา"
          renderActions={(f) => (
            <>
              <button
                onClick={() => accept(f.id)}
                className="rounded-md bg-[#00e676] px-3 py-1 text-[11px] font-bold text-[#001a0a]"
              >ยอมรับ</button>
              <button
                onClick={() => decline(f.id)}
                className="rounded-md border border-[#213045] px-3 py-1 text-[11px] text-[#ef4444]"
              >ปฏิเสธ</button>
            </>
          )}
        />
      )}

      {!loading && tab === 'outgoing' && (
        <List
          rows={outgoing}
          meUid={user.uid}
          empty="ไม่มีคำขอที่รอตอบรับ"
          renderActions={(f) => (
            <button
              onClick={() => decline(f.id)}
              className="rounded-md border border-[#213045] px-3 py-1 text-[11px] text-[#ef4444]"
            >ยกเลิก</button>
          )}
        />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, label, highlight }: {
  active: boolean; onClick: () => void; label: string; highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-2 text-xs font-semibold transition-colors ${
        active ? 'border-b-2 border-[#40c4ff] text-[#40c4ff]' : 'text-[#7a9ab8] hover:text-[#dce8f5]'
      }`}
    >
      {label}
      {highlight && !active && (
        <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
      )}
    </button>
  );
}

function List({ rows, meUid, empty, renderActions }: {
  rows: Friendship[];
  meUid: string;
  empty: string;
  renderActions: (f: Friendship, peerUid: string, peerName: string) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return <div className="py-6 text-center text-xs text-[#7a9ab8]">{empty}</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      {rows.map((f) => {
        const peerUid = otherUid(f, meUid);
        const peerName = (f.uidA === peerUid ? f.uidAName : f.uidBName) || 'ผู้ใช้';
        const peerEmail = (f.uidA === peerUid ? f.uidAEmail : f.uidBEmail) || '';
        const initial = peerName.charAt(0).toUpperCase();
        return (
          <div key={f.id} className="flex items-center gap-2 rounded-lg border border-[#213045] bg-[#111c2b] p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0d1520] text-base text-[#7a9ab8]">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#dce8f5]">{peerName}</div>
              {peerEmail && <div className="truncate text-[10px] text-[#7a9ab8]">{peerEmail}</div>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {renderActions(f, peerUid, peerName)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
