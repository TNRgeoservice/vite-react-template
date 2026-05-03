// ════════════════════════════════════════
// src/hooks/useSavedSearches.ts
// CRUD savedSearches ของ user (realtime)
// ════════════════════════════════════════
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, deleteDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { SearchFilters } from '@/store/plotStore';
import { MAX_SAVED_SEARCHES, type SavedSearch } from '@/types/savedSearch';

export function useSavedSearches() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setItems([]); setLoading(false); return; }
    const q = query(
      collection(db, 'savedSearches'),
      where('ownerUid', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedSearch, 'id'>) })));
      setLoading(false);
    }, (e) => { console.warn('[savedSearches]', e); setLoading(false); });
    return unsub;
  }, [user]);

  const create = useCallback(async (name: string, filters: SearchFilters) => {
    if (!user) throw new Error('login required');
    if (items.length >= MAX_SAVED_SEARCHES) {
      throw new Error(`บันทึกได้สูงสุด ${MAX_SAVED_SEARCHES} รายการ`);
    }
    if (!filters.province) throw new Error('ต้องเลือกจังหวัดก่อน');
    await addDoc(collection(db, 'savedSearches'), {
      ownerUid: user.uid,
      name: name.trim() || filters.province,
      filters,
      enabled: true,
      createdAt: serverTimestamp(),
    });
  }, [user, items.length]);

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'savedSearches', id));
  }, []);

  const toggle = useCallback(async (id: string, enabled: boolean) => {
    await updateDoc(doc(db, 'savedSearches', id), { enabled });
  }, []);

  return { items, loading, create, remove, toggle };
}
