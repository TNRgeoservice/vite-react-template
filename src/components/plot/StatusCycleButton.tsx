// ════════════════════════════════════════
// components/plot/StatusCycleButton.tsx
// #19 Status Cycle Button — owner/admin กดเพื่อ cycle 3 สถานะ
// available → reserved → sold → available
// ทุกครั้งที่เปลี่ยน → record revision (status) + update closeType
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { fsUpdate, COL, TS } from '@/lib/firestore';
import { pushRevision } from '@/lib/revisions';
import type { PlotStatus, PlotCloseType, RevisionEntry } from '@/types/plot';

const NEXT: Record<PlotStatus, PlotStatus> = {
  available: 'reserved',
  reserved:  'sold',
  sold:      'available',
};

const STATUS_LABEL: Record<PlotStatus, string> = {
  available: '✅ ว่างขาย',
  reserved:  '⏳ จองแล้ว',
  sold:      '🔴 ขายแล้ว',
};

interface Props {
  plotDocId:        string;
  ownerUid:         string | null;
  initialStatus:    PlotStatus;
  initialCloseType: PlotCloseType | null | undefined;
  initialRevisions: Record<string, RevisionEntry[]> | null | undefined;
}

export function StatusCycleButton({
  plotDocId, ownerUid, initialStatus, initialCloseType, initialRevisions,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);

  const [status,    setStatus]    = useState<PlotStatus>(initialStatus);
  const [closeType, setCloseType] = useState<PlotCloseType | null>(initialCloseType ?? null);
  const [revisions, setRevisions] = useState<Record<string, RevisionEntry[]>>(initialRevisions || {});
  const [busy, setBusy] = useState(false);

  const isOwner = !!user && !!ownerUid && user.uid === ownerUid;
  const isAdmin = role === 'admin';
  const canCycle = isOwner || isAdmin;

  const isVerifiedSale = status === 'sold' && closeType === 'verified';
  const label = status === 'sold'
    ? (isVerifiedSale ? '🛡️ Verified Sale' : '🔴 ขายแล้ว')
    : STATUS_LABEL[status];

  // ถ้าไม่ใช่ owner/admin → render เป็น pill เฉย ๆ
  if (!canCycle) {
    return (
      <span style={pillStyle(status, isVerifiedSale)}>
        {label}
      </span>
    );
  }

  async function handleClick() {
    if (busy) return;
    const next = NEXT[status];
    // closeType logic: เมื่อเปลี่ยนเป็น sold → ถ้าเดิม verified คงไว้, ไม่งั้น 'self'
    //                   ไม่ใช่ sold → null
    const nextCloseType: PlotCloseType | null =
      next === 'sold'
        ? (closeType === 'verified' ? 'verified' : 'self')
        : null;

    if (!confirm(`เปลี่ยนสถานะเป็น "${STATUS_LABEL[next]}" ?`)) return;

    setBusy(true);
    try {
      // push revision: เก็บค่า status เดิม
      const newRevisions = {
        ...revisions,
        status: pushRevision(revisions.status, status),
      };
      const update: Record<string, unknown> = {
        status:     next,
        closeType:  nextCloseType,
        revisions:  newRevisions,
        updatedAt:  TS(),
      };
      // ถ้าปิดการขาย → เอาออกจาก "ที่ดินแนะนำ" อัตโนมัติ
      if (next === 'sold') {
        update.isFeatured = false;
        update.featuredAt = null;
      }
      await fsUpdate(COL, plotDocId, update);
      setStatus(next);
      setCloseType(nextCloseType);
      setRevisions(newRevisions);
    } catch (e) {
      console.warn('[StatusCycleButton] update error:', e);
      alert('เปลี่ยนสถานะไม่สำเร็จ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      title={`กดเพื่อเปลี่ยนเป็น "${STATUS_LABEL[NEXT[status]]}"`}
      style={{
        ...pillStyle(status, isVerifiedSale),
        cursor: busy ? 'wait' : 'pointer',
        border: 'none',
        opacity: busy ? 0.6 : 1,
      }}
    >
      {busy ? '⏳ กำลังเปลี่ยน...' : `${label}  ↻`}
    </button>
  );
}

function pillStyle(status: PlotStatus, isVerifiedSale: boolean): React.CSSProperties {
  return {
    padding: '4px 12px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    background: status === 'available' ? '#dcfce7'
              : status === 'reserved'  ? '#fef3c7'
              : isVerifiedSale         ? '#dbeafe'
                                       : '#fee2e2',
    color:      status === 'available' ? '#15803d'
              : status === 'reserved'  ? '#92400e'
              : isVerifiedSale         ? '#1e40af'
                                       : '#dc2626',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };
}
