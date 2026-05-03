'use client';
// ════════════════════════════════════════
// components/map/MapHub.tsx
// Main map — Leaflet (client-only, dynamic import parent)
// ════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db, COL } from '@/lib/firebase';
import { usePlotStore } from '@/store/plotStore';
import { getProvince } from '@/lib/provinces';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompareStore } from '@/store/compareStore';
import { useGovLayersStore } from '@/store/govLayersStore';
import { useHeatmapStore } from '@/store/heatmapStore';
import { useHeatmapLayer } from './useHeatmapLayer';
import { GOV_LAYERS, type GovLayerKey } from '@/lib/gov-layers';
import { getLocCode } from '@/lib/loc-codes';
import type { PlotPoint } from '@/types/plot';
import { openPrintReport } from '@/lib/printReport';
import { formatRevisionHistory } from '@/lib/revisions';

// Basemap tile URLs (ตาม legacy main.v2.js setBase)
const BASEMAPS: Record<string, { url: string; label: string }> = {
  gsat: {
    label: 'Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  },
  ghybrid: {
    label: 'Hybrid',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  },
  groad: {
    label: 'Road',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  },
  osm: {
    label: 'OSM',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
};

function markerColor(plot: PlotPoint): string {
  if (plot.status === 'sold')     return '#ff5252';
  if (plot.status === 'reserved') return '#ffb300';
  return '#00e676';
}

function formatBaht(n: number | string | null): string {
  const v = Number(n);
  return v ? v.toLocaleString('th-TH') + ' ฿' : '-';
}

function formatRai(sqm: number | string | null): string {
  const v = Number(sqm);
  return v ? (v / 1600).toFixed(2) + ' ไร่' : '-';
}

// Shoelace (flat earth, good enough for plots) — ตาม legacy calcPolygonArea
function calcPolygonArea(pts: { lat: number; lng: number }[]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = toRad(pts[i].lng) * Math.cos(toRad(pts[i].lat));
    const yi = toRad(pts[i].lat);
    const xj = toRad(pts[j].lng) * Math.cos(toRad(pts[j].lat));
    const yj = toRad(pts[j].lat);
    area += xi * yj - xj * yi;
  }
  return Math.abs(area / 2) * R * R;
}

export default function MapHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const govLayersRef = useRef<Partial<Record<GovLayerKey, L.TileLayer>>>({});
  const markersRef = useRef<Record<string, L.Layer>>({});
  const drawPolyRef = useRef<L.Polyline | null>(null);
  const drawFillRef = useRef<L.Polygon | null>(null);
  const drawPointsRef = useRef<{ lat: number; lng: number }[]>([]);
  const [basemap, setBasemap] = useState<keyof typeof BASEMAPS>('gsat');

  const plots = usePlotStore((s) => s.plots);
  const setPlots = usePlotStore((s) => s.setPlots);
  const mapFilter = usePlotStore((s) => s.mapFilter);
  const filters = usePlotStore((s) => s.filters);
  const setFilters = usePlotStore((s) => s.setFilters);
  const lastViewedPlotId = usePlotStore((s) => s.lastViewedPlotId);
  const setLastViewedPlotId = usePlotStore((s) => s.setLastViewedPlotId);
  const searchParams = useSearchParams();
  const plotFocusedRef = useRef<string | null>(null);
  const lastProvinceRef = useRef<string | null>(null);
  const lastViewedFlownRef = useRef<string | null>(null);

  const drawMode     = useUIStore((s) => s.drawMode);
  const setDrawMode  = useUIStore((s) => s.setDrawMode);
  const setEditing   = useUIStore((s) => s.setEditingPlot);
  const user         = useAuthStore((s) => s.user);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const { isFavorited, toggle: toggleFav } = useFavorites();
  const addCompare = useCompareStore((s) => s.add);
  const govActive = useGovLayersStore((s) => s.active);
  const govOpacity = useGovLayersStore((s) => s.opacity);
  const heatmapEnabled = useHeatmapStore((s) => s.enabled);
  const toggleHeatmap = useHeatmapStore((s) => s.toggle);

  // Heatmap layer (Phase 3 #9)
  useHeatmapLayer(mapRef.current);

  // ── Init map once ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [13.7563, 100.5018],
      zoom: 6,
      zoomControl: true,
    });
    mapRef.current = map;

    const initial = BASEMAPS.gsat;
    tileLayerRef.current = L.tileLayer(initial.url, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
    }).addTo(map);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error internal
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Switch basemap ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileLayerRef.current) return;
    map.removeLayer(tileLayerRef.current);
    const bm = BASEMAPS[basemap];
    tileLayerRef.current = L.tileLayer(bm.url, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
    }).addTo(map);
  }, [basemap]);

  // ── Gov layers (add/remove + opacity) ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (Object.keys(GOV_LAYERS) as GovLayerKey[]).forEach((key) => {
      const cfg = GOV_LAYERS[key];
      const want = govActive[key];
      const existing = govLayersRef.current[key];

      if (want && !existing) {
        let layer: L.TileLayer;
        if (cfg.type === 'wms') {
          layer = L.tileLayer.wms(cfg.url, {
            layers: cfg.layers,
            format: 'image/png',
            transparent: true,
            version: cfg.version,
            // parcel (DOL) WMS 1.3.0 ต้องใช้ EPSG:3857
            ...(cfg.version === '1.3.0' ? { crs: L.CRS.EPSG3857 } : {}),
            opacity: govOpacity,
            ...(cfg.minZoom ? { minZoom: cfg.minZoom } : {}),
          });
        } else {
          layer = L.tileLayer(cfg.url, {
            opacity: govOpacity,
            maxZoom: 20,
            ...(cfg.minZoom ? { minZoom: cfg.minZoom } : {}),
          });
        }
        layer.on('tileerror', () => {
          // quiet — บาง tile นอกพื้นที่ให้บริการเป็นปกติ
        });
        layer.addTo(map);
        govLayersRef.current[key] = layer;
      } else if (!want && existing) {
        map.removeLayer(existing);
        delete govLayersRef.current[key];
      } else if (want && existing) {
        existing.setOpacity(govOpacity);
      }
    });
  }, [govActive, govOpacity]);

  // ── Subscribe Firestore plots (by province only) ──
  useEffect(() => {
    // ยังไม่เลือกจังหวัด → ไม่โหลดแปลง
    if (!filters.province) {
      setPlots([]);
      return;
    }
    const q = query(collection(db, COL), where('province', '==', filters.province));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as PlotPoint[];
      setPlots(items);
    });
    return () => unsub();
  }, [setPlots, filters.province]);

  // ── Fly to province on change ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const prov = filters.province;
    if (!prov || prov === lastProvinceRef.current) return;
    const info = getProvince(prov);
    if (info) {
      map.flyTo([info.lat, info.lng], info.zoom, { duration: 0.8 });
    }
    lastProvinceRef.current = prov;
  }, [filters.province]);

  // ── Map click handler (draw + add) ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handler = (e: L.LeafletMouseEvent) => {
      if (!drawMode) return;
      if (!user) { setLoginOpen(true); return; }
      const { lat, lng } = e.latlng;

      if (drawMode === 'land') {
        setDrawMode(null);
        setEditing({ mode: 'create', type: 'land', lat, lng });
        return;
      }
      // polygon
      drawPointsRef.current.push({ lat, lng });
      const pts = drawPointsRef.current;
      if (!drawPolyRef.current) {
        drawPolyRef.current = L.polyline(
          pts.map((p) => [p.lat, p.lng]) as L.LatLngExpression[],
          { color: '#b388ff', weight: 3, dashArray: '6,4' }
        ).addTo(map);
      } else {
        drawPolyRef.current.addLatLng([lat, lng]);
      }
      if (pts.length >= 3) {
        if (drawFillRef.current) map.removeLayer(drawFillRef.current);
        drawFillRef.current = L.polygon(
          pts.map((p) => [p.lat, p.lng]) as L.LatLngExpression[],
          { color: '#b388ff', fillColor: '#b388ff', fillOpacity: 0.15, weight: 2 }
        ).addTo(map);
      }
    };

    map.on('click', handler);
    const container = map.getContainer();
    if (drawMode) container.classList.add('crosshair');
    else container.classList.remove('crosshair');

    return () => {
      map.off('click', handler);
    };
  }, [drawMode, user, setDrawMode, setEditing, setLoginOpen]);

  // ── Clear draw state when leaving draw mode ──
  useEffect(() => {
    const map = mapRef.current;
    if (drawMode) return; // only cleanup on exit
    drawPointsRef.current = [];
    if (drawPolyRef.current && map) { map.removeLayer(drawPolyRef.current); }
    if (drawFillRef.current && map) { map.removeLayer(drawFillRef.current); }
    drawPolyRef.current = null;
    drawFillRef.current = null;
  }, [drawMode]);

  function finishPolygon() {
    const pts = drawPointsRef.current;
    if (pts.length < 3) { alert('ต้องมี ≥3 จุด'); return; }
    const center = pts.reduce(
      (a, p) => ({ lat: a.lat + p.lat / pts.length, lng: a.lng + p.lng / pts.length }),
      { lat: 0, lng: 0 }
    );
    const areaSqm = calcPolygonArea(pts);
    const polygon = [...pts];
    setDrawMode(null); // triggers cleanup effect
    setEditing({ mode: 'create', type: 'polygon', lat: center.lat, lng: center.lng, areaSqm, polygon });
  }

  // ── Render markers ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    const filtered = plots.filter((p) => {
      if (mapFilter !== 'all' && p.status !== mapFilter) return false;
      if (p.lat == null || p.lng == null) return false;
      // ── SearchFilters (price / area / titleType / status) ──
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      // #18 sub-filter: เมื่อ status='sold' + closed='verified' → เอาเฉพาะ verified
      if (filters.status === 'sold' && filters.closed === 'verified' && p.closeType !== 'verified') return false;
      if (filters.titleType && p.titleType !== filters.titleType) return false;
      const price = Number(p.priceTotal) || 0;
      if (filters.priceMin != null && price < filters.priceMin) return false;
      if (filters.priceMax != null && price > filters.priceMax) return false;
      const area = Number(p.areaSqm) || 0;
      if (filters.areaMin != null && area < filters.areaMin) return false;
      if (filters.areaMax != null && area > filters.areaMax) return false;
      return true;
    });

    filtered.forEach((p) => {
      const onEditClick = () => setEditing({ mode: 'edit', plot: p });
      const onFavClick = () => toggleFav(p);
      const onCompareClick = () => {
        const r = addCompare(p);
        if (r === 'exists') alert('อยู่ในรายการเปรียบเทียบแล้ว');
        else if (r === 'full') alert('เปรียบเทียบได้สูงสุด 4 แปลง');
      };
      const onContactClick = () => {
        // ส่งข้อความหาผู้ขาย (DM) — ไปหน้า /plot/{id}?chat=1 ให้ PlotChatDrawer เปิด drawer ให้
        if (!p.ownerUid) { alert('ไม่มีข้อมูลผู้ขาย'); return; }
        if (!user) { setLoginOpen(true); return; }
        if (user.uid === p.ownerUid) { alert('นี่คือประกาศของคุณเอง'); return; }
        window.location.href = `/plot/${p.id}?chat=1`;
      };
      // locCode: ถ้าแปลงไม่มี (แปลงเก่า) ให้ lookup จาก province/amphoe/tambon
      const effectiveLocCode = p.locCode || getLocCode(p.province, p.amphoe, p.tambon);
      // คำนวณ sequence number: นับจำนวนแปลงใน locCode เดียวกันที่สร้างก่อนแปลงนี้ + 1
      const seqNo = (() => {
        if (!effectiveLocCode) return 1;
        const same = plots.filter((x) => {
          const code = x.locCode || getLocCode(x.province, x.amphoe, x.tambon);
          return code === effectiveLocCode;
        });
        same.sort((a, b) => {
          const at = a.createdAt?.seconds ?? 0;
          const bt = b.createdAt?.seconds ?? 0;
          return at - bt;
        });
        const idx = same.findIndex((x) => x.id === p.id);
        return idx >= 0 ? idx + 1 : same.length + 1;
      })();
      const onPrintClick = async () => {
        let ownerName = '';
        if (p.ownerUid) {
          try {
            const snap = await getDoc(doc(db, 'users', p.ownerUid));
            if (snap.exists()) {
              const u = snap.data() as { displayName?: string };
              ownerName = u.displayName || '';
            }
          } catch { /* ignore */ }
        }
        openPrintReport(p, seqNo, effectiveLocCode, ownerName);
      };
      const group = L.featureGroup().addTo(map);

      // Polygon fill (optional — วาดเมื่อมี geometry)
      if (p.type === 'polygon' && p.polygon?.length) {
        L.polygon(
          p.polygon.map((pt) => [pt.lat, pt.lng]) as L.LatLngExpression[],
          { color: markerColor(p), weight: 2, fillOpacity: 0.25 }
        ).addTo(group);
      }

      // Circle marker ที่ centroid เสมอ (land + polygon)
      if (p.lat != null && p.lng != null) {
        L.circleMarker([p.lat, p.lng], {
          radius: 8,
          color: '#fff',
          weight: 2,
          fillColor: markerColor(p),
          fillOpacity: 0.95,
        }).addTo(group);
      }

      const canContact = !!p.ownerUid && user?.uid !== p.ownerUid;
      group.bindPopup(buildPopupHtml(p, isFavorited(p.id), canContact), {
        maxWidth: 280,
        minWidth: 220,
        className: 'tnr-popup',
      });
      group.on('popupopen', () => wirePopup(group, p, onEditClick, onFavClick, onCompareClick, onContactClick, onPrintClick));
      markersRef.current[p.id] = group;
    });
  }, [plots, mapFilter, filters, setEditing, isFavorited, toggleFav, addCompare, user?.uid]);

  // ── Fly to plot from ?plot=type:id query param ──
  // ถ้ายังไม่ได้เลือกจังหวัด → ดึง plot จาก Firestore ตรงๆ แล้ว auto-set province
  // (ข้าม empty state, ไม่ต้องบังคับเลือกจังหวัดใหม่)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const q = searchParams?.get('plot');
    if (!q || plotFocusedRef.current === q) return;
    const id = q.includes(':') ? q.split(':')[1] : q;

    const flyToPlot = (plot: PlotPoint) => {
      if (plot.lat == null || plot.lng == null) return;
      plotFocusedRef.current = q;
      map.flyTo([plot.lat, plot.lng], 17, { duration: 1.2 });
      const marker = markersRef.current[plot.id];
      if (marker) setTimeout(() => (marker as L.FeatureGroup).openPopup(), 800);
    };

    // กรณี 1: plot อยู่ใน list แล้ว (เลือกจังหวัดถูกอยู่แล้ว) → flyTo เลย
    const existing = plots.find((p) => p.id === id);
    if (existing) {
      flyToPlot(existing);
      return;
    }

    // กรณี 2: plots ว่าง / คนละจังหวัด → ดึงจาก Firestore แล้ว set province
    (async () => {
      try {
        const snap = await getDoc(doc(db, COL, id));
        if (!snap.exists()) return;
        const data = snap.data() as Record<string, unknown>;
        const plot = { id: snap.id, ...data } as PlotPoint;
        const prov = (data.province as string) || null;
        if (prov && prov !== filters.province) {
          // set province → subscription จะโหลด plots ของจังหวัดนี้
          setFilters({ province: prov });
        }
        // flyTo ทันที ไม่ต้องรอ subscription (marker จะ open popup ตอน plots มา)
        flyToPlot(plot);
      } catch (err) {
        console.error('[MapHub] fetch plot for ?plot= failed:', err);
      }
    })();
  }, [searchParams, plots, filters.province, setFilters]);

  // ── flyTo lastViewedPlotId ตอน user back กลับแผนที่ ──
  // condition: ไม่มี ?plot= ใน URL (กัน double-fly) + plots พร้อม + ยังไม่เคย fly รอบนี้
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (searchParams?.get('plot')) return; // ?plot= effect จัดการเอง
    if (!lastViewedPlotId) return;
    if (lastViewedFlownRef.current === lastViewedPlotId) return;
    if (plots.length === 0) return;
    const plot = plots.find((p) => p.id === lastViewedPlotId);
    if (!plot || plot.lat == null || plot.lng == null) return;
    lastViewedFlownRef.current = lastViewedPlotId;
    map.flyTo([plot.lat, plot.lng], 17, { duration: 1.2 });
    const marker = markersRef.current[plot.id];
    if (marker) setTimeout(() => (marker as L.FeatureGroup).openPopup(), 800);
    // clear หลัง fly เสร็จ — กัน fly อีกตอน user เลื่อนแผนที่ไปดูแปลงอื่น
    setTimeout(() => setLastViewedPlotId(null), 2000);
  }, [plots, lastViewedPlotId, searchParams, setLastViewedPlotId]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Basemap switcher + Heatmap toggle (top-right) */}
      <div className="absolute right-3 top-3 z-[500] flex items-center gap-2">
        <button
          onClick={toggleHeatmap}
          title={heatmapEnabled ? 'ปิด Heatmap (จำนวน view)' : 'เปิด Heatmap (จำนวน view)'}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium backdrop-blur transition
            ${heatmapEnabled
              ? 'bg-[#ff1744] text-white'
              : 'bg-[#162030]/90 text-[#dce8f5]'}`}
        >
          🔥 Heat
        </button>
        <div className="flex gap-1 rounded-lg bg-[#162030]/90 p-1 text-xs backdrop-blur">
          {(Object.keys(BASEMAPS) as (keyof typeof BASEMAPS)[]).map((k) => (
            <button
              key={k}
              onClick={() => setBasemap(k)}
              className={`rounded px-2 py-1 font-medium transition ${
                basemap === k ? 'bg-[#00e676] text-black' : 'text-[#dce8f5]'
              }`}
            >
              {BASEMAPS[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* Plot count (bottom-left) */}
      <div className="absolute bottom-20 left-3 z-[500] rounded-lg bg-[#162030]/90 px-3 py-1.5 text-xs text-[#dce8f5] backdrop-blur">
        {plots.length} แปลง
      </div>

      {/* Draw toolbar (bottom-right) */}
      <div className="absolute bottom-5 right-3 z-[500] flex flex-col gap-2">
        {drawMode === null && (
          <>
            <button
              onClick={() => {
                if (!user) { setLoginOpen(true); return; }
                setDrawMode('land');
              }}
              className="rounded-full bg-[#00e676] px-4 py-2 text-sm font-semibold text-black shadow-lg"
            >
              ＋ เพิ่มที่ดิน
            </button>
            <button
              onClick={() => {
                if (!user) { setLoginOpen(true); return; }
                setDrawMode('polygon');
              }}
              className="rounded-full bg-[#b388ff] px-4 py-2 text-xs font-semibold text-black shadow-lg"
            >
              ✏️ วาดแปลง
            </button>
          </>
        )}

        {drawMode === 'land' && (
          <div className="flex flex-col gap-1 rounded-lg bg-[#162030] p-2 text-xs text-[#dce8f5] shadow-lg">
            <div>📍 คลิกแผนที่เพื่อปักหมุด</div>
            <button
              onClick={() => setDrawMode(null)}
              className="rounded bg-[#1e2d42] px-2 py-1 text-[#7a9ab8]"
            >
              ยกเลิก
            </button>
          </div>
        )}

        {drawMode === 'polygon' && (
          <div className="flex flex-col gap-1 rounded-lg bg-[#162030] p-2 text-xs text-[#dce8f5] shadow-lg">
            <div>📍 คลิกวางมุมแปลง (≥3 จุด)</div>
            <div className="flex gap-1">
              <button
                onClick={finishPolygon}
                className="flex-1 rounded bg-[#00e676] px-2 py-1 font-semibold text-black"
              >
                ✓ ปิดแปลง
              </button>
              <button
                onClick={() => setDrawMode(null)}
                className="rounded bg-[#1e2d42] px-2 py-1 text-[#7a9ab8]"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ST_LABEL: Record<string, string> = {
  available: 'ว่าง',
  reserved:  'จอง',
  sold:      'ขายแล้ว',
};

function fmtNum(n: number | string | null | undefined): string {
  const v = Number(n);
  if (!v || isNaN(v)) return '';
  return v.toLocaleString('th-TH');
}

function areaStrFromSqm(sqm: number | string | null | undefined): string {
  const v = Number(sqm);
  if (!v || isNaN(v)) return '';
  // 1 ไร่ = 1600 ตร.ม. · 1 งาน = 400 ตร.ม. · 1 ตร.ว. = 4 ตร.ม.
  const rai = Math.floor(v / 1600);
  const restNgan = v - rai * 1600;
  const ngan = Math.floor(restNgan / 400);
  const wa = Math.round((restNgan - ngan * 400) / 4);
  const parts: string[] = [];
  if (rai)  parts.push(`${rai} ไร่`);
  if (ngan) parts.push(`${ngan} งาน`);
  if (wa)   parts.push(`${wa} ตร.ว.`);
  return parts.join(' ');
}

function buildPopupHtml(p: PlotPoint, fav: boolean, canContact: boolean): string {
  const name = p.name || '(ไม่มีชื่อ)';
  const st = p.status || 'available';
  const stLabel = ST_LABEL[st] || st;
  const hasCoords = p.lat != null && p.lng != null;
  const price = fmtNum(p.priceTotal);
  const area  = areaStrFromSqm(p.areaSqm);
  const img   = (p.photoUrls && p.photoUrls[0]) || (p.photos && p.photos[0]) || null;

  // #19 revision tooltip — return title="..." snippet ถ้ามี history
  const tip = (fieldKey: string): string => {
    const hist = formatRevisionHistory(p.revisions?.[fieldKey] ?? null);
    return hist ? ` title="${escapeHtml(hist)}" style="border-bottom:1px dotted #40c4ff;cursor:help"` : '';
  };

  const row = (k: string, v: string, fieldKey?: string) =>
    `<div class="tnr-pop-r"><span class="tnr-pop-k">${escapeHtml(k)}</span><span class="tnr-pop-v"${fieldKey ? tip(fieldKey) : ''}>${v}</span></div>`;

  let rows = '';
  if (p.phone) {
    rows += `<div class="tnr-pop-r"><span class="tnr-pop-k">📞 ติดต่อ</span><a href="tel:${encodeURI(p.phone)}" class="tnr-pop-phone"${tip('phone')}>${escapeHtml(p.phone)}</a></div>`;
  }
  if (price) {
    rows += `<div class="tnr-pop-r"><span class="tnr-pop-k">💰 ราคาขาย</span><span class="tnr-pop-hl"${tip('priceTotal')}>${price} บาท</span></div>`;
  }
  if (area) {
    rows += `<div class="tnr-pop-r"><span class="tnr-pop-k">📐 เนื้อที่</span><span class="tnr-pop-area"${tip('areaSqm')}>${escapeHtml(area)}</span></div>`;
  }
  if (p.titleType) rows += row('ประเภทเอกสาร', escapeHtml(p.titleType), 'titleType');
  if (p.zoning)    rows += row('🏙️ ผังเมือง',  escapeHtml(p.zoning),    'zoning');
  if (p.roadAcc)   rows += row('🚗 ถนนเข้า',    escapeHtml(p.roadAcc),   'roadAcc');
  const locParts = [p.tambon, p.amphoe, p.province].filter(Boolean).join(' · ');
  if (locParts)    rows += row('📍 ที่ตั้ง',     escapeHtml(locParts),    'province');
  if (p.landmark)  rows += row('📍 ระยะ',       escapeHtml(p.landmark),  'landmark');

  const noteHtml = p.notes
    ? `<div class="tnr-pop-note">${escapeHtml(p.notes)}</div>`
    : '';

  const imgHtml = img
    ? `<img src="${img}" class="tnr-pop-img" alt="รูปแปลง" />`
    : '';

  const metaHtml = hasCoords
    ? `<div class="tnr-pop-meta">${(p.lat as number).toFixed(5)}, ${(p.lng as number).toFixed(5)}</div>`
    : '';

  // Action buttons (row 1)
  // ติดต่อ: แสดงเฉพาะเมื่อมีผู้ขาย (ownerUid) และไม่ใช่ตัวเอง — ส่ง DM ไม่ใช่โทร
  const showContact = canContact;
  const contactBtn = showContact
    ? `<button data-tnr-contact="${p.id}" class="tnr-pop-btn tnr-pop-contact">💬 ติดต่อผู้ขาย</button>`
    : '';
  const printBtn = `<button data-tnr-print="${p.id}" class="tnr-pop-btn tnr-pop-print" title="พิมพ์รายงาน">🖨 พิมพ์รายงาน</button>`;

  const actions = `
    <div class="tnr-pop-actions">
      <a href="/plot/${p.id}" class="tnr-pop-btn tnr-pop-detail">รายละเอียด</a>
      ${printBtn}
      ${contactBtn}
      <button data-tnr-compare="${p.id}" class="tnr-pop-btn" title="เพิ่มเข้าเปรียบเทียบ">⇆ เทียบ</button>
      <button data-tnr-edit="${p.id}" class="tnr-pop-btn">✏️ แก้</button>
    </div>
    <div class="tnr-pop-actions2">
      <button data-tnr-fav="${p.id}" class="tnr-pop-btn tnr-pop-fav">${fav ? '❤️ บันทึกแล้ว' : '🤍 บันทึก'}</button>
    </div>
  `;

  return `
    <div class="tnr-pop">
      <div class="tnr-pop-t">
        <span class="tnr-pop-name">${escapeHtml(name)}</span>
        <span class="tnr-st-tag tnr-st-${st}">${stLabel}</span>
        <button data-tnr-copylink="${p.id}" class="tnr-pop-copy" title="คัดลอกลิงก์แปลง">🔗 คัดลอก</button>
        <button data-tnr-line="${p.id}" class="tnr-pop-copy tnr-pop-line" title="แชร์ไป LINE">LINE</button>
      </div>
      ${rows}
      ${noteHtml}
      ${imgHtml}
      ${metaHtml}
      ${actions}
    </div>
  `;
}

function wirePopup(
  layer: L.Layer,
  plot: PlotPoint,
  onEdit: () => void,
  onFav: () => void,
  onCompare: () => void,
  onContact: () => void,
  onPrint: () => void,
) {
  const popup = (layer as unknown as { getPopup: () => L.Popup | undefined }).getPopup?.();
  const el = popup?.getElement();
  if (!el) return;
  const btnEdit = el.querySelector('[data-tnr-edit]') as HTMLButtonElement | null;
  if (btnEdit) btnEdit.onclick = onEdit;
  const btnFav = el.querySelector('[data-tnr-fav]') as HTMLButtonElement | null;
  if (btnFav) btnFav.onclick = (e) => {
    e.preventDefault();
    onFav();
    const isFav = btnFav.textContent?.includes('❤️');
    btnFav.textContent = isFav ? '🤍 บันทึก' : '❤️ บันทึกแล้ว';
  };
  const btnContact = el.querySelector('[data-tnr-contact]') as HTMLButtonElement | null;
  if (btnContact) btnContact.onclick = (e) => { e.preventDefault(); onContact(); };
  const btnCompare = el.querySelector('[data-tnr-compare]') as HTMLButtonElement | null;
  if (btnCompare) btnCompare.onclick = (e) => { e.preventDefault(); onCompare(); };
  const btnPrint = el.querySelector('[data-tnr-print]') as HTMLButtonElement | null;
  if (btnPrint) btnPrint.onclick = (e) => { e.preventDefault(); onPrint(); };
  const btnCopy = el.querySelector('[data-tnr-copylink]') as HTMLButtonElement | null;
  if (btnCopy) btnCopy.onclick = async (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/plot/${plot.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback: textarea trick
      const ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    const orig = btnCopy.textContent;
    btnCopy.textContent = '✓ คัดลอกแล้ว';
    btnCopy.classList.add('is-copied');
    setTimeout(() => {
      btnCopy.textContent = orig;
      btnCopy.classList.remove('is-copied');
    }, 2000);
  };
  const btnLine = el.querySelector('[data-tnr-line]') as HTMLButtonElement | null;
  if (btnLine) btnLine.onclick = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/plot/${plot.id}`;
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
