// ════════════════════════════════════════
// src/pages/ArticleHeader.tsx
// Header เบาๆ สำหรับหน้าบทความ (logo → home, บทความ, เปิดแผนที่)
// ════════════════════════════════════════
import { Link } from 'react-router-dom';
import { Map, ArrowRight } from 'lucide-react';

const MAP_URL = 'https://map.tnrmaphub.com';

export function ArticleHeader() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(13,21,32,0.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(33,48,69,0.5)',
    }}>
      <div style={{
        maxWidth: 820, margin: '0 auto', padding: '0 16px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#dce8f5' }}>
          <Map className="w-5 h-5" color="#00e676" />
          <span style={{ fontWeight: 700 }}>TNR MapHub</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/articles" style={{ fontSize: 14, color: '#7a9ab8', textDecoration: 'none' }}>บทความ</Link>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              background: '#00e676', color: '#0d1520', borderRadius: 8, fontSize: 14,
              fontWeight: 600, textDecoration: 'none',
            }}
          >
            เปิดแผนที่ <ArrowRight className="w-4 h-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
