// ════════════════════════════════════════
// src/types/rating.ts
// Phase 4 #14 — Agent rating
// 1 raterUid ให้ rating ได้ 1 ครั้งต่อ (agentUid, plotDocId)
// ════════════════════════════════════════
import type { Timestamp } from 'firebase/firestore';

export interface AgentRating {
  id: string;
  agentUid: string;     // ผู้ที่ถูก rate (owner หรือ co-broker)
  raterUid: string;     // buyer
  raterName: string;
  plotDocId: string;
  plotName: string;
  stars: number;        // 1-5
  comment: string;
  createdAt: Timestamp | null;
}

export function makeRatingId(raterUid: string, agentUid: string, plotDocId: string): string {
  return `${raterUid}_${agentUid}_${plotDocId}`;
}
