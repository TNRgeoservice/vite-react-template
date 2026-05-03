// ════════════════════════════════════════
// components/ui/Field.tsx — labeled input primitive
// Recipe (README §Inputs):
//   bg, 1.5px brd, r=9, 10/12 padding, 14px.
//   Focus = border swap to tone (acc/land/road/...). No halo.
//   Label above: tx2, 12px, w500, 5px bottom margin.
//   Mono inputs use font-mono at 13px.
// ════════════════════════════════════════
'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

type Tone = 'acc' | 'land' | 'road' | 'poly' | 'red';

const TONE_HEX: Record<Tone, string> = {
  acc:  '#00e676',
  land: '#40c4ff',
  road: '#ffb300',
  poly: '#b388ff',
  red:  '#ff5252',
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  mono?: boolean;
}

export const Field = forwardRef<HTMLInputElement, Props>(function Field(
  { label, hint, tone = 'acc', mono = false, className = '', id, ...rest },
  ref
) {
  const inputId = id || (typeof label === 'string' ? `f-${label}` : undefined);
  const focusColor = TONE_HEX[tone];

  return (
    <label className="block" htmlFor={inputId}>
      {label && (
        <span className="mb-[5px] block text-[12px] font-medium text-tx2">
          {label}
        </span>
      )}
      <input
        ref={ref}
        id={inputId}
        className={
          'block w-full bg-bg text-tx ' +
          'rounded-md-t border-[1.5px] border-brd ' +
          'px-3 py-[10px] outline-none ' +
          'placeholder:text-txd ' +
          'transition-[border-color] duration-tnr-fast ease-tnr-ease ' +
          (mono ? 'font-mono text-body-t ' : 'text-md-t ') +
          className
        }
        onFocus={(e) => {
          e.currentTarget.style.borderColor = focusColor;
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '';
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      {hint && <span className="mt-1 block text-xs-t text-txd">{hint}</span>}
    </label>
  );
});
