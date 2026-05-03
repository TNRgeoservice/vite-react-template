// ════════════════════════════════════════
// components/ui/Toast.tsx
// Recipe (README §Toasts):
//   bg2 fill, 1.5px border in status color, matching text,
//   r=20 pill, p=8/18, fs=12.5.
// ════════════════════════════════════════
'use client';

import { ReactNode, useEffect, useState } from 'react';

export type ToastKind = 'success' | 'warn' | 'error' | 'info';

const TONE: Record<ToastKind, string> = {
  success: '#00e676',
  warn:    '#ffb300',
  error:   '#ff5252',
  info:    '#40c4ff',
};

interface Props {
  kind?: ToastKind;
  children: ReactNode;
  /** ms, 0 = sticky */
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({
  kind = 'success',
  children,
  duration = 2400,
  onDismiss,
  className = '',
}: Props) {
  const [visible, setVisible] = useState(true);
  const color = TONE[kind];

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className={
        'inline-flex items-center gap-2 ' +
        'rounded-[20px] border-[1.5px] bg-bg2 ' +
        'px-[18px] py-2 text-[12.5px] font-medium ' +
        'shadow-float ' + className
      }
      style={{ borderColor: color, color }}
    >
      {children}
    </div>
  );
}
