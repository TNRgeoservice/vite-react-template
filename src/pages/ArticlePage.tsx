// ════════════════════════════════════════
// src/pages/ArticlePage.tsx
// หน้า /articles/:slug — breadcrumb + render Body จาก registry
// (per-article meta/JSON-LD ฝังลง <head> ตอน prerender; client อัปเดต title เผื่อ SPA nav)
// ════════════════════════════════════════
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getArticle } from '../content/articles';
import { ArticleHeader } from './ArticleHeader';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  useEffect(() => {
    if (article) document.title = `${article.meta.title} | TNR MapHub`;
  }, [article]);

  return (
    <div style={{ minHeight: '100vh', background: '#0d1520', color: '#dce8f5' }}>
      <ArticleHeader />
      <main style={{
        maxWidth: 680, margin: '0 auto', padding: '24px 16px 80px',
        fontFamily: "'Noto Serif Thai', Mitr, Georgia, serif",
      }}>
        {!article ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#7a9ab8' }}>
            <p style={{ fontSize: 18, marginBottom: 12 }}>ไม่พบบทความที่ต้องการ</p>
            <Link to="/articles" style={{ color: '#40c4ff', textDecoration: 'none' }}>
              ← กลับไปหน้าบทความทั้งหมด
            </Link>
          </div>
        ) : (
          <>
            <nav style={{ fontSize: 13, color: '#7a9ab8', marginBottom: 20 }}>
              <Link to="/" style={{ color: '#7a9ab8', textDecoration: 'none' }}>หน้าหลัก</Link>
              <span style={{ margin: '0 8px' }}>›</span>
              <Link to="/articles" style={{ color: '#7a9ab8', textDecoration: 'none' }}>บทความ</Link>
            </nav>

            {article.meta.cover && (
              <img
                src={article.meta.cover}
                alt={article.meta.title}
                style={{
                  width: '100%', height: 'auto', aspectRatio: '1200 / 630', objectFit: 'cover',
                  borderRadius: 12, border: '1px solid #213045', marginBottom: 24, display: 'block',
                }}
              />
            )}

            <article.Body />

            <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #213045' }}>
              <Link to="/articles" style={{ color: '#40c4ff', textDecoration: 'none', fontSize: 14 }}>
                ← กลับไปหน้าบทความทั้งหมด
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
