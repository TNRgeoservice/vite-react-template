// ════════════════════════════════════════
// components/plot/PhotoGallery.tsx
// Thumbnail grid + file picker. Upload เกิดตอน save ใน PlotForm
// ════════════════════════════════════════
'use client';

import { useRef, useEffect, useState } from 'react';

interface Props {
  existingUrls: string[];
  pendingFiles: File[];
  onChangeExisting: (urls: string[]) => void;
  onChangePending: (files: File[]) => void;
}

export function PhotoGallery({
  existingUrls,
  pendingFiles,
  onChangeExisting,
  onChangePending,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  // Rebuild preview URLs whenever pending files change
  useEffect(() => {
    const urls = pendingFiles.map((f) => URL.createObjectURL(f));
    setPendingPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [pendingFiles]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onChangePending([...pendingFiles, ...files]);
    e.target.value = '';
  };

  const removeExisting = (url: string) => {
    onChangeExisting(existingUrls.filter((u) => u !== url));
  };

  const removePending = (idx: number) => {
    onChangePending(pendingFiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {existingUrls.map((u) => (
          // eslint-disable-next-line @next/next/no-img-element
          <Thumb key={u} src={u} onRemove={() => removeExisting(u)} />
        ))}
        {pendingPreviews.map((u, i) => (
          <Thumb key={u} src={u} pending onRemove={() => removePending(i)} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-[#213045] bg-[#0d1520] px-3 py-1.5 text-xs text-[#7a9ab8]"
      >
        ＋ เพิ่มรูป
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handlePick}
      />
    </div>
  );
}

function Thumb({
  src,
  pending,
  onRemove,
}: {
  src: string;
  pending?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="relative h-16 w-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-full w-full rounded-lg object-cover ${pending ? 'opacity-60' : ''}`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5252] text-xs font-bold text-white"
      >
        ×
      </button>
    </div>
  );
}
