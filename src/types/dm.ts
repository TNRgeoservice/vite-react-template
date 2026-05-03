// ════════════════════════════════════════
// src/types/dm.ts
// Direct Messages (DM) types
// ════════════════════════════════════════
import type { Timestamp } from 'firebase/firestore';

export interface DMMessage {
  id: string;
  text: string;
  imageUrls?: string[];
  senderUid: string;
  senderName: string;
  sentAt: Timestamp | null;
  seenBy?: Record<string, boolean>;
  /** True เมื่อเป็น system-generated message (reminder, cobroker invite ฯลฯ) */
  isSystem?: boolean;
  /** ลิงก์สำหรับ action — render เป็นปุ่มใน bubble */
  actionUrl?: string;
}

export type PipelineStage =
  | 'interested'   // สนใจ
  | 'negotiating'  // เจรจา
  | 'offered'      // เสนอราคา
  | 'closed'       // ปิดดีล
  | 'lost';        // ยกเลิก/หลุดดีล

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'interested',  label: 'สนใจ',     color: '#40c4ff' },
  { key: 'negotiating', label: 'เจรจา',    color: '#ffb300' },
  { key: 'offered',     label: 'เสนอราคา', color: '#ab47bc' },
  { key: 'closed',      label: 'ปิดดีล',   color: '#00e676' },
  { key: 'lost',        label: 'ยกเลิก',   color: '#ef4444' },
];

export const DEFAULT_PIPELINE_STAGE: PipelineStage = 'interested';

/** Sentinel for direct (friend-to-friend) chat that's not tied to a plot */
export const DIRECT_PLOT_ID = 'direct';

export interface DMConvo {
  id: string;
  participants: string[];
  participantUids: Record<string, boolean>;
  /** plotDocId หรือ 'direct' สำหรับแชทเพื่อนตรง (ไม่ผูกแปลง) */
  plotDocId: string;
  plotName: string;
  lastMessage: string;
  lastSenderUid: string;
  lastSenderName: string;
  updatedAt: Timestamp | null;
  seenBy?: Record<string, boolean>;
  typing?: Record<string, boolean>;
  /** Pipeline stage — set by owner of the plot. Default 'interested' */
  pipelineStage?: PipelineStage;
  /** Owner UID ของแปลง — denormalized เพื่อ query pipeline เร็ว */
  plotOwnerUid?: string;
  /** Co-broker UIDs ของแปลงนี้ (accepted) — denormalized เพื่อให้ broker เห็น convo ใน pipeline ได้ */
  cobrokerUids?: string[];
}

/** Convo ID = sorted(uid1,uid2) joined + plotDocId (หรือ 'direct') */
export function makeConvoId(uidA: string, uidB: string, plotDocId: string = DIRECT_PLOT_ID): string {
  const [a, b] = [uidA, uidB].sort();
  return `${a}_${b}_${plotDocId}`;
}

/** true ถ้า convo เป็นแชทเพื่อนตรง (ไม่ผูกแปลง) */
export function isDirectConvo(plotDocId: string | undefined | null): boolean {
  return !plotDocId || plotDocId === DIRECT_PLOT_ID;
}
