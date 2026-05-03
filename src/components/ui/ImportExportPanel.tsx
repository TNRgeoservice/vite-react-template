// ════════════════════════════════════════
// components/ui/ImportExportPanel.tsx
// SHP/GeoJSON import + SHP/CSV/Excel/GeoJSON export
// Visible only to admin/editor
// ════════════════════════════════════════
'use client';

import { useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePlotStore } from '@/store/plotStore';
import { fsSet, TS, COL } from '@/lib/firestore';
import {
  exportCSV, exportExcel, exportShpZip, exportGeoJSON,
  importGeoJSONFile, importShpZipFile,
} from '@/lib/import-export';
import type { PlotPoint } from '@/types/plot';

export function ImportExportPanel() {
  const role  = useAuthStore((s) => s.role);
  const user  = useAuthStore((s) => s.user);
  const plots = usePlotStore((s) => s.plots);
  const shpRef = useRef<HTMLInputElement>(null);
  const gjRef  = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState('');

  if (role !== 'admin' && role !== 'editor') return null;

  async function handleImport(file: File, kind: 'shp' | 'gj') {
    if (!user) return;
    setBusy(true);
    setMsg('');
    try {
      const items = kind === 'shp'
        ? await importShpZipFile(file)
        : await importGeoJSONFile(file);
      let n = 0;
      for (const it of items) {
        const id = String(Date.now()) + '_' + (n++);
        const data: Partial<PlotPoint> & Record<string, unknown> = {
          ...it,
          id,
          ownerUid: user.uid,
          status: it.status || 'available',
          createdAt: TS(),
          updatedAt: TS(),
        };
        await fsSet(COL, id, data, true);
      }
      setMsg(`✅ นำเข้า ${items.length} รายการ`);
    } catch (e) {
      setMsg('❌ ' + ((e as Error).message || 'นำเข้าไม่สำเร็จ'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-t border-[#213045] p-4 text-sm">
      <div className="mb-2 text-xs font-semibold text-[#7a9ab8]">📥 นำเข้า / 📤 ส่งออก</div>

      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={busy}
          onClick={() => shpRef.current?.click()}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          📂 SHP (.zip)
        </button>
        <button
          disabled={busy}
          onClick={() => gjRef.current?.click()}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          📂 GeoJSON
        </button>
        <button
          disabled={busy || !plots.length}
          onClick={() => exportShpZip(plots)}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          ⬇ SHP (.zip)
        </button>
        <button
          disabled={busy || !plots.length}
          onClick={() => exportGeoJSON(plots)}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          ⬇ GeoJSON
        </button>
        <button
          disabled={busy || !plots.length}
          onClick={() => exportCSV(plots)}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          📄 CSV
        </button>
        <button
          disabled={busy || !plots.length}
          onClick={() => exportExcel(plots)}
          className="rounded-lg bg-[#1e2d42] px-2 py-1.5 text-xs disabled:opacity-50"
        >
          📊 Excel
        </button>
      </div>

      {busy && <div className="mt-2 text-xs text-[#7a9ab8]">⏳ กำลังประมวลผล...</div>}
      {msg && <div className="mt-2 text-xs text-[#dce8f5]">{msg}</div>}

      <input
        ref={shpRef}
        type="file"
        accept=".zip"
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f, 'shp'); e.target.value = ''; }}
      />
      <input
        ref={gjRef}
        type="file"
        accept=".json,.geojson,application/geo+json,application/json"
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f, 'gj'); e.target.value = ''; }}
      />
    </div>
  );
}
