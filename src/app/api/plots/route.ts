// ════════════════════════════════════════
// src/app/api/plots/route.ts
// GET /api/plots — Firestore plot list (Admin SDK)
// Supports ?status=available|reserved|sold&limit=500
// ════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const url    = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit  = Math.min(Number(url.searchParams.get('limit') || 500), 5000);

    const db = getAdminDb();
    let q: FirebaseFirestore.Query = db.collection('fieldsurvey_points');
    if (status === 'available' || status === 'reserved' || status === 'sold') {
      q = q.where('status', '==', status);
    }
    q = q.limit(limit);

    const snap  = await q.get();
    const plots = snap.docs.map((d) => {
      const { phone, ownerUid, ...data } = d.data();
      // Drop server Timestamp objects — convert to ISO for JSON safety
      // phone/ownerUid excluded: this endpoint is public and unauthenticated
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ count: plots.length, plots });
  } catch (e) {
    console.error('[api/plots] error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
