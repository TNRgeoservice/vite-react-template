// ════════════════════════════════════════
// src/app/user/[uid]/page.tsx
// Public seller profile — avatar, verified badge, listings, stats
// URL: /user/[uid]
// ════════════════════════════════════════
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminDb } from '@/lib/firebase-admin';
import type { PlotPoint, UserProfile } from '@/types/plot';
import { ScrollableBody } from '@/components/plot/ScrollableBody';
import { AddFriendButton } from '@/components/contacts/AddFriendButton';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnrmaphub.netlify.app';

interface PublicProfile {
  uid: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  verified: boolean;
  joinedAt: string | null;
}

async function getUser(uid: string): Promise<PublicProfile | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    const d = snap.data() as Partial<UserProfile> | undefined;
    return {
      uid,
      displayName: d?.displayName || '',
      avatarUrl:   d?.avatarUrl   || '',
      bio:         d?.bio         || '',
      verified:    Boolean(d?.verified),
      joinedAt:    d?.createdAt?.toDate?.()?.toISOString() ?? null,
    };
  } catch (e) {
    console.error('[SSR] getUser error:', e);
    return null;
  }
}

interface RatingItem {
  raterName: string;
  stars: number;
  comment: string;
  plotName: string;
  plotDocId: string;
  createdAt: string | null;
}
interface RatingSummary {
  avg: number;
  count: number;
  recent: RatingItem[];
}

async function getRatings(uid: string): Promise<RatingSummary> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('ratings')
      .where('agentUid', '==', uid)
      .get();
    const items = snap.docs.map((d) => d.data());
    const count = items.length;
    if (count === 0) return { avg: 0, count: 0, recent: [] };
    const avg = items.reduce((s, r) => s + Number(r.stars || 0), 0) / count;
    const recent: RatingItem[] = items
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      .slice(0, 5)
      .map((r) => ({
        raterName: r.raterName || 'ผู้ใช้',
        stars: Number(r.stars || 0),
        comment: r.comment || '',
        plotName: r.plotName || '',
        plotDocId: r.plotDocId || '',
        createdAt: r.createdAt?.toDate?.()?.toISOString() ?? null,
      }));
    return { avg, count, recent };
  } catch (e) {
    console.error('[SSR] getRatings:', e);
    return { avg: 0, count: 0, recent: [] };
  }
}

async function getUserPlots(uid: string): Promise<PlotPoint[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('fieldsurvey_points')
      .where('ownerUid', '==', uid)
      .get();
    const items = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data?.type || 'land',
        name: data?.name || '',
        lat: data?.lat ?? null,
        lng: data?.lng ?? null,
        areaSqm: data?.areaSqm ?? null,
        priceTotal: data?.priceTotal ?? null,
        status: data?.status || 'available',
        titleType: data?.titleType ?? null,
        zoning: data?.zoning ?? null,
        roadAcc: data?.roadAcc ?? null,
        province: data?.province ?? null,
        amphoe: data?.amphoe ?? null,
        tambon: data?.tambon ?? null,
        locCode: data?.locCode ?? null,
        landmark: data?.landmark ?? null,
        notes: data?.notes ?? null,
        phone: data?.phone ?? null,
        photos: data?.photos || [],
        photoUrls: data?.photoUrls || [],
        ownerUid: data?.ownerUid ?? null,
        isFeatured: data?.isFeatured || false,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() ?? null,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() ?? null,
      } as PlotPoint;
    });
    items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    return items;
  } catch (e) {
    console.error('[SSR] getUserPlots error:', e);
    return [];
  }
}

export async function generateMetadata(
  { params }: { params: { uid: string } }
): Promise<Metadata> {
  const u = await getUser(params.uid);
  if (!u) return { title: 'ไม่พบผู้ใช้ | TNR MapHub' };
  const name = u.displayName || 'ผู้ขาย';
  const title = `${name}${u.verified ? ' ✓' : ''} | TNR MapHub`;
  const desc = u.bio || `ดูรายการที่ดินของ ${name}`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/user/${params.uid}`,
      type: 'profile',
      images: u.avatarUrl ? [{ url: u.avatarUrl, width: 400, height: 400, alt: name }] : undefined,
    },
  };
}

export default async function UserProfilePage(
  { params }: { params: { uid: string } }
) {
  const [u, plots, ratings] = await Promise.all([
    getUser(params.uid),
    getUserPlots(params.uid),
    getRatings(params.uid),
  ]);
  if (!u) notFound();

  const totalPlots = plots.length;
  const soldCount = plots.filter(p => p.status === 'sold').length;
  const availableCount = plots.filter(p => p.status === 'available').length;

  const joinedLabel = u.joinedAt
    ? new Date(u.joinedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' })
    : '—';

  const initial = (u.displayName || '?')[0].toUpperCase();

  return (
    <>
      <ScrollableBody />
      <div style={{
        minHeight: '100vh', background: '#0d1520', color: '#dce8f5',
        fontFamily: 'IBM Plex Sans Thai, sans-serif',
        maxWidth: 680, margin: '0 auto', padding: '20px 16px 90px',
      }}>
        <Link href="/" style={{ color: '#7a9ab8', fontSize: 12, textDecoration: 'none' }}>
          ← กลับหน้าแผนที่
        </Link>

        {/* Header */}
        <div style={{
          marginTop: 12, marginBottom: 16,
          background: '#162030', border: '1px solid #213045',
          borderRadius: 12, padding: 16,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {u.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.avatarUrl} alt={u.displayName}
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: '#213045',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 700, flexShrink: 0,
            }}>{initial}</div>
          )}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {u.displayName || 'ผู้ขาย'}
              </div>
              {u.verified && (
                <span title="ยืนยันตัวตนแล้ว" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 2,
                  background: '#40c4ff', color: '#0d1520',
                  padding: '2px 8px', borderRadius: 99,
                  fontSize: 10, fontWeight: 700,
                }}>✓ Verified</span>
              )}
            </div>
            {u.bio && (
              <div style={{ fontSize: 12, color: '#7a9ab8', marginTop: 4 }}>{u.bio}</div>
            )}
            <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 4 }}>
              เข้าร่วม: {joinedLabel}
            </div>
            <div style={{ marginTop: 10 }}>
              <AddFriendButton targetUid={u.uid} targetName={u.displayName || 'ผู้ใช้'} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8, marginBottom: 16,
        }}>
          {[
            { label: 'แปลงทั้งหมด', value: totalPlots, color: '#40c4ff' },
            { label: 'ว่างขาย',     value: availableCount, color: '#00e676' },
            { label: 'ขายแล้ว',     value: soldCount, color: '#ff5252' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#162030', border: '1px solid #213045',
              borderRadius: 12, padding: '12px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#7a9ab8', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Rating */}
        {ratings.count === 0 ? (
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            fontSize: 12, color: '#7a9ab8', textAlign: 'center',
          }}>
            ⭐ ยังไม่มีรีวิว
          </div>
        ) : (
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: 14, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#ffb300' }}>
                ⭐ {ratings.avg.toFixed(1)}
              </span>
              <span style={{ fontSize: 11, color: '#7a9ab8' }}>
                / 5 จาก {ratings.count} รีวิว
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ratings.recent.map((r, i) => (
                <div key={i} style={{
                  background: '#0d1520', border: '1px solid #213045',
                  borderRadius: 8, padding: '8px 10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ color: '#ffb300', fontSize: 12 }}>
                      {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                    </span>
                    <span style={{ fontSize: 11, color: '#7a9ab8' }}>· {r.raterName}</span>
                  </div>
                  {r.comment && (
                    <div style={{ fontSize: 12, color: '#dce8f5', marginTop: 4 }}>{r.comment}</div>
                  )}
                  {r.plotName && (
                    <div style={{ fontSize: 10, color: '#7a9ab8', marginTop: 4 }}>
                      🏷 <Link href={`/plot/${r.plotDocId}`} style={{ color: '#40c4ff', textDecoration: 'none' }}>{r.plotName}</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
          📍 รายการที่ดิน ({totalPlots})
        </div>
        {totalPlots === 0 ? (
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: 20, textAlign: 'center',
            fontSize: 12, color: '#7a9ab8',
          }}>ยังไม่มีรายการ</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plots.map((p) => {
              const thumb = p.photoUrls?.[0] || p.photos?.[0];
              const area = p.areaSqm != null
                ? (Number(p.areaSqm) >= 1600
                    ? (Number(p.areaSqm) / 1600).toFixed(2) + ' ไร่'
                    : Number(p.areaSqm).toFixed(0) + ' ตร.ม.')
                : '—';
              const price = (p.priceTotal != null && p.priceTotal !== '')
                ? '฿' + Number(p.priceTotal).toLocaleString('th-TH')
                : '—';
              const statusBadge = {
                available: { label: 'ว่าง',    bg: '#dcfce7', fg: '#15803d' },
                reserved:  { label: 'จอง',     bg: '#fef3c7', fg: '#92400e' },
                sold:      { label: 'ขายแล้ว', bg: '#fee2e2', fg: '#dc2626' },
              }[p.status || 'available'];
              const loc = [p.tambon, p.amphoe, p.province].filter(Boolean).join(' ');
              return (
                <Link key={p.id} href={`/plot/${p.id}`} style={{
                  display: 'flex', gap: 12, alignItems: 'center',
                  background: '#162030', border: '1px solid #213045',
                  borderRadius: 12, padding: 10, textDecoration: 'none', color: 'inherit',
                }}>
                  <div style={{
                    width: 64, height: 64, flexShrink: 0,
                    borderRadius: 8, overflow: 'hidden', background: '#213045',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 22 }}>🏞️</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 13, fontWeight: 700,
                    }}>
                      <span style={{
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{p.name || 'ที่ดิน'}</span>
                      {p.isFeatured && <span style={{ fontSize: 11 }}>⭐</span>}
                      <span style={{
                        marginLeft: 'auto', flexShrink: 0,
                        background: statusBadge.bg, color: statusBadge.fg,
                        fontSize: 9, fontWeight: 700,
                        padding: '2px 6px', borderRadius: 99,
                      }}>{statusBadge.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 2 }}>
                      {area} · {price}
                    </div>
                    <div style={{
                      fontSize: 11, color: '#7a9ab8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {loc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
