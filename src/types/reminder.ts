// ════════════════════════════════════════
// src/types/reminder.ts
// Follow-up reminder types (Phase 2 #7)
// ════════════════════════════════════════
import type { Timestamp } from 'firebase/firestore';

export interface Reminder {
  id: string;
  ownerUid: string;          // ใครตั้ง
  convoId: string;           // FK → dms/{convoId}
  plotDocId: string;
  plotName: string;
  peerUid: string;           // อีกฝั่งที่จะทักต่อ
  peerName: string;
  scheduledAt: Timestamp | null;
  note: string;
  sent: boolean;
  sentAt: Timestamp | null;
  cancelled: boolean;
  createdAt: Timestamp | null;
}

export type ReminderPreset = '1d' | '3d' | '7d' | 'custom';

export function presetToDate(preset: ReminderPreset, customIso?: string): Date | null {
  const now = Date.now();
  switch (preset) {
    case '1d': return new Date(now + 24 * 60 * 60 * 1000);
    case '3d': return new Date(now + 3 * 24 * 60 * 60 * 1000);
    case '7d': return new Date(now + 7 * 24 * 60 * 60 * 1000);
    case 'custom': return customIso ? new Date(customIso) : null;
  }
}
