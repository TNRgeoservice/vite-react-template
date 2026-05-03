// ════════════════════════════════════════
// src/types/friendship.ts
// Friend system — Phase 2 #11
// ════════════════════════════════════════
import type { Timestamp } from 'firebase/firestore';

export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

export interface Friendship {
  id: string;
  /** Sorted UIDs — uidA < uidB lexicographically */
  uidA: string;
  uidB: string;
  /** Who initiated the request */
  requesterUid: string;
  status: FriendshipStatus;
  createdAt: Timestamp | null;
  respondedAt?: Timestamp | null;
  /** Denormalized display info for list UI (no extra reads) */
  uidAName?: string;
  uidBName?: string;
  uidAEmail?: string;
  uidBEmail?: string;
}

/** Doc ID for friendship = sorted(uidA,uidB) joined */
export function makeFriendshipId(u1: string, u2: string): string {
  const [a, b] = [u1, u2].sort();
  return `${a}_${b}`;
}

/** Get the other party's UID */
export function otherUid(f: Pick<Friendship, 'uidA' | 'uidB'>, meUid: string): string {
  return f.uidA === meUid ? f.uidB : f.uidA;
}
