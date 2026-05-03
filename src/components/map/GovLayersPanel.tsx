// ════════════════════════════════════════
// components/map/GovLayersPanel.tsx
// Drawer section — toggles for gov overlays + opacity slider + legends
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import { useGovLayersStore } from '@/store/govLayersStore';
import {
  GOV_LAYERS,
  GOV_LEGENDS,
  DISPLAY_ORDER,
  type GovLayerKey,
} from '@/lib/gov-layers';

export function GovLayersPanel() {
  const active = useGovLayersStore((s) => s.active);
  const opacity = useGovLayersStore((s) => s.opacity);
  const toggle = useGovLayersStore((s) => s.toggle);
  const setOpacity = useGovLayersStore((s) => s.setOpacity);
  const [openLegend, setOpenLegend] = useState<GovLayerKey | null>(null);
  const [expanded, setExpanded] = useState(false);

  const anyActive = Object.values(active).some(Boolean);

  return (
    <div className="border-t border-[#213045] px-3 py-2 text-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between py-1 text-left text-[#dce8f5]"
      >
        <span className="font-semibold">🗺️ ซ้อนแผนที่ราชการ{anyActive ? ` (${Object.values(active).filter(Boolean).length})` : ''}</span>
        <span className="text-[#7a9ab8]">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1">
          {DISPLAY_ORDER.map(({ key, dot, sub }) => {
            const cfg = GOV_LAYERS[key];
            const on = active[key];
            const legend = GOV_LEGENDS[key];
            return (
              <div key={key} className="rounded-lg bg-[#0b1320] p-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ background: dot }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-[#dce8f5]">{cfg.name}</div>
                    {sub && <div className="truncate text-[11px] text-[#7a9ab8]">{sub}</div>}
                  </div>
                  {legend && (
                    <button
                      onClick={() => setOpenLegend(openLegend === key ? null : key)}
                      className="rounded bg-[#1e2d42] px-1.5 py-0.5 text-[11px] text-[#7a9ab8]"
                      title="คำอธิบายสี"
                    >
                      i
                    </button>
                  )}
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={on}
                      onChange={() => toggle(key)}
                    />
                    <div className="h-5 w-9 rounded-full bg-[#1e2d42] peer-checked:bg-[#00e676]" />
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
                  </label>
                </div>

                {legend && openLegend === key && (
                  <div className="mt-2 rounded bg-[#162030] p-2 text-[11px]">
                    <div className="mb-1 font-semibold text-[#dce8f5]">{legend.title}</div>
                    <div className="space-y-0.5">
                      {legend.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#b9c7d8]">
                          <span
                            className="h-3 w-3 flex-shrink-0 rounded-sm"
                            style={{ background: it.color }}
                          />
                          <span className="truncate">{it.label}</span>
                        </div>
                      ))}
                    </div>
                    {legend.note && (
                      <div className="mt-1 text-[10px] text-[#7a9ab8]">{legend.note}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-2 rounded-lg bg-[#0b1320] p-2">
            <div className="flex items-center justify-between text-[11px] text-[#7a9ab8]">
              <span>ความทึบ (opacity)</span>
              <span>{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="mt-1 w-full accent-[#00e676]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
