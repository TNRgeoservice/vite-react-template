// ════════════════════════════════════════
// src/components/proximity/ProximityToggle.tsx
// Switch on/off + ขอ permission + แสดง state
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { useProximityStore } from '@/store/proximityStore';

export function ProximityToggle() {
  const enabled = useProximityStore((s) => s.enabled);
  const setEnabled = useProximityStore((s) => s.setEnabled);
  const [perm, setPerm] = useState<PermissionState | 'unknown'>('unknown');

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) return;
    let cancelled = false;
    navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((r) => {
      if (cancelled) return;
      setPerm(r.state);
      r.onchange = () => setPerm(r.state);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  async function onToggle(next: boolean) {
    if (!next) { setEnabled(false); return; }
    if (!navigator.geolocation) { alert('อุปกรณ์ไม่รองรับ GPS'); return; }
    // request permission ผ่าน getCurrentPosition (trigger native prompt)
    if (perm !== 'granted') {
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(() => resolve(), reject, { timeout: 15000 });
        });
      } catch {
        alert('ต้องอนุญาตการเข้าถึงตำแหน่งก่อน');
        return;
      }
    }
    setEnabled(true);
  }

  const stateLabel =
    perm === 'granted' ? '✓ อนุญาตแล้ว' :
    perm === 'denied'  ? '✗ ถูกปฏิเสธ (เปิดในตั้งค่าเบราว์เซอร์)' :
    perm === 'prompt'  ? 'รออนุญาต' : '';

  return (
    <div className="rounded-xl border border-[#213045] bg-[#162030] p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-1 accent-[#00e676] h-4 w-4"
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">📍 แจ้งเตือนแปลงน่าสนใจตามตำแหน่ง</div>
          <div className="mt-1 text-[11px] text-[#7a9ab8] leading-relaxed">
            ใช้ GPS ตรวจจับเมื่อขับรถเข้าใกล้แปลงในรัศมี 1 กม. ที่ตรงกับ "การค้นหาที่บันทึก" ของคุณ
            — ทำงานเฉพาะตอนเปิดเว็บอยู่ (ไม่ใช่ background)
          </div>
          {stateLabel && (
            <div className="mt-1 text-[10px] text-[#7a9ab8]">สถานะสิทธิ์: {stateLabel}</div>
          )}
          <div className="mt-1 text-[10px] text-[#ffb300]">
            ⚠ ใช้แบตเตอรี่เพิ่มขึ้นเล็กน้อย
          </div>
        </div>
      </label>
    </div>
  );
}
