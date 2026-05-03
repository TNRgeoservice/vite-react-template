// ════════════════════════════════════════
// components/plot/LocationAutocomplete.tsx
// Autocomplete input — แสดง dropdown จาก list (loc-codes)
// ใช้กับ จังหวัด/อำเภอ/ตำบล
// ════════════════════════════════════════
'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  label:    string;
  value:    string;
  onChange: (v: string) => void;
  options:  string[];
  placeholder?: string;
  disabled?:    boolean;
}

export function LocationAutocomplete({
  label, value, onChange, options, placeholder, disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLabelElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const q = value.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q)).slice(0, 50)
    : options.slice(0, 50);

  return (
    <label className="block relative" ref={wrapRef}>
      <span className="mb-[5px] block text-[12px] font-medium text-tx2">{label}</span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        className="w-full rounded-md-t border-[1.5px] border-brd bg-bg
                   px-3 py-[10px] outline-none text-tx text-md-t
                   placeholder:text-txd
                   disabled:opacity-60"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-[60] mt-1
                       max-h-60 overflow-y-auto rounded-md-t border-[1.5px] border-brd
                       bg-bg2 shadow-modal text-md-t">
          {filtered.map((opt) => (
            <li
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
              className="cursor-pointer px-3 py-2 text-tx hover:bg-[rgba(64,196,255,0.1)]"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}
