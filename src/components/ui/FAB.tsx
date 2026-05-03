// ════════════════════════════════════════
// components/ui/FAB.tsx — floating action button
// Recipe (README §FABs):
//   44×44 circle, bg2 fill, 1.5px brd border, sh-fab shadow.
//   Active GPS locate adds gps-pulse green glow.
// ════════════════════════════════════════
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** add green GPS pulse glow */
  pulse?: boolean;
}

export const FAB = forwardRef<HTMLButtonElement, Props>(function FAB(
  { pulse = false, className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={
        'flex h-fbt w-fbt items-center justify-center ' +
        'rounded-full bg-bg2 border-[1.5px] border-brd ' +
        'text-tx shadow-fab ' +
        'transition-opacity duration-tnr-fast ease-tnr-ease ' +
        'active:opacity-[.78] ' +
        (pulse ? 'animate-gps-pulse ' : '') +
        className
      }
      {...rest}
    />
  );
});
