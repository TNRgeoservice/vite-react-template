// ════════════════════════════════════════
// src/components/pipeline/PipelineBoard.tsx
// Kanban board: convos จัดกลุ่มตาม pipelineStage
// - แสดงเฉพาะ convo ของแปลงที่ user เป็นเจ้าของ (plotOwnerUid == user.uid)
// - Drag & drop เปลี่ยน stage (HTML5 native — desktop)
// - Mobile: ปุ่ม dropdown เปลี่ยน stage
// ════════════════════════════════════════
'use client';

import { useEffect, useState, useMemo, type CSSProperties } from 'react';
import {
  collection, doc, getDoc, onSnapshot, query, updateDoc, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useChatWindowsStore } from '@/store/chatWindowsStore';
import {
  PIPELINE_STAGES, DEFAULT_PIPELINE_STAGE,
  type DMConvo, type PipelineStage,
} from '@/types/dm';

interface ConvoRow extends DMConvo {
  peerUid: string;
}

const lastMsgStyle: CSSProperties = {
  fontSize: 11,
  color: '#7a9ab8',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: '1.35',
  minHeight: 28,
};

export function PipelineBoard() {
  const user = useAuthStore((s) => s.user);
  const openWindow = useChatWindowsStore((s) => s.openWindow);
  const [convos, setConvos] = useState<ConvoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  useEffect(() => {
    if (!user) { setConvos([]); setLoading(false); return; }

    // 2 queries: owner ของแปลง + co-broker ที่ accepted (denormalized cobrokerUids)
    const merged = new Map<string, ConvoRow>();
    const emit = () => {
      const rows = Array.from(merged.values());
      rows.sort((a, b) => {
        const ta = a.updatedAt?.toMillis?.() ?? 0;
        const tb = b.updatedAt?.toMillis?.() ?? 0;
        return tb - ta;
      });
      setConvos(rows);
      setLoading(false);
    };
    const handle = (snap: any) => {
      snap.docChanges().forEach((c: any) => {
        if (c.type === 'removed') {
          // อย่าลบ — อาจยังอยู่อีก query หนึ่ง (จะ overwrite ทับเอง)
          return;
        }
        const data = c.doc.data() as Omit<DMConvo, 'id'>;
        const peerUid = (data.participants || []).find((u: string) => u !== user.uid) || '';
        merged.set(c.doc.id, { id: c.doc.id, ...data, peerUid });
      });
      emit();
    };

    const qOwner = query(collection(db, 'dms'), where('plotOwnerUid', '==', user.uid));
    const qBroker = query(collection(db, 'dms'), where('cobrokerUids', 'array-contains', user.uid));
    const unsubA = onSnapshot(qOwner, handle, (e) => console.warn('[Pipeline owner]', e));
    const unsubB = onSnapshot(qBroker, handle, (e) => console.warn('[Pipeline broker]', e));
    return () => { unsubA(); unsubB(); };
  }, [user]);

  const grouped = useMemo(() => {
    const map: Record<PipelineStage, ConvoRow[]> = {
      interested: [], negotiating: [], offered: [], closed: [], lost: [],
    };
    for (const c of convos) {
      const stage: PipelineStage = c.pipelineStage || DEFAULT_PIPELINE_STAGE;
      map[stage].push(c);
    }
    return map;
  }, [convos]);

  async function changeStage(convoId: string, stage: PipelineStage) {
    try {
      await updateDoc(doc(db, 'dms', convoId), { pipelineStage: stage });
    } catch (e) {
      console.warn('[Pipeline] changeStage', e);
      alert('เปลี่ยน stage ไม่สำเร็จ');
    }
  }

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#7a9ab8' }}>
        กรุณาเข้าสู่ระบบ
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 32px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🗂 Pipeline</h1>
          <div style={{ fontSize: 12, color: '#7a9ab8', marginTop: 2 }}>
            จัดการดีล {convos.length} รายการ — ลากการ์ดข้ามคอลัมน์เพื่อเปลี่ยนสถานะ
          </div>
        </div>
        <a
          href="/"
          style={{
            fontSize: 12, color: '#40c4ff', textDecoration: 'none',
            border: '1px solid #213045', padding: '6px 12px', borderRadius: 8,
          }}
        >← กลับแผนที่</a>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: '#7a9ab8' }}>
          กำลังโหลด...
        </div>
      )}

      {!loading && convos.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center', color: '#7a9ab8',
          border: '1px dashed #213045', borderRadius: 12, marginTop: 20,
        }}>
          ยังไม่มีดีล — รอผู้ซื้อทักแชทมาที่แปลงของคุณ
        </div>
      )}

      {!loading && convos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
          gap: 12,
          overflowX: 'auto',
        }}>
          {PIPELINE_STAGES.map((s) => {
            const items = grouped[s.key];
            const isOver = dragOverStage === s.key;
            return (
              <div
                key={s.key}
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(s.key); }}
                onDragLeave={() => setDragOverStage((cur) => cur === s.key ? null : cur)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverStage(null);
                  if (draggingId) changeStage(draggingId, s.key);
                  setDraggingId(null);
                }}
                style={{
                  background: '#111c2b',
                  border: `1px solid ${isOver ? s.color : '#213045'}`,
                  borderRadius: 12,
                  padding: 10,
                  minHeight: 200,
                  transition: 'border-color .15s',
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 10, paddingBottom: 8,
                  borderBottom: '1px solid #213045',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, color: '#7a9ab8',
                    background: '#0d1520', padding: '2px 8px', borderRadius: 8,
                  }}>{items.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((c) => (
                    <PipelineCard
                      key={c.id}
                      convo={c}
                      onDragStart={() => setDraggingId(c.id)}
                      onDragEnd={() => { setDraggingId(null); setDragOverStage(null); }}
                      onChangeStage={(stage) => changeStage(c.id, stage)}
                      onOpenChat={() => {
                        if (!c.peerUid) return;
                        openWindow({
                          plotDocId: c.plotDocId,
                          peerUid: c.peerUid,
                          plotName: c.plotName,
                          peerName: '',
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  convo: ConvoRow;
  onDragStart: () => void;
  onDragEnd: () => void;
  onChangeStage: (s: PipelineStage) => void;
  onOpenChat: () => void;
}

function PipelineCard({ convo, onDragStart, onDragEnd, onChangeStage, onOpenChat }: CardProps) {
  const [peerName, setPeerName] = useState('');
  const stage = convo.pipelineStage || DEFAULT_PIPELINE_STAGE;

  useEffect(() => {
    if (!convo.peerUid) return;
    let cancelled = false;
    getDoc(doc(db, 'users', convo.peerUid))
      .then((snap) => { if (!cancelled) setPeerName((snap.data()?.displayName as string) || ''); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [convo.peerUid]);

  const updated = convo.updatedAt?.toDate?.();
  const updatedStr = updated ? updated.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) : '';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        background: '#0d1520',
        border: '1px solid #213045',
        borderRadius: 10,
        padding: 10,
        cursor: 'grab',
      }}
    >
      <div style={{
        fontSize: 12, fontWeight: 600, color: '#dce8f5',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        marginBottom: 4,
      }}>
        🏷 {convo.plotName || 'ที่ดิน'}
      </div>
      <button
        onClick={onOpenChat}
        style={{
          background: 'none', border: 'none', padding: 0,
          fontSize: 11, color: '#40c4ff', cursor: 'pointer',
          display: 'block', marginBottom: 6, textAlign: 'left',
        }}
      >
        💬 {peerName || 'ผู้ซื้อ'}
      </button>
      <div style={lastMsgStyle}>
        {convo.lastMessage || '—'}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 8, gap: 6,
      }}>
        <select
          value={stage}
          onChange={(e) => onChangeStage(e.target.value as PipelineStage)}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1, fontSize: 10, padding: '3px 4px',
            background: '#111c2b', border: '1px solid #213045',
            borderRadius: 6, color: '#dce8f5',
          }}
        >
          {PIPELINE_STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <span style={{ fontSize: 10, color: '#7a9ab8' }}>{updatedStr}</span>
      </div>
    </div>
  );
}
