// ════════════════════════════════════════
// src/prerender.tsx  (SSR entry — รันด้วย node หลัง vite build)
// gen static HTML ต่อบทความ ฝัง title/meta/canonical/JSON-LD ลง <head> + body markup
// ลง #root → SEO เก็บได้เต็ม โดยไม่พึ่ง lib ที่ไม่รองรับ Vite 8
// ════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { articles } from './content/articles';
import { ArticlesIndex } from './pages/ArticlesIndex';
import { ArticlePage } from './pages/ArticlePage';

const SITE = 'https://tnrmaphub.com';
const DIST = path.resolve(process.cwd(), 'dist');

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderRoute(url: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={url}>
      <Routes>
        <Route path="/articles" element={<ArticlesIndex />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
      </Routes>
    </StaticRouter>,
  );
}

interface PageSeo {
  url:         string;
  title:       string;
  description: string;
  ogType:      'website' | 'article';
  jsonLd:      object[];
}

function buildHtml(template: string, seo: PageSeo, bodyHtml: string): string {
  const fullTitle = `${seo.title} | TNR MapHub`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/, `<meta name="description" content="${esc(seo.description)}" />`)
    .replace(/<link rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${seo.url}" />`)
    .replace(/<meta property="og:type"[^>]*\/?>/, `<meta property="og:type" content="${seo.ogType}" />`)
    .replace(/<meta property="og:url"[^>]*\/?>/, `<meta property="og:url" content="${seo.url}" />`)
    .replace(/<meta property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta property="og:description"[^>]*\/?>/, `<meta property="og:description" content="${esc(seo.description)}" />`)
    .replace(/<meta name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta name="twitter:description"[^>]*\/?>/, `<meta name="twitter:description" content="${esc(seo.description)}" />`);

  // ฝัง JSON-LD เฉพาะหน้า ก่อน </head>
  const ld = seo.jsonLd
    .map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ');
  html = html.replace('</head>', `    ${ld}\n  </head>`);

  // ฝัง body markup เข้า #root (client createRoot จะ replace ตอน hydrate)
  html = html.replace('<div id="root">', `<div id="root">${bodyHtml}`);
  return html;
}

function writeHtml(routePath: string, html: string) {
  const dir = path.join(DIST, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
  console.log(`  ✓ /${routePath}`);
}

function run() {
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
  console.log('[prerender] generating article pages…');

  // /articles (index)
  writeHtml('articles', buildHtml(template, {
    url:         `${SITE}/articles`,
    title:       'บทความ — ความรู้ที่ดิน ผังเมือง และการลงทุนอสังหาฯ',
    description: 'รวมบทความความรู้เรื่องที่ดิน ผังเมือง การตรวจสอบโฉนด ราคาประเมิน และการลงทุนอสังหาริมทรัพย์ จาก TNR MapHub',
    ogType:      'website',
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'บทความ TNR MapHub', url: `${SITE}/articles`, inLanguage: 'th-TH',
    }],
  }, renderRoute('/articles')));

  // /articles/:slug
  for (const { meta } of articles) {
    const url = `${SITE}/articles/${meta.slug}`;
    writeHtml(`articles/${meta.slug}`, buildHtml(template, {
      url, title: meta.title, description: meta.description, ogType: 'article',
      jsonLd: [
        {
          '@context': 'https://schema.org', '@type': 'Article',
          headline: meta.title, description: meta.description,
          datePublished: meta.date, dateModified: meta.updated ?? meta.date,
          inLanguage: 'th-TH', mainEntityOfPage: url,
          author:    { '@type': 'Organization', name: 'TNR Geoservice' },
          publisher: { '@type': 'Organization', name: 'TNR Geoservice', logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png` } },
          ...(meta.cover ? { image: meta.cover } : {}),
        },
        {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
            { '@type': 'ListItem', position: 2, name: 'บทความ',   item: `${SITE}/articles` },
            { '@type': 'ListItem', position: 3, name: meta.title, item: url },
          ],
        },
      ],
    }, renderRoute(`/articles/${meta.slug}`)));
  }

  // sitemap.xml — base + articles
  const urls = [
    { loc: `${SITE}/`,             changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://map.tnrmaphub.com/', changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/articles`,     changefreq: 'weekly', priority: '0.6' },
    ...articles.map(({ meta }) => ({
      loc: `${SITE}/articles/${meta.slug}`, lastmod: meta.updated ?? meta.date,
      changefreq: 'monthly', priority: '0.6',
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
  console.log('  ✓ sitemap.xml');
  console.log('[prerender] done');
}

run();
