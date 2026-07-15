// ════════════════════════════════════════
// src/pages/ArticlesIndex.tsx
// หน้า /articles — featured hero (บทความล่าสุด) + grid บทความที่เหลือ
// ════════════════════════════════════════
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../content/articles';
import { ArticleHeader } from './ArticleHeader';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
}

const CATEGORY: Record<string, { icon: string; color: string }> = {
  'ส.ป.ก.':          { icon: 'icon-title-deed.webp', color: 'var(--acc)' },
  'ซื้อที่ดิน':        { icon: 'icon-title-deed.webp', color: 'var(--acc)' },
  'ที่ดินตาบอด':       { icon: 'icon-title-deed.webp', color: 'var(--acc)' },
  'สัญญาจะซื้อจะขาย':   { icon: 'icon-contract.webp', color: '#40c4ff' },
  'ราคาประเมินที่ดิน':  { icon: 'icon-valuation.webp', color: 'var(--road)' },
  'ผังเมือง':          { icon: 'icon-zoning.webp', color: 'var(--poly)' },
  'จัดสรรที่ดิน':       { icon: 'icon-subdivision.webp', color: 'var(--land)' },
  'แบ่งแปลงที่ดิน':     { icon: 'icon-subdivision.webp', color: 'var(--land)' },
  'ถมที่ดิน':          { icon: 'icon-fill.webp', color: 'var(--road)' },
};
const DEFAULT_CATEGORY = { icon: 'icon-title-deed.webp', color: '#40c4ff' };

function categoryFor(tag?: string) {
  return (tag && CATEGORY[tag]) || DEFAULT_CATEGORY;
}

export function ArticlesIndex() {
  const sorted = [...articles].sort((a, b) => b.meta.date.localeCompare(a.meta.date));
  const [featured, ...rest] = sorted;

  useEffect(() => {
    document.title = 'บทความ — ความรู้ที่ดิน ผังเมือง และการลงทุนอสังหาฯ | TNR MapHub';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <ArticleHeader />
      <div
        className="index-banner"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(13,21,32,0.35) 0%, rgba(13,21,32,0.88) 75%, var(--bg) 100%), url('/articles-index/hero-bg.webp')`,
          backgroundSize: 'cover, 140% auto',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 16px 8px' }}>
          <header style={{ maxWidth: 640 }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 1.4rem + 2.5vw, 3.25rem)', fontWeight: 900, margin: '0 0 12px',
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1,
              textWrap: 'balance' as CSSProperties['textWrap'],
            }}>
              บทความ<span style={{ color: 'var(--acc)' }}>.</span>
            </h1>
            <p style={{
              fontSize: 17, color: 'var(--tx2)', margin: '0 0 14px', lineHeight: 1.6,
              textWrap: 'pretty' as CSSProperties['textWrap'],
            }}>
              ความรู้เรื่องที่ดิน ผังเมือง โฉนด ราคาประเมิน และการลงทุนอสังหาริมทรัพย์
            </p>
            <div style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{sorted.length} บทความ</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--txd)' }} />
              <span>อัปเดตล่าสุด {fmtDate(featured.meta.date)}</span>
            </div>
          </header>
        </div>
      </div>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 16px 96px' }}>
        {featured && (
          <Link
            to={`/articles/${featured.meta.slug}`}
            className="hero-card"
            style={{
              display: 'flex', alignItems: 'flex-end', position: 'relative',
              borderRadius: 'var(--r-2xl)', overflow: 'hidden', border: '1px solid var(--brd)',
              marginBottom: 44, minHeight: 'clamp(320px, 42vw, 460px)',
              backgroundImage: featured.meta.cover
                ? `linear-gradient(0deg, rgba(13,21,32,0.96) 12%, rgba(13,21,32,0.6) 46%, rgba(13,21,32,0.08) 78%), url('${featured.meta.cover}')`
                : 'linear-gradient(135deg, var(--bg3), var(--bg2))',
              backgroundSize: 'cover', backgroundPosition: 'center',
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <div style={{ padding: 'clamp(20px, 4vw, 40px)', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', background: 'var(--bg)',
                  border: `2px solid ${categoryFor(featured.meta.tags?.[0]).color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <img
                    src={`/articles-index/${categoryFor(featured.meta.tags?.[0]).icon}`} alt=""
                    style={{ width: 22, height: 22, objectFit: 'contain' }}
                  />
                </div>
                <span style={{
                  display: 'inline-block', fontSize: 12.5, fontWeight: 700, color: '#0d1520',
                  background: 'var(--acc)', borderRadius: 999, padding: '3px 12px',
                }}>
                  บทความล่าสุด
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Noto Serif Thai', Mitr, Georgia, serif", fontWeight: 800, color: '#fff',
                fontSize: 'clamp(1.35rem, 1rem + 1.8vw, 2.4rem)', lineHeight: 1.28, margin: '0 0 10px',
                maxWidth: '46ch', textWrap: 'balance' as CSSProperties['textWrap'],
              }}>
                {featured.meta.title}
              </h2>
              <p style={{
                color: 'var(--tx2)', fontSize: 15, lineHeight: 1.6, margin: '0 0 14px', maxWidth: '60ch',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              } as CSSProperties}>
                {featured.meta.excerpt}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, fontSize: 13, color: 'var(--tx2)' }}>
                <span>{fmtDate(featured.meta.date)}</span>
                {featured.meta.readMin && <span>· อ่าน {featured.meta.readMin} นาที</span>}
                <span className="hero-cta" style={{ color: 'var(--acc)', fontWeight: 700, marginLeft: 'auto' }}>
                  อ่านต่อ →
                </span>
              </div>
            </div>
          </Link>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {rest.map(({ meta }, i) => {
            const cat = categoryFor(meta.tags?.[0]);
            return (
            <Link
              key={meta.slug}
              to={`/articles/${meta.slug}`}
              className="article-card"
              style={{
                display: 'flex', flexDirection: 'column', background: 'var(--bg2)',
                border: '1px solid var(--brd)', borderRadius: 'var(--r-lg)', overflow: 'hidden',
                textDecoration: 'none', color: 'inherit',
                animationDelay: `${Math.min(i, 8) * 45}ms`,
              } as CSSProperties}
            >
              {meta.cover && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={meta.cover} alt={meta.title}
                    style={{
                      width: '100%', aspectRatio: '1200 / 630', objectFit: 'cover', display: 'block',
                      borderBottom: '1px solid var(--brd)',
                    }}
                  />
                  <div
                    className="category-badge"
                    style={{
                      position: 'absolute', left: 14, bottom: -20, width: 44, height: 44, borderRadius: '50%',
                      background: 'var(--bg2)', border: `2px solid ${cat.color}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <img src={`/articles-index/${cat.icon}`} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  </div>
                </div>
              )}
              <div style={{ padding: '28px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {meta.tags?.[0] && (
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: cat.color, marginBottom: 8 }}>
                    {meta.tags[0]}
                  </span>
                )}
                <h3 style={{
                  fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.35,
                  textWrap: 'balance' as CSSProperties['textWrap'],
                }}>
                  {meta.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--tx2)', lineHeight: 1.55, margin: '0 0 14px', flex: 1 }}>
                  {meta.excerpt}
                </p>
                <div style={{ fontSize: 12, color: 'var(--tx2)' }}>
                  {fmtDate(meta.date)}{meta.readMin ? ` · อ่าน ${meta.readMin} นาที` : ''}
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
