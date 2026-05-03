'use client';
// Client-side dynamic loader for MapHub
// (Leaflet uses window → must be ssr:false)
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapHub = dynamic(() => import('./MapHub'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d1520]">
      <div className="text-4xl">📍</div>
      <div className="text-sm font-bold text-[#00e676]">TNR MapHub</div>
      <div className="text-xs text-[#3d5672]">กำลังโหลดแผนที่...</div>
    </div>
  ),
});

export default function MapHubClient() {
  return (
    <Suspense fallback={null}>
      <MapHub />
    </Suspense>
  );
}
