// ════════════════════════════════════════
// components/plot/PlotViewTracker.tsx
// Client-only — log view + เก็บ lastViewedPlotId ไว้ flyTo ตอน user back กลับแผนที่
// ════════════════════════════════════════
'use client';

import { useEffect } from 'react';
import { logPlotView } from '@/lib/plotViews';
import { usePlotStore } from '@/store/plotStore';

interface Props {
  plotDocId: string;
  lat?: number | null;
  lng?: number | null;
}

export function PlotViewTracker({ plotDocId, lat, lng }: Props) {
  useEffect(() => {
    logPlotView(plotDocId, { lat, lng }).catch(() => {});
    // เก็บ id ไว้ให้ MapHub flyTo ตอน user back กลับแผนที่
    usePlotStore.getState().setLastViewedPlotId(plotDocId);
  }, [plotDocId, lat, lng]);
  return null;
}
