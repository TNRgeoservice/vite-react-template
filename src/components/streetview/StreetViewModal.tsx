// ════════════════════════════════════════
// components/streetview/StreetViewModal.tsx
// Google Street View iframe modal with satellite fallback
// Port of js/streetview.js
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface StreetViewState {
  open: boolean;
  lat: number | null;
  lng: number | null;
  label: string;
  openSV: (lat: number, lng: number, label?: string) => void;
  close: () => void;
}

export const useStreetView = create<StreetViewState>((set) => ({
  open: false,
  lat: null,
  lng: null,
  label: '',
  openSV: (lat, lng, label = 'ตำแหน่งแปลงที่ดิน') => set({ open: true, lat, lng, label }),
  close: () => set({ open: false }),
}));

const KEY = process.env.NEXT_PUBLIC_GMAPS_API_KEY || '';

export function StreetViewModal() {
  const { open, lat, lng, label, close } = useStreetView();
  const [mode, setMode] = useState<'sv' | 'map'>('sv');

  useEffect(() => {
    if (!open) return;
    setMode('sv');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!open || lat == null || lng == null) return null;

  const svUrl = `https://www.google.com/maps/embed/v1/streetview?key=${KEY}&location=${lat},${lng}&heading=0&pitch=0&fov=90`;
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${KEY}&center=${lat},${lng}&zoom=19&maptype=satellite`;
  const src = mode === 'sv' ? svUrl : mapUrl;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-[2100] flex flex-col items-center justify-center bg-black/85"
    >
      <div className="relative w-[min(96vw,700px)] overflow-hidden rounded-2xl bg-[#0d1520] shadow-[0_20px_60px_rgba(0,0,0,.8)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#213045] px-4 py-3">
          <div>
            <div className="text-[13px] font-semibold text-[#dce8f5]">{label}</div>
            <div className="font-mono text-[10px] text-[#3d5672]">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode(mode === 'sv' ? 'map' : 'sv')}
              className="rounded-md border border-[#213045] bg-[#1e2d42] px-3 py-1 text-[11px] text-[#7a9ab8]"
              title="สลับ Street View / แผนที่"
            >
              {mode === 'sv' ? '🗺 แผนที่' : '🚶 Street View'}
            </button>
            <button
              onClick={close}
              className="rounded-md border border-[#213045] bg-[#1e2d42] px-3 py-1 text-[11px] font-bold text-[#ff5252]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Iframe */}
        <div className="relative aspect-video w-full">
          <iframe
            key={src /* force re-mount on mode switch for loading indicator */}
            src={src}
            className="block h-full w-full border-0"
            allowFullScreen
          />
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#213045] px-4 py-2.5">
          <a
            href={`https://www.google.com/maps/@${lat},${lng},19z/data=!3m1!1e3`}
            target="_blank"
            rel="noopener"
            className="text-[11px] text-[#40c4ff]"
          >
            🔗 เปิดใน Google Maps
          </a>
          <span className="text-[#213045]">|</span>
          <a
            href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`}
            target="_blank"
            rel="noopener"
            className="text-[11px] text-[#00e676]"
          >
            🧭 นำทาง (Waze)
          </a>
          <span className="text-[#213045]">|</span>
          <span className="font-mono text-[10px] text-[#3d5672]">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        </div>
      </div>
    </div>
  );
}
