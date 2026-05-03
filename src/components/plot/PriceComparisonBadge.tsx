'use client';

// ════════════════════════════════════════
// PriceComparisonBadge — DEBUG mode (minSamples=1, console logs)
// ════════════════════════════════════════
import { useEffect, useState } from 'react';
import { getNearbyComparison, type NearbyComparison } from '@/lib/geoNearby';

interface Props {
  selfId: string;
  province: string | null;
  lat: number | null | undefined;
  lng: number | null | undefined;
  selfPricePerWa: number | null;
}

export function PriceComparisonBadge({ selfId, province, lat, lng, selfPricePerWa }: Props) {
  const [data, setData] = useState<NearbyComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugReason, setDebugReason] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    console.log('[PriceComparisonBadge] mount', { selfId, province, lat, lng, selfPricePerWa });
    if (!province || lat == null || lng == null || !selfPricePerWa || selfPricePerWa <= 0) {
      const reason = `missing input: province=${province} lat=${lat} lng=${lng} ppw=${selfPricePerWa}`;
      console.warn('[PriceComparisonBadge] hide -', reason);
      setDebugReason(reason);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await getNearbyComparison({
          selfId, province, lat, lng, selfPricePerWa,
          radiusKm: 5, minSamples: 1, // DEBUG
        });
        console.log('[PriceComparisonBadge] result', res);
        if (!cancelled) {
          if (!res) setDebugReason('no nearby samples (see [geoNearby] log)');
          setData(res);
        }
      } catch (e) {
        console.warn('[PriceComparisonBadge] error', e);
        if (!cancelled) setDebugReason('query error: ' + String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selfId, province, lat, lng, selfPricePerWa]);

  if (loading) {
    return (
      <div style={{
        marginBottom: 20, padding: '10px 14px', borderRadius: 10,
        background: '#0f1a26', border: '1px solid #213045',
        fontSize: 12, color: '#7a9ab8',
      }}>
        กำลังเทียบราคากับเพื่อนบ้าน...
      </div>
    );
  }

  // DEBUG: ถ้าไม่มี data แสดง reason แทนการ hide
  if (!data) {
    return (
      <div style={{
        marginBottom: 20, padding: '10px 14px', borderRadius: 10,
        background: '#1a1410', border: '1px dashed #5a4020',
        fontSize: 11, color: '#ffb300',
      }}>
        🔍 [DEBUG] PriceComparisonBadge ไม่แสดง: {debugReason}
      </div>
    );
  }

  const { diffPct, medianPricePerWa, sampleCount, radiusKm } = data;
  const cheaper = diffPct < 0;
  const near = Math.abs(diffPct) < 5;

  const tone = near
    ? { bg: '#1a2433', border: '#2d4666', accent: '#7a9ab8', icon: '≈' }
    : cheaper
      ? { bg: '#0d2a1f', border: '#1a5040', accent: '#00e676', icon: '↓' }
      : { bg: '#2a1f0d', border: '#5a4020', accent: '#ffb300', icon: '↑' };

  const headlineText = near
    ? 'ราคาใกล้เคียงค่าเฉลี่ย'
    : cheaper
      ? `ถูกกว่าเฉลี่ย ${Math.abs(diffPct).toFixed(0)}%`
      : `แพงกว่าเฉลี่ย ${Math.abs(diffPct).toFixed(0)}%`;

  const fmt = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

  return (
    <div style={{
      marginBottom: 20, padding: '12px 14px', borderRadius: 10,
      background: tone.bg, border: `1px solid ${tone.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: tone.accent + '20', color: tone.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, flexShrink: 0,
        }}>{tone.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: tone.accent }}>
            {headlineText}
          </div>
          <div style={{ fontSize: 11, color: '#7a9ab8', marginTop: 2 }}>
            เทียบจาก {sampleCount} แปลง ในรัศมี {radiusKm} กม.
          </div>
        </div>
      </div>
      <div style={{
        fontSize: 11, color: '#7a9ab8', paddingTop: 8,
        borderTop: '1px solid ' + tone.border,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ราคาแปลงนี้</span>
        <span style={{ color: '#dce8f5', fontWeight: 600 }}>
          {fmt(data.selfPricePerWa)} ฿/ตร.วา
        </span>
      </div>
      <div style={{
        fontSize: 11, color: '#7a9ab8', marginTop: 4,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ค่ากลางในละแวก</span>
        <span style={{ color: '#dce8f5', fontWeight: 600 }}>
          {fmt(medianPricePerWa)} ฿/ตร.วา
        </span>
      </div>
    </div>
  );
}
