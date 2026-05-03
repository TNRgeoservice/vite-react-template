// ════════════════════════════════════════
// components/ui/Chip.tsx — filter chip
// Recipe (README §Buttons):
//   r=10–14, 1.5px border. Active = border flips to entity color +
//   matching text + 7–10% alpha tint bg. Inactive = neutral brd.
//   Never solid fill for active chips.
// ════════════════════════════════════════
'use client';

import { ButtonHTMLAttributes } from 'react';

type Tone = 'neutral' | 'acc' | 'land' | 'road' | 'poly' | 'red';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: Tone;
}

/** rgb triples for our brand palette — used to build rgba(.08) tints. */
const TONE_RGB: Record<Exclude<Tone, 'neutral'>, string> = {
  acc:  '0,230,118',
  land: '64,196,255',
  road: '255,179,0',
  poly: '179,136,255',
  red:  '255,82,82',
};

const TONE_HEX: Record<Exclude<Tone, 'neutral'>, string> = {
  acc:  '#00e676',
  land: '#40c4ff',
  road: '#ffb300',
  poly: '#b388ff',
  red:  '#ff5252',
};

export function Chip({
  active = false,
  tone = 'acc',
  className = '',
  style,
  ...rest
}: Props) {
  const activeStyle =
    active && tone !== 'neutral'
      ? {
          borderColor: TONE_HEX[tone],
          color:       TONE_HEX[tone],
          background:  `rgba(${TONE_RGB[tone]}, .08)`,
        }
      : undefined;

  return (
    <button
      type="button"
      className={
        'inline-flex items-center gap-1 rounded-xl-t px-3 py-1 ' +
        'border-[1.5px] text-sm-t font-regular ' +
        'transition-colors duration-tnr-fast ease-tnr-ease ' +
        'active:opacity-[.78] select-none ' +
        (active ? '' : 'border-brd text-tx2 bg-transparent ') +
        className
      }
      style={{ ...activeStyle, ...style }}
      {...rest}
    />
  );
}
