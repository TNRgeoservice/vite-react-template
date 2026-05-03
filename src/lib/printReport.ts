// ════════════════════════════════════════
// lib/printReport.ts
// เปิดหน้าใหม่แสดง Print Report (A4) แล้วสั่ง window.print()
// Extract จาก MapHub.tsx เพื่อใช้ซ้ำในหน้ารายละเอียด /plot/[id]
// ════════════════════════════════════════
'use client';

import type { PlotPoint } from '@/types/plot';
import { getLocCode, buildDocNo } from '@/lib/loc-codes';
import { getBuildingType, QUALITY_LABELS } from '@/lib/buildingPriceTable';

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openPrintReport(
  p: PlotPoint,
  seqNo = 1,
  locCodeOverride: string | null = null,
  ownerName = '',
) {
  const ST: Record<string, string> = { available:'ว่าง', reserved:'จอง', sold:'ขายแล้ว' };
  const status  = p.status || 'available';
  const stLabel = ST[status] || status;

  const priceNum = Number(p.priceTotal);
  const priceStr = Number.isFinite(priceNum) && priceNum > 0
    ? priceNum.toLocaleString('th-TH') : 'ติดต่อสอบถาม';

  const sqm = typeof p.areaSqm === 'string' ? parseFloat(p.areaSqm) : (p.areaSqm ?? 0);
  const waNum = Number.isFinite(sqm) ? sqm / 4 : 0;

  // สิ่งปลูกสร้าง + ราคาที่ดินสุทธิ/ตร.วา
  const buildings = Array.isArray(p.buildings) ? p.buildings : [];
  const hasBuildings = buildings.length > 0;
  const buildingTotal = typeof p.buildingValueTotal === 'number'
    ? p.buildingValueTotal
    : buildings.reduce((s, b) => s + (b.netValue || 0), 0);
  const landValue = (Number.isFinite(priceNum) && priceNum > 0)
    ? priceNum - buildingTotal : 0;
  const landPriceWa = (waNum > 0 && Number.isFinite(priceNum) && priceNum > 0)
    ? Math.round(landValue / waNum) : null;
  const fmtBaht = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });

  const sqmInt = Math.round(Number.isFinite(sqm) ? sqm : 0);
  const rai  = Math.floor(sqmInt / 1600);
  const rest = sqmInt - rai * 1600;
  const ngan = Math.floor(rest / 400);
  const wa   = Math.round((rest - ngan * 400) / 4);
  const totalWa = Math.round(sqmInt / 4);
  const raiStr = sqmInt > 0
    ? `${rai}-${ngan}-${String(wa).padStart(2,'0')} ไร่ (${totalWa.toLocaleString('th-TH')} ตร.ว.)`
    : '-';

  const coord = (p.lat != null && p.lng != null)
    ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : '-';

  const imgs = Array.from(new Set([...(p.photos || []), ...(p.photoUrls || [])].filter(Boolean))).slice(0, 3);

  const loc = locCodeOverride || p.locCode || getLocCode(p.province, p.amphoe, p.tambon);
  const docNo = buildDocNo(loc, seqNo);
  const now = new Date();
  const thYear = now.getFullYear() + 543;
  const dateStr = `${now.getDate()}/${now.getMonth()+1}/${thYear}`;
  const dateTimeStr = `${now.getDate()}/${now.getMonth()+1}/${String(thYear).slice(-2)} ` +
    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const gmapUrl = (p.lat != null && p.lng != null)
    ? `https://maps.google.com/maps?q=${p.lat},${p.lng}&z=17&output=embed` : '';

  const plotUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/plot/${p.id}` : `/plot/${p.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(plotUrl)}`;

  const landmark = p.landmark || '-';
  const landType = p.titleType || 'ที่ดินเปล่า';
  const roadAcc  = p.roadAcc || '-';
  const elecWater = '-';

  const plotName = p.name || '(ไม่มีชื่อ)';

  // HTML ของตารางสิ่งปลูกสร้าง
  const buildingsHtml = hasBuildings ? `
    <div class="section-title sub-title">สิ่งปลูกสร้าง (${buildings.length} หลัง)</div>
    <table class="building-table">
      <thead>
        <tr>
          <th style="width:34%">ประเภท</th>
          <th style="width:14%">คุณภาพ</th>
          <th style="width:14%" class="num">พื้นที่</th>
          <th style="width:12%" class="num">ปีสร้าง</th>
          <th style="width:12%" class="num">ค่าเสื่อม</th>
          <th class="num">ราคาประเมิน</th>
        </tr>
      </thead>
      <tbody>
        ${buildings.map((b) => {
          const entry = getBuildingType(b.typeCode);
          const label = entry?.label || b.typeCode;
          return `<tr>
            <td>${escapeHtml(label)}</td>
            <td>${escapeHtml(QUALITY_LABELS[b.quality])}</td>
            <td class="num">${b.areaSqm.toLocaleString('th-TH')} ตร.ม.</td>
            <td class="num">${b.builtYearBE}</td>
            <td class="num">${b.depreciationRate.toFixed(2)}%</td>
            <td class="num">${fmtBaht(b.netValue)} ฿</td>
          </tr>`;
        }).join('')}
      </tbody>
      ${buildings.length > 1 ? `<tfoot>
        <tr><td colspan="5">รวมราคาประเมินสิ่งปลูกสร้าง (หลังหักค่าเสื่อม)</td>
          <td class="num">${fmtBaht(buildingTotal)} ฿</td></tr>
      </tfoot>` : ''}
    </table>
  ` : '';

  const html = `<!doctype html>
<html lang="th"><head><meta charset="utf-8"/>
<title>${docNo} · ${escapeHtml(plotName)}</title>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --primary-color:#0f172a;
    --accent-color:#2563eb;
    --status-green:#22c55e;
    --status-yellow:#eab308;
    --status-red:#ef4444;
    --text-main:#334155;
    --border-light:#e2e8f0;
  }
  *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{font-family:'Sarabun','IBM Plex Sans Thai',sans-serif;margin:0;padding:0;color:var(--text-main);background:#f8fafc}
  .page{width:210mm;height:297mm;padding:12mm 14mm;margin:8mm auto;background:#fff;box-shadow:0 0 10px rgba(0,0,0,.1);position:relative;display:flex;flex-direction:column}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid var(--primary-color);padding-bottom:8px;margin-bottom:12px}
  .brand h1{margin:0;font-size:22px;color:var(--primary-color);letter-spacing:1px;font-weight:700}
  .brand p{margin:3px 0 0;font-size:11px;color:var(--accent-color);font-weight:600;letter-spacing:1.5px}
  .doc-info{text-align:right;font-size:12px;line-height:1.5}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px}
  .grid.merged{align-items:stretch}
  .grid.merged > .col{display:flex;flex-direction:column}
  .grid.merged .contact-block{margin-top:auto}
  .grid.merged .sub-title{margin-top:14px;margin-bottom:8px}
  .section-title{font-size:14px;font-weight:700;color:var(--primary-color);border-left:4px solid var(--accent-color);padding:4px 8px;margin-bottom:8px;background:#f1f5f9}
  .map-container,.image-container{width:100%;height:175px;background:#e5e7eb;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid var(--border-light);position:relative}
  .map-container iframe{width:100%;height:100%;border:none;display:block}
  .map-container img,.image-container img{width:100%;height:100%;object-fit:cover}
  .image-stack{display:flex;flex-direction:column;gap:6px}
  .image-slot{width:100%;background:#e5e7eb;border:1px solid var(--border-light);border-radius:8px;overflow:hidden}
  .image-slot img{width:100%;height:auto;display:block}
  .placeholder{color:#94a3b8;font-size:13px}
  .map-coord{position:absolute;bottom:6px;right:6px;background:rgba(15,23,42,.78);color:#fff;padding:2px 7px;border-radius:5px;font-size:10px;font-family:ui-monospace,monospace}
  .coord-text{font-size:11px;color:#94a3b8;margin:3px 0 0}
  .info-table{width:100%;border-collapse:collapse}
  .info-table td{padding:5px 8px;border-bottom:1px solid var(--border-light);font-size:12px;vertical-align:top;line-height:1.4}
  .info-table tr:last-child td{border-bottom:none}
  .label{font-weight:600;color:#64748b;width:42%}
  .highlight-box{background:#eff6ff;padding:14px 16px;border-radius:8px;text-align:center;border:1px solid #bfdbfe}
  .price-tag{font-size:22px;font-weight:700;color:var(--accent-color);margin-top:4px;line-height:1.2}
  .price-avg{font-size:11px;color:#64748b;margin-top:4px;font-style:italic}
  .building-section{margin-top:10px}
  .building-table{width:100%;border-collapse:collapse;font-size:11px;margin-top:4px}
  .building-table th{background:#f1f5f9;color:#0f172a;font-weight:600;padding:5px 6px;text-align:left;border:1px solid var(--border-light)}
  .building-table td{padding:4px 6px;border:1px solid var(--border-light);vertical-align:top}
  .building-table .num{font-family:ui-monospace,monospace;text-align:right;white-space:nowrap}
  .building-table tfoot td{font-weight:700;background:#eff6ff;color:var(--accent-color)}
  .status-badge{display:inline-block;background:var(--status-green);color:#fff;padding:3px 14px;border-radius:20px;font-size:12px;margin-bottom:6px;font-weight:600}
  .status-badge.reserved{background:var(--status-yellow)}
  .status-badge.sold{background:var(--status-red)}
  .contact-line{font-size:13px;margin-top:10px}
  .contact-name{font-size:12px;color:#64748b;margin-top:2px}
  .contact-fixed{position:absolute;right:14mm;bottom:28mm;width:calc(50% - 21mm)}
  .footer-qr{display:flex;align-items:center;gap:16px;margin-top:auto;padding:12px 14px;border:1px dashed var(--border-light);border-radius:8px;width:calc(50% - 7mm)}
  .qr-code{width:84px;height:84px;flex-shrink:0}
  .qr-code img{width:100%;height:100%;display:block}
  .qr-info p{margin:0}
  .qr-info a{color:var(--accent-color);text-decoration:underline;font-size:11px;word-break:break-all}
  .page-no{position:absolute;bottom:5mm;right:14mm;font-size:10px;color:#cbd5e1}
  .toolbar{text-align:center;padding:14px}
  .print-btn{background:#1a7f37;color:#fff;border:none;border-radius:10px;padding:11px 34px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
  .print-btn:hover{background:#15692e}
  @media print{
    body{background:none}
    .page{margin:0;box-shadow:none;page-break-after:avoid;page-break-inside:avoid}
    .toolbar{display:none!important}
  }
  @page{size:A4;margin:0}
</style></head>
<body>
<div class="page">
  <header class="header">
    <div class="brand">
      <h1>TNR GEOSERVICE</h1>
      <p>LAND SURVEY &amp; GIS ANALYSIS SPECIALIST</p>
    </div>
    <div class="doc-info">
      <strong>เลขที่เอกสาร:</strong> ${docNo}<br>
      <strong>วันที่:</strong> ${dateStr}
    </div>
  </header>

  <div class="grid merged">
    <div class="col">
      <div class="section-title">ตำแหน่งที่ตั้ง (GIS MAP)</div>
      <div class="map-container">
        ${gmapUrl
          ? `<iframe src="${gmapUrl}" loading="lazy"></iframe><div class="map-coord">${coord}</div>`
          : `<div class="placeholder">— ไม่มีพิกัด —</div>`}
      </div>
      ${p.lat != null && p.lng != null ? `<p class="coord-text">พิกัด: ${coord}</p>` : ''}
      <div class="section-title sub-title">รายละเอียดที่ดิน</div>
      <table class="info-table">
        <tr><td class="label">ชื่อโครงการ/ที่ดิน</td><td>${escapeHtml(plotName)}</td></tr>
        <tr><td class="label">ขนาดเนื้อที่รวม</td><td>${escapeHtml(raiStr)}</td></tr>
        <tr><td class="label">ประเภทที่ดิน</td><td>${escapeHtml(landType)}</td></tr>
        <tr><td class="label">ทำเลใกล้เคียง</td><td style="white-space:pre-line">${escapeHtml(landmark)}</td></tr>
        <tr><td class="label">จังหวัด</td><td>${escapeHtml(p.province || '-')}</td></tr>
        <tr><td class="label">อำเภอ</td><td>${escapeHtml(p.amphoe || '-')}</td></tr>
        <tr><td class="label">ตำบล</td><td>${escapeHtml(p.tambon || '-')}</td></tr>
        <tr><td class="label">ถนนหน้าแปลงที่ดิน</td><td>${escapeHtml(roadAcc)}</td></tr>
        <tr><td class="label">ระบบสาธารณูปโภค</td><td>${escapeHtml(elecWater)}</td></tr>
      </table>
      ${buildingsHtml}
    </div>
    <div class="col right">
      <div class="section-title">ภาพประกอบโครงการ</div>
      ${imgs.length
        ? `<div class="image-stack">${
            imgs.map((u) => `<div class="image-slot"><img src="${escapeHtml(u)}" alt="ภาพแปลง"/></div>`).join('')
          }</div>`
        : `<div class="image-container"><div class="placeholder">— ไม่มีภาพ —</div></div>`}
    </div>
  </div>

  <div class="contact-fixed">
    <div class="highlight-box">
      <div class="status-badge ${status}">สถานะ: ${stLabel}</div>
      <div class="price-tag">${priceStr} บาท</div>
      ${hasBuildings && buildingTotal > 0
        ? `<div class="price-avg">ราคาประเมินสิ่งปลูกสร้าง ${fmtBaht(buildingTotal)} บาท</div>`
        : ''}
      ${landPriceWa != null
        ? `<div class="price-avg">${hasBuildings && buildingTotal > 0
            ? `ราคาที่ดินไม่รวมสิ่งปลูกสร้าง ${landPriceWa.toLocaleString('th-TH')} บาท/ตร.ว.`
            : `ราคาที่ดิน ${landPriceWa.toLocaleString('th-TH')} บาท/ตร.ว.`}</div>`
        : ''}
      <p class="contact-line"><strong>สนใจติดต่อ:</strong> ${escapeHtml(p.phone || '-')}</p>
      ${ownerName ? `<p class="contact-name">ผู้ลงขาย: ${escapeHtml(ownerName)}</p>` : ''}
    </div>
  </div>

  <div class="footer-qr">
    <div class="qr-code"><img src="${qrUrl}" alt="QR Map"/></div>
    <div class="qr-info">
      <p style="font-weight:700;color:var(--primary-color);font-size:14px">SCAN MAP</p>
      <p style="margin:5px 0;font-size:13px;color:#64748b">สแกนเพื่อดูรายละเอียดเพิ่มเติมผ่านระบบออนไลน์<br>ระบบ FieldSurvey Pro V5 · ${dateTimeStr}</p>
      <a href="${escapeHtml(plotUrl)}">${escapeHtml(plotUrl)}</a>
    </div>
  </div>

  <div class="page-no">หน้า 1/1</div>
</div>

<div class="toolbar">
  <button class="print-btn" onclick="window.print()">🖨 พิมพ์ / บันทึก PDF</button>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),800))</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) { alert('กรุณาอนุญาต pop-up เพื่อพิมพ์รายงาน'); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
