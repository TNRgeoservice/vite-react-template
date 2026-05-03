// ════════════════════════════════════════
// store/proximityStore.ts
// Toggle proximity GPS alerts (persisted)
// ════════════════════════════════════════
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProximityState {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

export const useProximityStore = create<ProximityState>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: 'tnr-proximity',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
