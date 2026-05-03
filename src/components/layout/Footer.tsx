'use client';

import Link from 'next/link';

const FB_PAGE_URL = 'https://www.facebook.com/TNRGEOSERVICE';
const FB_PAGE_HANDLE = 'TNRGEOSERVICE';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 32,
        padding: '24px 16px 80px',
        borderTop: '1px solid #213045',
        background: '#0a121c',
        color: '#7a9ab8',
        fontSize: 13,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 24 }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 700, color: '#dce8f5', fontSize: 16, marginBottom: 8 }}>TNR MapHub</div>
            <div style={{ lineHeight: 1.6 }}>
              แพลตฟอร์มซื้อขายที่ดินออนไลน์<br />
              พร้อมแผนที่ GIS แม่นยำ<br />
              โดย <strong style={{ color: '#dce8f5' }}>TNR Geoservice</strong>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontWeight: 700, color: '#dce8f5', marginBottom: 8 }}>เมนูหลัก</div>
            <ul style={{ display: 'grid', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link href="/" style={{ color: '#7a9ab8' }}>🗺 แผนที่</Link></li>
              <li><Link href="/cards" style={{ color: '#7a9ab8' }}>📋 รายการที่ดิน</Link></li>
              <li><Link href="/profile" style={{ color: '#7a9ab8' }}>👤 โปรไฟล์</Link></li>
            </ul>
          </div>

          {/* Social — FB link เท่านั้น (SEO: ส่ง link equity ไปเพจ) */}
          <div>
            <div style={{ fontWeight: 700, color: '#dce8f5', marginBottom: 8 }}>ติดตามเรา</div>
            <a
              href={FB_PAGE_URL}
              target="_blank"
              rel="noopener me"
              aria-label="Facebook Page TNR Geoservice"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 8,
                border: '1px solid #1877F2', color: '#1877F2',
                fontWeight: 600, textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
              Facebook · @{FB_PAGE_HANDLE}
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid #213045', paddingTop: 16, textAlign: 'center', fontSize: 12 }}>
          © {new Date().getFullYear()} TNR Geoservice · All rights reserved
        </div>
      </div>
    </footer>
  );
}
