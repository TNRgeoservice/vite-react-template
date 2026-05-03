// ════════════════════════════════════════
// src/components/dm/ChatWindowStack.tsx
// Mounted at root layout. Renders all open chat windows from store.
// - Desktop: stack horizontally bottom-right (right-to-left)
// - Mobile: only the last-opened window is shown (bottom sheet)
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { useChatWindowsStore } from '@/store/chatWindowsStore';
import { ChatWindow, CHAT_WIN_WIDTH, CHAT_WIN_GAP } from './ChatWindow';

export function ChatWindowStack() {
  const windows = useChatWindowsStore((s) => s.windows);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (windows.length === 0) return null;

  // Last window in array = right-most (newest / focused)
  // Render in reverse so right-most has offset 0
  const reversed = [...windows].reverse();
  const activeMobileKey = reversed[0]?.key;

  return (
    <>
      {reversed.map((win, i) => {
        const rightOffset = i * (CHAT_WIN_WIDTH + CHAT_WIN_GAP);
        return (
          <ChatWindow
            key={win.key}
            win={win}
            rightOffset={rightOffset}
            isDesktop={isDesktop}
            activeOnMobile={win.key === activeMobileKey}
          />
        );
      })}
    </>
  );
}
