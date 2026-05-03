// ════════════════════════════════════════
// components/ui/Card.tsx — plot card primitive
// Recipe (README §Cards):
//   bg2 fill, 1.5px brd, no shadow by default.
//   Radius 12 (grid) / 10 (compact list).
//   Hover/press = border-color flips to acc. No lift.
// ════════════════════════════════════════
'use client';

import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  interactive?: boolean;
}

export function Card({
  compact = false,
  interactive = false,
  className = '',
  ...rest
}: Props) {
  return (
    <div
      className={
        'bg-bg2 border-[1.5px] border-brd overflow-hidden ' +
        (compact ? 'rounded-[10px]' : 'rounded-lg-t') + ' ' +
        (interactive
          ? 'cursor-pointer transition-colors duration-tnr-fast ease-tnr-ease hover:border-acc active:opacity-[.78] '
          : '') +
        className
      }
      {...rest}
    />
  );
}
