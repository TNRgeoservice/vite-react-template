// ════════════════════════════════════════
// src/app/plot/[id]/page.tsx
// SSR Plot Detail — full OG + JSON-LD per plot
// URL: /plot/[firestoreDocId]
// ════════════════════════════════════════
import type { Metadata } from 'next';
import { notFound }       from 'next/navigation';
import { getAdminDb }     from '@/lib/firebase-admin';
import type { PlotPoint } from '@/types/plot';
import { PlotChatDrawer }    from '@/components/dm/PlotChatDrawer';
import { PlotQRCode }        from '@/components/plot/PlotQRCode';
import { PlotShareButtons }  from '@/components/plot/PlotShareButtons';
import { ScrollableBody }    from '@/components/plot/ScrollableBody';
import { PlotViewTracker }   from '@/components/plot/PlotViewTracker';
import { CobrokerSection }   from '@/components/cobroker/CobrokerSection';
import { FeaturedPinButton } from '@/components/plot/FeaturedPinButton';
import { PlotGallery }       from '@/components/plot/PlotGallery';
import { PriceComparisonBadge } from '@/components/plot/PriceComparisonBadge';
import { getBuildingType, QUALITY_LABELS } from '@/lib/buildingPriceTable';
import { StatusCycleButton } from '@/components/plot/StatusCycleButton';
import { formatRevisionHistory } from '@/lib/revisions';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnrmaphub.netlify.app';

/** Serialize Firestore Timestamps in revisions → ISO string (for SSR-safe pass to client) */
function serializeRevisions(rev: any): Record<string, { value: any; at: string }[]> | null {
  if (!rev || typeof rev !== 'object') return null;
  const out: Record<string, { value: any; at: string }[]> = {};
  for (const k of Object.keys(rev)) {
    const arr = rev[k];
    if (!Array.isArray(arr)) continue;
    out[k] = arr.map((e: any) => ({
      value: e?.value ?? null,
      at:    e?.at?.toDate?.()?.toISOString?.() ?? (typeof e?.at === 'string' ? e.at : null),
    }));
  }
  return out;
}

async function getOwnerProfile(uid: string): Promise<{ name: string; phone: string }> {
  try {
    const db = getAdminDb();
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return { name: '', phone: '' };
    const d = snap.data();
    return { name: d?.displayName || '', phone: d?.phone || '' };
  } catch { return { name: '', phone: '' }; }
}

async function getPlot(id: string): Promise<PlotPoint | null> {
  try {
    const db   = getAdminDb();
    const snap = await db.collection('fieldsurvey_points').doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return {
      id: snap.id,
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
      polygon: data?.polygon,
      buildings: data?.buildings ?? null,
      buildingValueTotal: data?.buildingValueTotal ?? null,
      landPricePerSqWa: data?.landPricePerSqWa ?? null,
      closeType: data?.closeType ?? null,
      verifiedAt: data?.verifiedAt?.toDate?.()?.toISOString() ?? null,
      verifiedBy: data?.verifiedBy ?? null,
      hasWater:       data?.hasWater       !== false,
      hasElectricity: data?.hasElectricity !== false,
      revisions: serializeRevisions(data?.revisions),
      createdAt: data?.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() ?? null,
    } as PlotPoint;
  } catch(e) {
    console.error('[SSR] getPlot error:', e);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const plot = await getPlot(params.id);
  if (!plot) return { title: 'ไม่พบที่ดิน | TNR MapHub' };

  const title = `${plot.name || 'ที่ดิน'} — ${plot.province || ''} | TNR MapHub`;
  const desc  = [
    plot.areaSqm != null  ? `เนื้อที่ ${(+plot.areaSqm).toFixed(2)} ตร.ม.` : '',
    (plot.priceTotal != null && plot.priceTotal !== '') ? `ราคา ${Number(plot.priceTotal).toLocaleString('th-TH')} บาท` : '',
    plot.amphoe   ? `อ.${plot.amphoe}` : '',
    plot.province || '',
  ].filter(Boolean).join(' · ');

  const images = [
    ...(plot.photos    || []),
    ...(plot.photoUrls || []),
  ].filter(Boolean).slice(0, 1);

  const url = `${SITE_URL}/plot/${params.id}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url,
      type:   'website',
      images: images.length
        ? [{ url: images[0], width: 1200, height: 630, alt: plot.name }]
        : [{ url: `${SITE_URL}/icons/og-cover.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: desc,
      images:      images.length ? [images[0]] : [`${SITE_URL}/icons/og-cover.jpg`],
    },
    alternates: { canonical: url },
  };
}

function PlotJsonLd({ plot }: { plot: PlotPoint }) {
  const url    = `${SITE_URL}/plot/${plot.id}`;
  const images = [...(plot.photos||[]), ...(plot.photoUrls||[])].filter(Boolean);

  const jsonLd = {
    '@context':          'https://schema.org',
    '@type':             'RealEstateListing',
    name:                plot.name || 'ที่ดินเพื่อขาย',
    description:         [
      plot.areaSqm != null    ? `เนื้อที่ ${(+plot.areaSqm).toFixed(2)} ตร.ม.` : '',
      plot.titleType  ? `โฉนด: ${plot.titleType}` : '',
      plot.notes      || '',
    ].filter(Boolean).join('. '),
    url,
    image:               images.slice(0, 5),
    offers: {
      '@type':       'Offer',
      price:         String(plot.priceTotal || 0),
      priceCurrency: 'THB',
      availability:  plot.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      url,
    },
    address: {
      '@type':           'PostalAddress',
      addressLocality:   plot.amphoe   || '',
      addressRegion:     plot.province || '',
      addressCountry:    'TH',
    },
    geo: (plot.lat != null && plot.lng != null) ? {
      '@type':    'GeoCoordinates',
      latitude:   plot.lat,
      longitude:  plot.lng,
    } : undefined,
    floorSize: (plot.areaSqm != null) ? {
      '@type': 'QuantitativeValue',
      value:   plot.areaSqm,
      unitCode: 'MTK',
    } : undefined,
    telephone:  plot.phone || undefined,
    datePosted: plot.createdAt?.toDate?.()?.toISOString() || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  );
}

export default async function PlotPage({ params }: { params: { id: string } }) {
  const plot = await getPlot(params.id);
  if (!plot) notFound();

  const ownerProfile = plot.ownerUid ? await getOwnerProfile(plot.ownerUid) : { name: '', phone: '' };
  const ownerName = ownerProfile.name;
  // เบอร์ติดต่อ — ใช้ที่ระบุใน plot ก่อน (ของเก่า), ไม่งั้น fallback profile
  const contactPhone = plot.phone || ownerProfile.phone;
  const url = `${SITE_URL}/plot/${params.id}`;

  // #19: status pill ย้ายไปอยู่ใน <StatusCycleButton /> (label + สีจัดการเอง)

  const images = [...(plot.photos||[]), ...(plot.photoUrls||[])].filter(Boolean);
  const price  = (plot.priceTotal != null && plot.priceTotal !== '')
    ? Number(plot.priceTotal).toLocaleString('th-TH') + ' ฿'
    : 'ติดต่อสอบถาม';
  const area = (() => {
    if (plot.areaSqm == null) return '-';
    const sqm = +plot.areaSqm;
    if (!Number.isFinite(sqm) || sqm <= 0) return '-';
    const totalWa = sqm / 4;
    const rai  = Math.floor(sqm / 1600);
    const rest = sqm - rai * 1600;
    const ngan = Math.floor(rest / 400);
    const wa   = (rest - ngan * 400) / 4;
    const waStr = wa.toFixed(1);
    const totalWaStr = totalWa.toLocaleString('th-TH', { maximumFractionDigits: 0 });
    return `${rai}-${ngan}-${waStr} (${totalWaStr} ตร.ว.)`;
  })();
  // ราคา/ตร.วา — ใช้ landPricePerSqWa (cached) ถ้ามี, ไม่งั้น fallback คำนวณจาก priceTotal/area
  const buildingTotal = typeof plot.buildingValueTotal === 'number' ? plot.buildingValueTotal : 0;
  const hasBuildings = Array.isArray(plot.buildings) && plot.buildings.length > 0;
  const landPriceWa: number | null = (() => {
    if (typeof plot.landPricePerSqWa === 'number') return plot.landPricePerSqWa;
    if ((plot.priceTotal != null && plot.priceTotal !== '') && plot.areaSqm != null) {
      const sqm = Number(plot.areaSqm);
      const wa = sqm / 4;
      if (wa > 0) return (Number(plot.priceTotal) - buildingTotal) / wa;
    }
    return null;
  })();
  const fmtBaht = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

  return (
    <>
      <PlotJsonLd plot={plot} />
      <ScrollableBody />
      <PlotViewTracker plotDocId={plot.id} lat={plot.lat} lng={plot.lng} />

      <div style={{
        minHeight: '100vh', background: '#0d1520', color: '#dce8f5',
        fontFamily: 'IBM Plex Sans Thai, sans-serif',
        maxWidth: 680, margin: '0 auto', padding: '20px 16px 90px',
      }}>

        <div style={{ marginBottom: 20 }}>
          <a href="/" style={{ color: '#7a9ab8', fontSize: 12, textDecoration: 'none' }}>
            ← กลับหน้าแผนที่
          </a>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '10px 0 4px', color: '#dce8f5' }}>
            {plot.name || 'ที่ดินเพื่อขาย'}
          </h1>
          <div style={{ fontSize: 12, color: '#7a9ab8' }}>
            {[plot.tambon, plot.amphoe, plot.province].filter(Boolean).join(', ')}
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 12, marginBottom: 20,
        }}>
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ fontSize: 10, color: '#40c4ff', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              ราคา
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#dce8f5' }}>{price}</div>
            {hasBuildings && buildingTotal > 0 && (
              <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 4 }}>
                ราคาประเมินสิ่งปลูกสร้าง {fmtBaht(buildingTotal)} บาท
              </div>
            )}
            {landPriceWa != null && (
              <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 4 }}>
                {hasBuildings && buildingTotal > 0
                  ? `ราคาที่ดินไม่รวมสิ่งปลูกสร้าง ${fmtBaht(landPriceWa)} บาท/ตร.ว.`
                  : `ราคาที่ดิน ${fmtBaht(landPriceWa)} บาท/ตร.ว.`}
              </div>
            )}
          </div>
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StatusCycleButton
              plotDocId={plot.id}
              ownerUid={plot.ownerUid}
              initialStatus={plot.status || 'available'}
              initialCloseType={plot.closeType ?? null}
              initialRevisions={plot.revisions ?? null}
            />
          </div>
        </div>

        <PriceComparisonBadge
          selfId={plot.id}
          province={plot.province}
          lat={plot.lat}
          lng={plot.lng}
          selfPricePerWa={landPriceWa}
        />

        <PlotGallery images={images} alt={plot.name || 'ที่ดิน'} />

        <div style={{
          background: '#162030', border: '1px solid #213045',
          borderRadius: 12, overflow: 'hidden', marginBottom: 20,
        }}>
          {([
            ['เนื้อที่',    area,                                                                                          'areaSqm'],
            ['โฉนด',        plot.titleType || '-',                                                                         'titleType'],
            ['ผังเมือง',    plot.zoning    || '-',                                                                         'zoning'],
            ['ถนนเข้า',     plot.roadAcc   || '-',                                                                         'roadAcc'],
            ['สาธารณูปโภค', `${plot.hasWater ? '💧 น้ำ' : '🚫 ไม่มีน้ำ'} · ${plot.hasElectricity ? '⚡ ไฟ' : '🚫 ไม่มีไฟ'}`,  'hasWater'],
            ['ตำแหน่ง',     [plot.tambon, plot.amphoe, plot.province].filter(Boolean).join(', ') || '-',                  'province'],
            ['พิกัด GPS',   (plot.lat != null && plot.lng != null) ? `${plot.lat.toFixed(5)}, ${plot.lng.toFixed(5)}` : '-', 'lat'],
            ['ใกล้',        plot.landmark  || '-',                                                                         'landmark'],
          ] as Array<[string, string, string]>).map(([k, v, fieldKey]) => {
            const tip = formatRevisionHistory(plot.revisions?.[fieldKey] ?? null);
            const hasHist = !!tip;
            return (
              <div key={k} style={{
                display: 'flex', padding: '10px 16px',
                borderBottom: '1px solid #1e2d42', fontSize: 13,
              }}>
                <span style={{ color: '#7a9ab8', width: 90, flexShrink: 0 }}>{k}</span>
                <span
                  title={tip || undefined}
                  style={{
                    color: '#dce8f5',
                    whiteSpace: 'pre-line',
                    borderBottom: hasHist ? '1px dotted #40c4ff' : undefined,
                    cursor: hasHist ? 'help' : undefined,
                  }}
                >
                  {v}{hasHist ? ' ⓘ' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {hasBuildings && (
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, overflow: 'hidden', marginBottom: 20,
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid #1e2d42',
              fontSize: 12, fontWeight: 700, color: '#40c4ff', letterSpacing: 0.5,
            }}>
              🏠 สิ่งปลูกสร้าง ({plot.buildings!.length} หลัง)
            </div>
            {plot.buildings!.map((b, i) => {
              const entry = getBuildingType(b.typeCode);
              const age = Math.max(0, (new Date().getFullYear() + 543) - b.builtYearBE);
              return (
                <div key={i} style={{
                  padding: '12px 16px',
                  borderBottom: i < plot.buildings!.length - 1 ? '1px solid #1e2d42' : undefined,
                  fontSize: 13,
                }}>
                  <div style={{ color: '#dce8f5', fontWeight: 600, marginBottom: 6 }}>
                    {i + 1}. {entry?.label || b.typeCode}
                    <span style={{ marginLeft: 6, color: '#7a9ab8', fontSize: 11, fontWeight: 400 }}>
                      (รหัส {b.typeCode})
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 3, fontSize: 12 }}>
                    <span style={{ color: '#7a9ab8' }}>คุณภาพ</span>
                    <span style={{ color: '#dce8f5' }}>{QUALITY_LABELS[b.quality]}</span>
                    <span style={{ color: '#7a9ab8' }}>พื้นที่</span>
                    <span style={{ color: '#dce8f5', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {b.areaSqm.toLocaleString('th-TH')} ตร.ม.
                    </span>
                    <span style={{ color: '#7a9ab8' }}>ปีที่สร้าง</span>
                    <span style={{ color: '#dce8f5', fontFamily: 'IBM Plex Mono, monospace' }}>
                      พ.ศ. {b.builtYearBE} (อายุ {age} ปี)
                    </span>
                    <span style={{ color: '#7a9ab8' }}>ราคา/ตร.ม.</span>
                    <span style={{ color: '#dce8f5', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {b.pricePerSqm.toLocaleString('th-TH')} บาท
                    </span>
                    <span style={{ color: '#7a9ab8' }}>ราคาก่อนหักค่าเสื่อม</span>
                    <span style={{ color: '#dce8f5', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {fmtBaht(b.grossValue)} บาท
                    </span>
                    <span style={{ color: '#7a9ab8' }}>ค่าเสื่อมราคา</span>
                    <span style={{ color: '#ffb300', fontFamily: 'IBM Plex Mono, monospace' }}>
                      {b.depreciationRate.toFixed(2)}%
                    </span>
                    <span style={{ color: '#7a9ab8' }}>ราคาหลังหักค่าเสื่อม</span>
                    <span style={{ color: '#00e676', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
                      {fmtBaht(b.netValue)} บาท
                    </span>
                  </div>
                </div>
              );
            })}
            {buildingTotal > 0 && plot.buildings!.length > 1 && (
              <div style={{
                padding: '12px 16px', background: '#0d1520',
                fontSize: 13, display: 'flex', justifyContent: 'space-between',
              }}>
                <span style={{ color: '#7a9ab8' }}>รวมราคาประเมินสิ่งปลูกสร้าง (หลังหักค่าเสื่อม)</span>
                <span style={{ color: '#00e676', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
                  {fmtBaht(buildingTotal)} บาท
                </span>
              </div>
            )}
            <div style={{
              padding: '10px 16px', background: '#0a121b',
              borderTop: '1px solid #213045',
              fontSize: 11, color: '#7a9ab8', lineHeight: 1.5,
            }}>
              <div style={{ fontWeight: 600, color: '#dce8f5', marginBottom: 4 }}>
                📋 หมายเหตุการประเมิน
              </div>
              <div>
                ราคา/ตร.ม. อ้างอิง <b style={{ color: '#dce8f5' }}>บัญชีราคาประเมินทุนทรัพย์โรงเรือนสิ่งปลูกสร้าง พ.ศ. 2568-2569</b>
                {' '}โดยสมาคมผู้ประเมินค่าทรัพย์สินแห่งประเทศไทย (VAT) — ประกาศใช้ 1 พ.ค. 2567
              </div>
              <div style={{ marginTop: 4 }}>
                ค่าเสื่อมราคาคำนวณตาม <b style={{ color: '#dce8f5' }}>อายุปฏิทิน (Calendar Age)</b>
                {' '}ของประเภทโครงสร้าง (ไม้ / ครึ่งตึกครึ่งไม้ / ตึก) — เป็นเกณฑ์มาตรฐานเพื่ออ้างอิงเท่านั้น ไม่ใช่ราคาตลาดจริง
              </div>
            </div>
          </div>
        )}

        <PlotQRCode url={url} plot={plot} ownerName={ownerName} />

        {plot.notes && (
          <div style={{
            background: '#162030', border: '1px solid #213045',
            borderRadius: 12, padding: '14px 16px', marginBottom: 20,
            fontSize: 13, color: '#7a9ab8', lineHeight: 1.6,
          }}>
            {plot.notes}
          </div>
        )}

        {contactPhone && (
          <a href={`tel:${contactPhone}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '14px', borderRadius: 12,
            background: '#00e676', color: '#0d1520',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            marginBottom: 12,
           }}>
            📞 โทรหาผู้ขาย {contactPhone}
          </a>
        )}

        {plot.ownerUid && (
          <a href={`/user/${plot.ownerUid}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '10px', borderRadius: 10,
            background: '#162030', border: '1px solid #213045',
            color: '#dce8f5', fontSize: 13, textDecoration: 'none',
            marginBottom: 12,
          }}>
            👤 ดูโปรไฟล์ผู้ขาย{ownerName ? ` · ${ownerName}` : ''}
          </a>
        )}

        <PlotShareButtons url={url} />

        <div style={{ marginTop: 12 }}>
          <FeaturedPinButton plotDocId={plot.id} initialFeatured={!!plot.isFeatured} />
        </div>

        {plot.ownerUid && (
          <CobrokerSection
            plotDocId={plot.id}
            plotName={plot.name || 'ที่ดิน'}
            ownerUid={plot.ownerUid}
          />
        )}
      </div>

      <PlotChatDrawer
        plotDocId={plot.id}
        sellerUid={plot.ownerUid || ''}
        plotName={plot.name || 'ที่ดิน'}
      />
    </>
  );
}

export const dynamic = 'force-dynamic';
