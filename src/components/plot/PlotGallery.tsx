'use client';

// ════════════════════════════════════════
// PlotGallery — main image + thumbnail strip + fullscreen lightbox
// - Main image 16:9, click → open lightbox
// - Thumbnail strip ใต้รูป (active highlight cyan)
// - Lightbox: ปิดด้วย ✕/Esc/click bg, swipe ซ้ายขวา, keyboard ←/→, counter
// ════════════════════════════════════════
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export function PlotGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  // keyboard nav (lightbox only)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev]);

  // lock body scroll when lightbox open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // touch swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  // scroll active thumb into view
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = stripRef.current?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  if (!total) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Main image — 16:9 */}
      <div
        onClick={() => setOpen(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative', width: '100%', aspectRatio: '16 / 9',
          background: '#0a121b', borderRadius: 12, overflow: 'hidden',
          cursor: 'zoom-in', border: '1px solid #213045',
        }}
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt} รูปที่ ${active + 1}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 680px) 100vw, 680px"
          priority={active === 0}
        />
        {/* counter */}
        {total > 1 && (
          <div style={{
            position: 'absolute', right: 10, bottom: 10,
            background: 'rgba(0,0,0,.65)', color: '#fff',
            padding: '4px 10px', borderRadius: 999,
            fontSize: 12, fontWeight: 600,
          }}>
            {active + 1} / {total}
          </div>
        )}
        {/* prev/next (desktop) */}
        {total > 1 && (
          <>
            <NavBtn dir="prev" onClick={(e) => { e.stopPropagation(); prev(); }} />
            <NavBtn dir="next" onClick={(e) => { e.stopPropagation(); next(); }} />
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div
          ref={stripRef}
          style={{
            display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto',
            scrollSnapType: 'x mandatory', paddingBottom: 4,
          }}
        >
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0, width: 70, height: 50,
                borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                border: i === active ? '2px solid #40c4ff' : '2px solid transparent',
                opacity: i === active ? 1 : 0.65,
                background: '#0a121b', position: 'relative', padding: 0,
                scrollSnapAlign: 'center',
                transition: 'opacity .15s, border-color .15s',
              }}
              aria-label={`รูปที่ ${i + 1}`}
            >
              <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="70px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* close */}
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            style={{
              position: 'absolute', top: 16, right: 16, zIndex: 2,
              background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff',
              width: 44, height: 44, borderRadius: '50%',
              fontSize: 24, cursor: 'pointer', lineHeight: 1,
            }}
            aria-label="ปิด"
          >×</button>

          {/* counter */}
          {total > 1 && (
            <div style={{
              position: 'absolute', top: 22, left: 16, zIndex: 2,
              color: '#fff', fontSize: 14, fontWeight: 600,
              background: 'rgba(255,255,255,.1)', padding: '6px 14px', borderRadius: 999,
            }}>
              {active + 1} / {total}
            </div>
          )}

          {/* image */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
              position: 'relative', width: '100%', height: '100%',
              maxWidth: '100vw', maxHeight: '100vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Image
              key={images[active]}
              src={images[active]}
              alt={`${alt} รูปที่ ${active + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
              priority
            />
          </div>

          {/* nav (desktop) */}
          {total > 1 && (
            <>
              <NavBtn dir="prev" big onClick={(e) => { e.stopPropagation(); prev(); }} />
              <NavBtn dir="next" big onClick={(e) => { e.stopPropagation(); next(); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NavBtn({
  dir, big, onClick,
}: { dir: 'prev' | 'next'; big?: boolean; onClick: (e: React.MouseEvent) => void }) {
  const size = big ? 52 : 36;
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'รูปก่อนหน้า' : 'รูปถัดไป'}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [dir === 'prev' ? 'left' : 'right']: big ? 16 : 8,
        width: size, height: size, borderRadius: '50%',
        background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none',
        cursor: 'pointer', fontSize: big ? 24 : 18, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
      } as React.CSSProperties}
    >{dir === 'prev' ? '‹' : '›'}</button>
  );
}
