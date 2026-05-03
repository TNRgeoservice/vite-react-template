'use client';

import { useState } from 'react';

interface Props {
  url: string;
}

const ICON_LINK = '\u{1F517}';
const ICON_CHECK = '✓';

export function PlotShareButtons({ url }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onLine = () => {
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const onFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const btnBase: React.CSSProperties = {
    padding: '10px 14px', borderRadius: 10,
    background: 'transparent', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    flex: 1,
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button
        type="button"
        onClick={onCopy}
        style={{
          ...btnBase,
          border: `1.5px solid ${copied ? '#00e676' : '#40c4ff'}`,
          color: copied ? '#00e676' : '#40c4ff',
        }}
      >
        {copied ? `${ICON_CHECK} คัดลอกแล้ว` : `${ICON_LINK} คัดลอกลิงก์`}
      </button>
      <button
        type="button"
        onClick={onLine}
        style={{
          ...btnBase,
          border: '1.5px solid #06c755',
          color: '#06c755',
        }}
      >
        แชร์ LINE
      </button>
      <button
        type="button"
        onClick={onFacebook}
        title="แชร์ไป Facebook"
        style={{
          ...btnBase,
          border: '1.5px solid #1877F2',
          color: '#1877F2',
        }}
      >
        แชร์ FB
      </button>
    </div>
  );
}
