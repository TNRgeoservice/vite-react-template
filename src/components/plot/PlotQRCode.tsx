// ════════════════════════════════════════
// components/plot/PlotQRCode.tsx
// QR code + ปุ่มพิมพ์รายงาน สำหรับหน้ารายละเอียดแปลง
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { PlotPoint } from '@/types/plot';
import { openPrintReport } from '@/lib/printReport';

interface Props {
  url:  string;      // URL ที่ QR ชี้ไป
  plot: PlotPoint;   // ข้อมูลแปลงเต็ม (ส่งต่อไป printReport)
  ownerName?: string; // ชื่อผู้ลงขาย (แสดงใน print report)
}

export function PlotQRCode({ url, plot, ownerName = '' }: Props) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: '#0d1520', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [url]);

  return (
    <div style={{
      background: '#162030', border: '1px solid #213045',
      borderRadius: 12, padding: 16, marginBottom: 20,
      display: 'flex', gap: 14, alignItems: 'center',
    }}>
      <div style={{
        width: 110, height: 110, background: '#fff', borderRadius: 8,
        padding: 6, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR code" style={{ width: '100%', height: '100%' }} />
        ) : (
          <span style={{ fontSize: 10, color: '#7a9ab8' }}>กำลังสร้าง…</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#dce8f5', marginBottom: 4 }}>
          QR Code แปลงนี้
        </div>
        <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 10, lineHeight: 1.5 }}>
          สแกนเพื่อเปิดหน้านี้ — หรือพิมพ์รายงาน A4 แบบเต็ม
        </div>
        <button
          type="button"
          onClick={() => openPrintReport(plot, 1, null, ownerName)}
          style={{
            padding: '8px 14px', borderRadius: 8,
            border: '1.5px solid #ffb300', background: 'transparent',
            color: '#ffb300', fontSize: 12, fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          🖨 พิมพ์รายงาน
        </button>
      </div>
    </div>
  );
}
