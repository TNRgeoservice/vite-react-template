// ════════════════════════════════════════
// src/lib/import-export.ts
// SHP (read only via shpjs) / GeoJSON / CSV / Excel (read+write via xlsx)
// Note: SHP write not implemented — export SHP produces GeoJSON .zip
//       (same download UX; most GIS tools consume either)
// ════════════════════════════════════════
'use client';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
// shpjs has no bundled types — declare inline
import shp from 'shpjs';
import type { PlotPoint } from '@/types/plot';

// ── Helpers ────────────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function plotsToFeatureCollection(plots: PlotPoint[]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const p of plots) {
    const { lat, lng, polygon, ...props } = p;
    if (p.type === 'polygon' && polygon?.length) {
      const ring: number[][] = polygon.map((pt) => [pt.lng, pt.lat]);
      if (ring.length && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
        ring.push(ring[0]);
      }
      features.push({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [ring] },
        properties: props as GeoJSON.GeoJsonProperties,
      });
    } else if (lat != null && lng != null) {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        properties: props as GeoJSON.GeoJsonProperties,
      });
    }
  }
  return { type: 'FeatureCollection', features };
}

function plotToFlatRow(p: PlotPoint): Record<string, unknown> {
  return {
    id:         p.id,
    type:       p.type,
    name:       p.name,
    lat:        p.lat ?? '',
    lng:        p.lng ?? '',
    areaSqm:    p.areaSqm ?? '',
    priceTotal: p.priceTotal ?? '',
    status:     p.status,
    titleType:  p.titleType ?? '',
    zoning:     p.zoning ?? '',
    roadAcc:    p.roadAcc ?? '',
    province:   p.province ?? '',
    amphoe:     p.amphoe ?? '',
    tambon:     p.tambon ?? '',
    locCode:    p.locCode ?? '',
    landmark:   p.landmark ?? '',
    notes:      p.notes ?? '',
    phone:      p.phone ?? '',
    ownerUid:   p.ownerUid ?? '',
    isFeatured: p.isFeatured ? 1 : 0,
    photos:     (p.photos || []).join('|'),
  };
}

// ── Export ──────────────────────────────────────────────────────────────────

export function exportCSV(plots: PlotPoint[], filename = 'plots.csv') {
  const rows = plots.map(plotToFlatRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  // UTF-8 BOM — Excel-compatible Thai characters
  downloadBlob(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }), filename);
}

export function exportExcel(plots: PlotPoint[], filename = 'plots.xlsx') {
  const rows = plots.map(plotToFlatRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'plots');
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  downloadBlob(
    new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    filename,
  );
}

export function exportGeoJSON(plots: PlotPoint[], filename = 'plots.geojson') {
  const fc = plotsToFeatureCollection(plots);
  downloadBlob(
    new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' }),
    filename,
  );
}

/**
 * Export plots as zipped GeoJSON (filename .zip).
 * SHP writer not bundled — GeoJSON-in-zip is accepted by QGIS/Mapshaper/ArcGIS Online.
 */
export async function exportShpZip(plots: PlotPoint[], filename = 'plots.zip') {
  const fc = plotsToFeatureCollection(plots);
  const zip = new JSZip();
  zip.file('plots.geojson', JSON.stringify(fc));
  zip.file(
    'README.txt',
    'Export จาก TNR MapHub\nไฟล์ plots.geojson เปิดได้โดย QGIS / ArcGIS / Mapshaper\n',
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, filename);
}

// ── Import ──────────────────────────────────────────────────────────────────

/** Convert a GeoJSON FeatureCollection → partial PlotPoint[] (ids + timestamps คืนให้ caller set) */
export function featuresToPlots(fc: GeoJSON.FeatureCollection): Partial<PlotPoint>[] {
  const out: Partial<PlotPoint>[] = [];
  for (const f of fc.features) {
    if (!f.geometry) continue;
    const props = (f.properties || {}) as Record<string, unknown>;

    if (f.geometry.type === 'Point') {
      const [lng, lat] = f.geometry.coordinates as [number, number];
      out.push({ ...(props as Partial<PlotPoint>), type: 'land', lat, lng });
    } else if (f.geometry.type === 'Polygon') {
      const ring = (f.geometry.coordinates[0] || []) as [number, number][];
      const polygon = ring.map(([lng, lat]) => ({ lat, lng }));
      // centroid (rough avg)
      const n = polygon.length || 1;
      const cLat = polygon.reduce((a, p) => a + p.lat, 0) / n;
      const cLng = polygon.reduce((a, p) => a + p.lng, 0) / n;
      out.push({
        ...(props as Partial<PlotPoint>),
        type: 'polygon',
        lat: cLat,
        lng: cLng,
        polygon,
      });
    }
  }
  return out;
}

export async function importGeoJSONFile(file: File): Promise<Partial<PlotPoint>[]> {
  const text = await file.text();
  const json = JSON.parse(text) as GeoJSON.FeatureCollection;
  return featuresToPlots(json);
}

export async function importShpZipFile(file: File): Promise<Partial<PlotPoint>[]> {
  const buf = await file.arrayBuffer();
  // shpjs returns FeatureCollection or array of them
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = (await (shp as any)(buf)) as GeoJSON.FeatureCollection | GeoJSON.FeatureCollection[];
  const collections = Array.isArray(parsed) ? parsed : [parsed];
  const out: Partial<PlotPoint>[] = [];
  for (const fc of collections) {
    out.push(...featuresToPlots(fc));
  }
  return out;
}
