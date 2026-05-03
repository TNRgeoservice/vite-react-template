// ════════════════════════════════════════
// src/types/cobroker.ts
// Phase 3 #10 — Co-broker sharing
// ════════════════════════════════════════
import type { Timestamp } from 'firebase/firestore';

export type CobrokerStatus = 'pending' | 'accepted' | 'declined' | 'revoked';
/** invite = owner เชิญ broker | request = broker ขอ owner */
export type CobrokerDirection = 'invite' | 'request';

export interface Cobroker {
  id: string;
  plotDocId: string;
  plotName: string;
  ownerUid: string;
  ownerName: string;
  /** UID ของ broker (resolve จาก email ตอนเชิญ ถ้ามี user อยู่แล้ว) */
  brokerUid: string | null;
  brokerEmail: string;
  brokerName?: string;
  /** ส่วนแบ่งค่าคอม % (0-100) */
  commissionPct: number;
  status: CobrokerStatus;
  /** ทิศทางคำขอ — default 'invite' (legacy docs) */
  direction?: CobrokerDirection;
  invitedAt: Timestamp | null;
  respondedAt?: Timestamp | null;
  note?: string;
}
