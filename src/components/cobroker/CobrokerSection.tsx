// ════════════════════════════════════════
// src/components/cobroker/CobrokerSection.tsx
// Phase 3 #10 — แสดงรายการนายหน้าร่วมของแปลง + ปุ่มเชิญ (เฉพาะ owner)
// Mount ในหน้า /plot/[id] (client component)
// ════════════════════════════════════════
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp,
  updateDoc, where, writeBatch,
} from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useChatWindowsStore } from '@/store/chatWindowsStore';
import { useFriends } from '@/hooks/useFriends';
import { otherUid } from '@/types/friendship';
import { DIRECT_PLOT_ID, makeConvoId } from '@/types/dm';
import type { Cobroker, CobrokerStatus } from '@/types/cobroker';
import { CobrokerRequestButton } from './CobrokerRequestButton';

interface Props {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
}

const statusBadge: Record<CobrokerStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: 'รอตอบรับ',   bg: '#ffb300', color: '#0d1520' },
  accepted: { label: 'ยอมรับแล้ว', bg: '#00e676', color: '#0d1520' },
  declined: { label: 'ปฏิเสธ',     bg: '#ef4444', color: '#fff' },
  revoked:  { label: 'ยกเลิก',     bg: '#7a9ab8', color: '#0d1520' },
};

export function CobrokerSection({ plotDocId, plotName, ownerUid }: Props) {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Cobroker[]>([]);
  const [showInvite, setShowInvite] = useState(false);

  const isOwner = !!(user && user.uid === ownerUid);

  useEffect(() => {
    if (!plotDocId) return;
    const q = query(collection(db, 'cobrokers'), where('plotDocId', '==', plotDocId));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cobroker, 'id'>) }));
      // pending+accepted ขึ้นก่อน, sort by invitedAt desc
      rows.sort((a, b) => (b.invitedAt?.toMillis?.() ?? 0) - (a.invitedAt?.toMillis?.() ?? 0));
      setItems(rows);
    });
    return unsub;
  }, [plotDocId]);

  // Filter: ลูกค้า/buyer เห็นเฉพาะ accepted, owner เห็นทั้งหมด
  const visible = isOwner ? items : items.filter((i) => i.status === 'accepted');
  const acceptedTotalPct = items
    .filter((i) => i.status === 'accepted')
    .reduce((s, i) => s + (Number(i.commissionPct) || 0), 0);

  // Buyer: ไม่ render section ถ้าไม่มี broker accepted และไม่ใช่ user ที่ login
  // — ยังต้องแสดง CobrokerRequestButton (ในกรณี broker ที่ยังไม่ขอ)
  if (!user) {
    if (visible.length === 0) return null;
  }

  return (
    <div style={{
      background: '#111c2b',
      border: '1px solid #213045',
      borderRadius: 12,
      padding: 14,
      marginTop: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10, gap: 8, flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>
          🤝 นายหน้าร่วม
          {visible.length > 0 && (
            <span style={{ marginLeft: 6, fontSize: 11, color: '#7a9ab8', fontWeight: 400 }}>
              · {visible.length} ราย
            </span>
          )}
        </div>
        {isOwner ? (
          <button
            onClick={() => setShowInvite(true)}
            style={{
              fontSize: 11, padding: '6px 12px',
              background: '#40c4ff', color: '#0d1520',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontWeight: 700,
            }}
          >＋ เชิญนายหน้า</button>
        ) : (
          <CobrokerRequestButton
            plotDocId={plotDocId}
            plotName={plotName}
            ownerUid={ownerUid}
          />
        )}
      </div>

      {isOwner ? (
        visible.length === 0 ? (
          <div style={{ fontSize: 12, color: '#7a9ab8', padding: '8px 0' }}>
            ยังไม่มีนายหน้าร่วม — กดปุ่ม &quot;เชิญนายหน้า&quot; เพื่อแบ่งค่าคอม
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible.map((c) => (
              <CobrokerRow key={c.id} item={c} canManage={isOwner} />
            ))}
          </div>
        )
      ) : (
        <ContactPicker
          plotDocId={plotDocId}
          plotName={plotName}
          ownerUid={ownerUid}
          brokers={visible}
        />
      )}

      {isOwner && acceptedTotalPct > 0 && (
        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: '1px solid #213045',
          fontSize: 11, color: '#7a9ab8',
        }}>
          รวมค่าคอมที่แบ่งให้นายหน้า: <strong style={{ color: '#dce8f5' }}>{acceptedTotalPct}%</strong>
          {acceptedTotalPct > 100 && (
            <span style={{ color: '#ef4444', marginLeft: 6 }}>⚠ เกิน 100%!</span>
          )}
        </div>
      )}

      {showInvite && (
        <InviteModal
          plotDocId={plotDocId}
          plotName={plotName}
          ownerUid={ownerUid}
          ownerName={user?.displayName || user?.email?.split('@')[0] || 'เจ้าของ'}
          existingPct={acceptedTotalPct}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// ContactPicker — buyer view: เลือกคุยกับ owner หรือ co-broker
function ContactPicker({
  plotDocId, plotName, ownerUid, brokers,
}: {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  brokers: Cobroker[];
}) {
  const user = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const openWindow = useChatWindowsStore((s) => s.openWindow);
  const [ownerInfo, setOwnerInfo] = useState<{ name: string; avatar: string }>({ name: '', avatar: '' });

  useEffect(() => {
    if (!ownerUid) return;
    let cancelled = false;
    getDoc(doc(db, 'users', ownerUid))
      .then((snap) => {
        if (cancelled) return;
        const d = snap.data() || {};
        setOwnerInfo({
          name: (d.displayName as string) || 'เจ้าของแปลง',
          avatar: (d.avatarUrl as string) || '',
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ownerUid]);

  function chat(targetUid: string) {
    if (!user) { setLoginOpen(true); return; }
    if (user.uid === targetUid) return;
    openWindow({ plotDocId, peerUid: targetUid, plotName, peerName: '' });
  }

  type Contact = { uid: string; name: string; role: string; avatar: string; commissionPct?: number };
  const contacts: Contact[] = [
    { uid: ownerUid, name: ownerInfo.name || 'เจ้าของแปลง', role: 'เจ้าของแปลง', avatar: ownerInfo.avatar },
    ...brokers
      .filter((b) => !!b.brokerUid)
      .map<Contact>((b) => ({
        uid: b.brokerUid as string,
        name: b.brokerName || b.brokerEmail || 'นายหน้า',
        role: 'นายหน้าร่วม',
        avatar: '',
        commissionPct: b.commissionPct,
      })),
  ];

  return (
    <div>
      <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 8 }}>
        💬 เลือกคุยกับใครก็ได้ — แต่ละคนจะมีกล่องแชทแยก
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {contacts.map((c) => {
          const isMe = user?.uid === c.uid;
          const initial = (c.name || '?')[0].toUpperCase();
          return (
            <div key={c.uid} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#0d1520', border: '1px solid #213045',
              borderRadius: 10, padding: '10px 12px',
            }}>
              {c.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.avatar} alt="" style={{
                  width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#213045', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#dce8f5', flexShrink: 0,
                }}>{initial}</div>
              )}
              <Link
                href={`/user/${c.uid}`}
                style={{
                  flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit',
                }}
              >
                <div style={{
                  fontSize: 13, fontWeight: 600, color: '#dce8f5',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{c.name}{isMe && <span style={{ fontSize: 10, color: '#7a9ab8', marginLeft: 4 }}>(คุณ)</span>}</div>
                <div style={{ fontSize: 10, color: '#7a9ab8' }}>
                  {c.role}
                  {c.commissionPct ? ` · ${c.commissionPct}%` : ''}
                </div>
              </Link>
              {!isMe && (
                <button
                  onClick={() => chat(c.uid)}
                  style={{
                    fontSize: 11, padding: '6px 12px',
                    background: '#40c4ff', color: '#0d1520',
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    fontWeight: 700, whiteSpace: 'nowrap',
                  }}
                >💬 แชท</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CobrokerRow({ item, canManage }: { item: Cobroker; canManage: boolean }) {
  const badge = statusBadge[item.status];

  async function revoke() {
    if (!confirm(`ยกเลิกการเชิญ ${item.brokerEmail}?`)) return;
    try {
      await updateDoc(doc(db, 'cobrokers', item.id), {
        status: 'revoked', respondedAt: serverTimestamp(),
      });
    } catch (e) { alert('ผิดพลาด: ' + (e as Error).message); }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#0d1520', border: '1px solid #213045',
      borderRadius: 8, padding: '8px 10px',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: '#dce8f5',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.brokerName || item.brokerEmail}
        </div>
        {item.brokerName && (
          <div style={{ fontSize: 10, color: '#7a9ab8' }}>{item.brokerEmail}</div>
        )}
        {item.note && (
          <div style={{ fontSize: 10, color: '#7a9ab8', marginTop: 2 }}>📝 {item.note}</div>
        )}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700, color: '#40c4ff',
        minWidth: 44, textAlign: 'right',
      }}>{item.commissionPct}%</div>
      <span style={{
        background: badge.bg, color: badge.color,
        fontSize: 10, fontWeight: 700,
        padding: '3px 8px', borderRadius: 10,
        whiteSpace: 'nowrap',
      }}>{badge.label}</span>
      {canManage && (item.status === 'pending' || item.status === 'accepted') && (
        <button
          onClick={revoke}
          title="ยกเลิก"
          style={{
            background: 'none', border: '1px solid #213045',
            color: '#ef4444', fontSize: 11,
            padding: '3px 6px', borderRadius: 6, cursor: 'pointer',
          }}
        >×</button>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────

interface InviteProps {
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  ownerName: string;
  existingPct: number;
  onClose: () => void;
}

function InviteModal({ plotDocId, plotName, ownerUid, ownerName, existingPct, onClose }: InviteProps) {
  const user = useAuthStore((s) => s.user);
  const { friends, loading: friendsLoading } = useFriends();
  const [selectedUid, setSelectedUid] = useState<string>('');
  const [pct, setPct] = useState(10);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const remaining = Math.max(0, 100 - existingPct);

  // Build pickable contacts (exclude already-invited brokers handled in caller; here just list friends)
  const contacts = useMemo(() => {
    if (!user) return [] as { uid: string; name: string; email: string }[];
    return friends.map((f) => {
      const peerUid = otherUid(f, user.uid);
      const name = (f.uidA === peerUid ? f.uidAName : f.uidBName) || 'เพื่อน';
      const email = (f.uidA === peerUid ? f.uidAEmail : f.uidBEmail) || '';
      return { uid: peerUid, name, email };
    });
  }, [friends, user]);

  const selected = contacts.find((c) => c.uid === selectedUid);

  async function submit() {
    if (!selected) { alert('เลือกเพื่อน 1 คนก่อน'); return; }
    if (pct <= 0 || pct > 100) { alert('% ต้องอยู่ระหว่าง 1-100'); return; }
    if (existingPct + pct > 100) {
      if (!confirm(`รวม ${existingPct + pct}% เกิน 100% — ดำเนินการต่อ?`)) return;
    }
    setBusy(true);
    try {
      const cobrokerRef = await addDoc(collection(db, 'cobrokers'), {
        plotDocId, plotName, ownerUid, ownerName,
        brokerUid: selected.uid,
        brokerEmail: selected.email,
        brokerName: selected.name,
        commissionPct: pct,
        status: 'pending' as CobrokerStatus,
        direction: 'invite',
        invitedAt: serverTimestamp(),
        note: note.trim() || '',
      });

      // System DM ใน inbox ของ broker — กดเปิดแล้วเห็นทันที + link ไปหน้ารับ
      try {
        const convoId = makeConvoId(ownerUid, selected.uid, DIRECT_PLOT_ID);
        const body = `🤝 ${ownerName} เชิญคุณร่วมขาย "${plotName}" (แบ่ง ${pct}%)\nกดเปิด /broker?tab=invites เพื่อรับ/ปฏิเสธคำเชิญ`;
        const batch = writeBatch(db);
        const msgRef = doc(collection(db, 'dms', convoId, 'messages'));
        const convoRef = doc(db, 'dms', convoId);
        batch.set(msgRef, {
          text: body,
          imageUrls: [],
          senderUid: 'system',
          senderName: 'TNR Cobroker',
          sentAt: serverTimestamp(),
          seenBy: {},
          isSystem: true,
          cobrokerId: cobrokerRef.id,
          actionUrl: '/broker?tab=invites',
        });
        batch.set(convoRef, {
          participants: [ownerUid, selected.uid],
          participantUids: { [ownerUid]: true, [selected.uid]: true },
          plotDocId: DIRECT_PLOT_ID,
          plotName: 'แชทตรง',
          lastMessage: body.split('\n')[0],
          lastSenderUid: 'system',
          lastSenderName: 'TNR Cobroker',
          updatedAt: serverTimestamp(),
        }, { merge: true });
        await batch.commit();
      } catch (e) { console.warn('[cobroker DM]', e); }

      // FCM/inbox notify
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'cobroker_invite',
          toUid: selected.uid,
          fromName: ownerName,
          plotName,
          title: '🤝 คุณได้รับเชิญเป็นนายหน้าร่วม',
          body: `${ownerName} เชิญคุณช่วยขาย "${plotName}" — แบ่ง ${pct}%`,
          url: `/broker?tab=invites`,
          createdAt: serverTimestamp(),
          sent: false,
        });
      } catch {/* notify optional */}
      onClose();
    } catch (e) {
      alert('เชิญไม่สำเร็จ: ' + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          background: '#0d1520',
          border: '1px solid #213045', borderRadius: 12,
          padding: 18,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#dce8f5' }}>
          🤝 เชิญนายหน้าร่วม
        </div>

        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          เลือกนายหน้าจากรายชื่อเพื่อน
        </label>
        {friendsLoading ? (
          <div style={{ fontSize: 12, color: '#7a9ab8', padding: '12px 0', marginBottom: 12 }}>
            กำลังโหลดเพื่อน...
          </div>
        ) : contacts.length === 0 ? (
          <div style={{
            background: '#111c2b', border: '1px dashed #213045', borderRadius: 8,
            padding: 12, marginBottom: 12, fontSize: 12, color: '#7a9ab8',
          }}>
            ยังไม่มีเพื่อนในรายชื่อ —{' '}
            <Link href="/contacts" style={{ color: '#40c4ff', textDecoration: 'underline' }}>
              เพิ่มเพื่อนก่อน
            </Link>
          </div>
        ) : (
          <div style={{
            maxHeight: 180, overflowY: 'auto', marginBottom: 12,
            border: '1px solid #213045', borderRadius: 8, background: '#111c2b',
          }}>
            {contacts.map((c) => (
              <label
                key={c.uid}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', cursor: 'pointer',
                  borderBottom: '1px solid #213045',
                  background: selectedUid === c.uid ? '#0d1520' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="cobroker-pick"
                  value={c.uid}
                  checked={selectedUid === c.uid}
                  onChange={() => setSelectedUid(c.uid)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: '#dce8f5',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{c.name}</div>
                  {c.email && (
                    <div style={{
                      fontSize: 10, color: '#7a9ab8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{c.email}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          ส่วนแบ่งค่าคอม (% ของยอดขาย) — เหลือได้สูงสุด {remaining}%
        </label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <input
            type="range" min={1} max={100} value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <input
            type="number" min={1} max={100} value={pct}
            onChange={(e) => setPct(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
            style={{
              width: 60, padding: '6px 8px',
              background: '#111c2b', border: '1px solid #213045',
              borderRadius: 6, color: '#dce8f5', fontSize: 13, textAlign: 'right',
            }}
          />
          <span style={{ fontSize: 13, color: '#7a9ab8' }}>%</span>
        </div>

        <label style={{ display: 'block', fontSize: 11, color: '#7a9ab8', marginBottom: 4 }}>
          หมายเหตุ (ไม่บังคับ)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          placeholder="เช่น เงื่อนไขพิเศษ, ระยะเวลา"
          rows={2}
          style={{
            width: '100%', padding: '8px 10px', marginBottom: 14,
            background: '#111c2b', border: '1px solid #213045',
            borderRadius: 8, color: '#dce8f5', fontSize: 12,
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={busy}
            style={{
              padding: '8px 14px', fontSize: 12,
              background: 'transparent', color: '#7a9ab8',
              border: '1px solid #213045', borderRadius: 8, cursor: 'pointer',
            }}
          >ยกเลิก</button>
          <button
            onClick={submit}
            disabled={busy || !selected}
            style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 700,
              background: '#00e676', color: '#0d1520',
              border: 'none', borderRadius: 8,
              cursor: busy ? 'wait' : (selected ? 'pointer' : 'not-allowed'),
              opacity: selected ? 1 : 0.5,
            }}
          >{busy ? 'กำลังส่ง...' : 'ส่งคำเชิญ'}</button>
        </div>
      </div>
    </div>
  );
}
