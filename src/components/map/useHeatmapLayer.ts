// ════════════════════════════════════════
// components/map/useHeatmapLayer.ts
// Phase 3 #9 — Leaflet heatmap layer (uses leaflet.heat plugin)
//
// - Subscribe to plotViews collection
// - Build [lat, lng, intensity] points from { count, lat, lng }
// - Add/remove L.heatLayer based on enabled state
// ════════════════════════════════════════
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHeatmapStore } from '@/store/heatmapStore';

// leaflet.heat ขยาย L แต่ไม่มี types — declare module
type HeatPoint = [number, number, number]; // [lat, lng, intensity 0..1]
interface HeatLayer extends L.Layer {
  setLatLngs: (pts: HeatPoint[]) => HeatLayer;
}
interface HeatLeaflet {
  heatLayer: (latlngs: HeatPoint[], options?: Record<string, unknown>) => HeatLayer;
}

let heatPluginLoaded: Promise<void> | null = null;
function loadHeatPlugin(): Promise<void> {
  if (heatPluginLoaded) return heatPluginLoaded;
  heatPluginLoaded = new Promise<void>((resolve, reject) => {
    if ((L as unknown as HeatLeaflet).heatLayer) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('failed to load leaflet.heat'));
    document.head.appendChild(s);
  });
  return heatPluginLoaded;
}

export function useHeatmapLayer(map: L.Map | null) {
  const enabled = useHeatmapStore((s) => s.enabled);
  const layerRef = useRef<HeatLayer | null>(null);
  const pointsRef = useRef<HeatPoint[]>([]);

  // Subscribe plotViews → build points
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'plotViews'), (snap) => {
      const pts: HeatPoint[] = [];
      let maxCount = 1;
      snap.forEach((d) => {
        const v = d.data();
        const count = Number(v.count) || 0;
        if (count > maxCount) maxCount = count;
      });
      snap.forEach((d) => {
        const v = d.data();
        const lat = Number(v.lat);
        const lng = Number(v.lng);
        const count = Number(v.count) || 0;
        if (!isFinite(lat) || !isFinite(lng) || count <= 0) return;
        // Normalize 0..1 (intensity) — sqrt smooth
        const intensity = Math.min(1, Math.sqrt(count / maxCount));
        pts.push([lat, lng, intensity]);
      });
      pointsRef.current = pts;
      if (layerRef.current) layerRef.current.setLatLngs(pts);
    }, (err) => {
      console.warn('[heatmap] subscribe', err);
    });
    return unsub;
  }, []);

  // Add/remove layer based on `enabled`
  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    if (enabled) {
      loadHeatPlugin().then(() => {
        if (cancelled || !map) return;
        const heatL = (L as unknown as HeatLeaflet);
        if (!heatL.heatLayer) return;
        if (!layerRef.current) {
          layerRef.current = heatL.heatLayer(pointsRef.current, {
            radius: 28,
            blur: 22,
            maxZoom: 17,
            minOpacity: 0.35,
            gradient: {
              0.2: '#40c4ff',
              0.5: '#ffeb3b',
              0.8: '#ff9100',
              1.0: '#ff1744',
            },
          });
          layerRef.current.addTo(map);
        }
      }).catch((e) => console.warn('[heatmap] plugin load', e));
    } else if (layerRef.current && map) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    return () => { cancelled = true; };
  }, [enabled, map]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (layerRef.current && map) {
        try { map.removeLayer(layerRef.current); } catch {/* noop */}
        layerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
