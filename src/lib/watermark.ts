// ════════════════════════════════════════
// src/lib/watermark.ts
// Port ของ js/watermark.js — canvas-based image watermark
// ════════════════════════════════════════
'use client';

export interface WatermarkOpts {
  text?:     string;
  opacity?:  number;
  position?: 'br' | 'bl' | 'tr' | 'tl' | 'center';
  fontSize?: number;
  quality?:  number;
}

/**
 * Apply watermark to a File/Blob — returns JPEG Blob.
 * Falls back to original file if image fails to load.
 */
export async function applyWatermark(file: File | Blob, opts: WatermarkOpts = {}): Promise<Blob> {
  const {
    text     = 'TNR Geoservice',
    opacity  = 0.55,
    position = 'br',
    quality  = 0.88,
  } = opts;

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas 2D not available')); return; }

      ctx.drawImage(img, 0, 0);

      const shortSide = Math.min(canvas.width, canvas.height);
      const fontSize  = opts.fontSize || Math.max(14, Math.round(shortSide * 0.045));
      const padding   = Math.round(shortSide * 0.03);
      const font      = `600 ${fontSize}px "IBM Plex Sans Thai", sans-serif`;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.font = font;

      const textW = ctx.measureText(text).width;
      const textH = fontSize;
      const bgPad = Math.round(fontSize * 0.35);
      const bgW   = textW + bgPad * 2;
      const bgH   = textH + bgPad * 2;

      let x: number, y: number;
      switch (position) {
        case 'tl': x = padding;                        y = padding;                         break;
        case 'tr': x = canvas.width - bgW - padding;   y = padding;                         break;
        case 'bl': x = padding;                        y = canvas.height - bgH - padding;   break;
        case 'center':
          x = (canvas.width  - bgW) / 2;
          y = (canvas.height - bgH) / 2;
          break;
        default: // 'br'
          x = canvas.width  - bgW - padding;
          y = canvas.height - bgH - padding;
      }

      // Dark pill
      ctx.fillStyle = 'rgba(13,21,32,0.72)';
      ctx.beginPath();
      const r = bgH / 2;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + bgW - r, y);
      ctx.arcTo(x + bgW, y, x + bgW, y + bgH, r);
      ctx.lineTo(x + bgW, y + bgH - r);
      ctx.arcTo(x + bgW, y + bgH, x + bgW - r, y + bgH, r);
      ctx.lineTo(x + r, y + bgH);
      ctx.arcTo(x, y + bgH, x, y + bgH - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();

      // Text
      ctx.fillStyle = '#00e676';
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + bgPad, y + bgH / 2);
      ctx.restore();

      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/jpeg',
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      // fallback: upload original
      console.warn('[Watermark] Failed to load, uploading original');
      resolve(file);
    };

    img.src = url;
  });
}

/** Batch watermark with concurrency limit. */
export async function applyWatermarkBatch(files: File[], opts: WatermarkOpts = {}): Promise<Blob[]> {
  const CONCURRENCY = 4;
  const results: Blob[] = [];
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const blobs = await Promise.all(chunk.map((f) => applyWatermark(f, opts)));
    results.push(...blobs);
  }
  return results;
}
