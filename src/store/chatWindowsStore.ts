// ════════════════════════════════════════
// src/store/chatWindowsStore.ts
// Facebook-style stackable chat windows manager
// - Desktop: max 5 windows stacked bottom-right
// - Mobile: only 1 window at a time (bottom sheet)
// - State is in-memory (refresh = lost) — ok for V1
// ════════════════════════════════════════
'use client';

import { create } from 'zustand';

export interface ChatWindow {
  /** unique key = plotDocId + ':' + peerUid */
  key: string;
  plotDocId: string;
  peerUid: string;
  plotName: string;
  peerName: string;   // filled on open / can be updated later
  minimized: boolean;
}

export const MAX_WINDOWS_DESKTOP = 5;

function makeKey(plotDocId: string, peerUid: string) {
  return `${plotDocId}:${peerUid}`;
}

interface State {
  windows: ChatWindow[];
  openWindow: (w: Omit<ChatWindow, 'key' | 'minimized'> & { minimized?: boolean }) => void;
  closeWindow: (key: string) => void;
  toggleMinimize: (key: string) => void;
  setMinimized: (key: string, minimized: boolean) => void;
  setPeerName: (key: string, peerName: string) => void;
  closeAll: () => void;
}

export const useChatWindowsStore = create<State>((set) => ({
  windows: [],

  openWindow: (w) => set((state) => {
    const key = makeKey(w.plotDocId, w.peerUid);
    const existing = state.windows.find((x) => x.key === key);
    if (existing) {
      // Focus: un-minimize + move to front (right-most)
      const others = state.windows.filter((x) => x.key !== key);
      return { windows: [...others, { ...existing, minimized: false }] };
    }
    // Add new, enforce max (drop oldest = left-most)
    const newWin: ChatWindow = {
      key,
      plotDocId: w.plotDocId,
      peerUid: w.peerUid,
      plotName: w.plotName,
      peerName: w.peerName || '',
      minimized: w.minimized ?? false,
    };
    const next = [...state.windows, newWin];
    if (next.length > MAX_WINDOWS_DESKTOP) {
      next.splice(0, next.length - MAX_WINDOWS_DESKTOP);
    }
    return { windows: next };
  }),

  closeWindow: (key) => set((state) => ({
    windows: state.windows.filter((x) => x.key !== key),
  })),

  toggleMinimize: (key) => set((state) => ({
    windows: state.windows.map((x) => x.key === key ? { ...x, minimized: !x.minimized } : x),
  })),

  setMinimized: (key, minimized) => set((state) => ({
    windows: state.windows.map((x) => x.key === key ? { ...x, minimized } : x),
  })),

  setPeerName: (key, peerName) => set((state) => ({
    windows: state.windows.map((x) => x.key === key ? { ...x, peerName } : x),
  })),

  closeAll: () => set({ windows: [] }),
}));
