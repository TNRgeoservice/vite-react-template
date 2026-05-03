// ════════════════════════════════════════
// components/ui/Button.tsx — TNR primitive
// Variants: primary / secondary / destructive
// Recipe (README §Buttons):
//   primary    — solid acc bg, black text, r=9, px18 py10, w500, :active opacity .78
//   secondary  — bg3 fill, 1.5px brd border, tx text, same geometry
//   destructive— red tinted .1 fill, .3 border, red text
// Hover intentionally unstyled.
// ════════════════════════════════════════
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'destructive';
type Size    = 'md' | 'sm';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-md-t font-medium ' +
  'transition-opacity duration-tnr-fast ease-tnr-ease ' +
  'active:opacity-[.78] disabled:opacity-50 disabled:pointer-events-none ' +
  'select-none';

const sizes: Record<Size, string> = {
  md: 'px-[18px] py-[10px] text-md-t',
  sm: 'px-3 py-1.5 text-sm-t',
};

const variants: Record<Variant, string> = {
  primary:     'bg-acc text-[#001a0a]',
  secondary:   'bg-bg3 border-[1.5px] border-brd text-tx',
  destructive: 'bg-[rgba(255,82,82,.1)] border-[1.5px] border-[rgba(255,82,82,.3)] text-red',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', className = '', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
});
