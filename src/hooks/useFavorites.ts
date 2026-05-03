// ════════════════════════════════════════
// src/hooks/useFavorites.ts
// Port จาก phase1-favorites.js — realtime favorites + toggle
// Collection: users/{uid}/favorites
// ════════════════════════════════════════
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { PlotPoint } from '@/types/plot';

export function useFavorites() {
  const user = useAuthStore((s) => s.user);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { setFavIds(new Set()); return; }
    const ref = collection(db, 'users', user.uid, 'favorites');
    const unsub = onSnapshot(ref, (snap) => {
      const s = new Set<string>();
      snap.forEach((d) => s.add(d.id));
      setFavIds(s);
    }, (e) => console.warn('[useFavorites]', e));
    return unsub;
  }, [user]);

  const toggle = useCallback(async (plot: PlotPoint) => {
    if (!user) { alert('กรุณาเข้าสู่ระบบก่อนบันทึก'); return; }
    const ref = doc(db, 'users', user.uid, 'favorites', plot.id);
    if (favIds.has(plot.id)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        plotDocId:  plot.id,
        name:       plot.name || '',
        type:       plot.type || 'land',
        lat:        plot.lat || 0,
        lng:        plot.lng || 0,
        priceTotal: plot.priceTotal || 0,
        areaSqm:    plot.areaSqm || 0,
        province:   plot.province || '',
        thumbUrl:   (plot.photoUrls && plot.photoUrls[0]) || (plot.photos && plot.photos[0]) || '',
        savedAt:    serverTimestamp(),
      });
    }
  }, [user, favIds]);

  const isFavorited = useCallback((id: string) => favIds.has(id), [favIds]);

  return { favIds, toggle, isFavorited };
}
