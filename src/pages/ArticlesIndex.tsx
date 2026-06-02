// ════════════════════════════════════════
// src/pages/ArticlesIndex.tsx
// หน้า /articles — list การ์ดบทความจาก registry
// ════════════════════════════════════════
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../content/articles';
import { ArticleHeader } from './ArticleHeader';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ArticlesIndex() {
  const sorted = [...articles].sort((a, b) => b.meta.date.localeCompare(a.meta.date));

  useEffect(() => {
    document.title = 'บทความ — ความรู้ที่ดิน ผังเมือง และการลงทุนอสังหาฯ | TNR MapHub';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1520', color: '#dce8f5' }}>
      <ArticleHeader />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '24px 16px 80px' }}>
        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 8px', color: '#fff' }}>บทความ</h1>
          <p style={{ fontSize: 16, color: '#dce8f5', margin: 0 }}>
            ความรู้เรื่องที่ดิน ผังเมือง โฉนด ราคาประเมิน และการลงทุนอสังหาริมทรัพย์
          </p>
        </header>

        <div style={{ display: 'grid', gap: 14 }}>
          {sorted.map(({ meta }) => (
            <Link
              key={meta.slug}
              to={`/articles/${meta.slug}`}
              style={{
                display: 'block', background: '#162030', border: '1px solid #213045',
                borderRadius: 12, padding: '18px 20px', textDecoration: 'none', color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                {(meta.tags ?? []).slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: 11, color: '#40c4ff', background: 'rgba(64,196,255,0.1)',
                    border: '1px solid rgba(64,196,255,0.25)', borderRadius: 999, padding: '2px 10px',
                  }}>{t}</span>
                ))}
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: '#fff', margin: '0 0 6px', lineHeight: 1.35 }}>
                {meta.title}
              </h2>
              <p style={{ fontSize: 14, color: '#7a9ab8', lineHeight: 1.55, margin: '0 0 10px' }}>
                {meta.excerpt}
              </p>
              <div style={{ fontSize: 12, color: '#7a9ab8' }}>
                {fmtDate(meta.date)}{meta.readMin ? ` · อ่าน ${meta.readMin} นาที` : ''}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
