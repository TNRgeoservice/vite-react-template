// ════════════════════════════════════════
// src/components/proximity/ProximityProvider.tsx
// Mount ที่ root layout — เริ่ม/หยุด Geolocation watch
// ตาม proximityStore.enabled + savedSearches ที่ enabled
// ════════════════════════════════════════
'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProximityStore } from '@/store/proximityStore';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { ProximityWatcher } from '@/lib/proximityWatcher';

export function ProximityProvider() {
  const user = useAuthStore((s) => s.user);
  const enabled = useProximityStore((s) => s.enabled);
  const { items } = useSavedSearches();

  const watcherRef = useRef<ProximityWatcher | null>(null);
  // hold latest list ใน ref เพื่อไม่ต้อง re-create watcher ตอน list เปลี่ยน
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  useEffect(() => {
    if (!user || !enabled) {
      watcherRef.current?.stop();
      watcherRef.current = null;
      return;
    }
    if (!watcherRef.current) {
      watcherRef.current = new ProximityWatcher({
        ownerUid: user.uid,
        getSavedSearches: () => itemsRef.current,
      });
      const ok = watcherRef.current.start();
      if (!ok) console.warn('[proximity] geolocation unavailable');
    }
    return () => {
      watcherRef.current?.stop();
      watcherRef.current = null;
    };
  }, [user, enabled]);

  return null;
}
