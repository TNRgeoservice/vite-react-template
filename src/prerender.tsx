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
import { PdfStudioPage } from './pages/PdfStudioPage';
import { SubdivisionPlanPage, faqs as subFaqs, steps as subSteps } from './pages/SubdivisionPlanPage';

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
        <Route path="/tnrpdfstudio" element={<PdfStudioPage />} />
        <Route path="/subdivisionplan" element={<SubdivisionPlanPage />} />
      </Routes>
    </StaticRouter>,
  );
}

interface PageSeo {
  url:         string;
  title:       string;
  description: string;
  ogType:      'website' | 'article';
  image?:      string;   // override og:image + twitter:image (absolute URL)
  jsonLd:      object[];
}

function buildHtml(template: string, seo: PageSeo, bodyHtml: string): string {
  const fullTitle = `${seo.title} | TNR MapHub`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[\s\S]*?"\s*\/?>/, `<meta name="description" content="${esc(seo.description)}" />`)
    .replace(/<link rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${esc(seo.url)}" />`)
    .replace(/<meta property="og:type"[^>]*\/?>/, `<meta property="og:type" content="${esc(seo.ogType)}" />`)
    .replace(/<meta property="og:url"[^>]*\/?>/, `<meta property="og:url" content="${esc(seo.url)}" />`)
    .replace(/<meta property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta property="og:description"[^>]*\/?>/, `<meta property="og:description" content="${esc(seo.description)}" />`)
    .replace(/<meta name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta name="twitter:description"[^>]*\/?>/, `<meta name="twitter:description" content="${esc(seo.description)}" />`);

  // override og:image + twitter:image ถ้าหน้านั้นมีภาพปก (ระวัง: "og:image" ปิดด้วย quote เพื่อไม่ชน og:image:width)
  if (seo.image) {
    html = html
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(seo.image)}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${esc(seo.image)}" />`);
  }

  // ฝัง JSON-LD เฉพาะหน้า ก่อน </head>
  // safe JSON-LD: escape <, >, & so untrusted content can't break out of <script>
  const ld = seo.jsonLd
    .map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')}</script>`)
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
    url:         `${SITE}/articles/`,
    title:       'บทความ — ความรู้ที่ดิน ผังเมือง และการลงทุนอสังหาฯ',
    description: 'รวมบทความความรู้เรื่องที่ดิน ผังเมือง การตรวจสอบโฉนด ราคาประเมิน และการลงทุนอสังหาริมทรัพย์ จาก TNR MapHub',
    ogType:      'website',
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'บทความ TNR MapHub', url: `${SITE}/articles/`, inLanguage: 'th-TH',
    }],
  }, renderRoute('/articles')));

  // /tnrpdfstudio (lead-magnet landing สำหรับโปรแกรม TNR PDF Studio)
  writeHtml('tnrpdfstudio', buildHtml(template, {
    url:         `${SITE}/tnrpdfstudio/`,
    title:       'TNR PDF Studio — โปรแกรมแก้ PDF โฉนด/เอกสารที่ดิน ฟรี',
    description: 'ดาวน์โหลดฟรี! โปรแกรมแก้ไขไฟล์ PDF สำหรับงานโฉนดและเอกสารที่ดิน — ลบ/แก้ข้อความบนสแกน OCR ไทย ใส่ลายน้ำ ปกปิดข้อมูล รวม-แยกไฟล์ แปลงเป็น Word ทำงานบนเครื่องคุณ',
    ogType:      'website',
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'SoftwareApplication',
      name: 'TNR PDF Studio', applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows 10, Windows 11', inLanguage: 'th-TH',
      url: `${SITE}/tnrpdfstudio/`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' },
      publisher: { '@type': 'Organization', name: 'TNR Geoservice' },
      description: 'โปรแกรมแก้ไข PDF โฉนดและเอกสารที่ดินฟรี — OCR ไทย ลายน้ำ ปกปิดข้อมูล รวม-แยกไฟล์ แปลง Word',
    }],
  }, renderRoute('/tnrpdfstudio')));

  // /subdivisionplan (landing บริการรับทำผังแบ่งแปลงที่ดิน โดย TNR GEOSERVICE)
  writeHtml('subdivisionplan', buildHtml(template, {
    url:         `${SITE}/subdivisionplan/`,
    title:       'รับทำผังแบ่งแปลงที่ดิน | ออกแบบผังจัดสรร ไฟล์ DWG SHP',
    description: 'รับทำผังแบ่งแปลงที่ดินและออกแบบผังจัดสรรจากโฉนด เลขโฉนด หรือพิกัดหมุด ระบุจำนวนแปลง ขนาด หน้ากว้าง และถนนภายใน รับไฟล์ JPG PDF DWG SHP พร้อมทยอยส่งแบบร่างให้ตรวจ โดย TNR GEOSERVICE',
    ogType:      'website',
    image:       `${SITE}/subdivision/og-subdivisionplan.jpg`,
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'Service',
        '@id': `${SITE}/subdivisionplan/#service`,
        name: 'รับทำผังแบ่งแปลงที่ดิน',
        alternateName: ['ออกแบบผังจัดสรร', 'รับทำผังจัดสรรที่ดิน', 'รับเขียนผังแบ่งแปลง DWG SHP'],
        serviceType: 'ออกแบบผังแบ่งแปลงที่ดินและผังจัดสรร',
        url: `${SITE}/subdivisionplan/`,
        image: `${SITE}/subdivision/og-subdivisionplan.jpg`,
        description: 'บริการออกแบบผังแบ่งแปลงที่ดินจากไฟล์สแกนโฉนด เลขโฉนด หรือพิกัดหมุดแปลง ส่งมอบไฟล์ JPG PDF DWG และ SHP ทยอยส่งแบบร่างให้ตรวจก่อนส่งไฟล์สมบูรณ์',
        provider: {
          '@type': 'Organization',
          name: 'TNR Geoservice', url: SITE,
          sameAs: ['https://www.facebook.com/TNRGEOSERVICE'],
        },
        areaServed: { '@type': 'Country', name: 'Thailand' },
        inLanguage: 'th-TH',
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        '@id': `${SITE}/subdivisionplan/#faq`,
        mainEntity: subFaqs.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org', '@type': 'HowTo',
        name: 'ขั้นตอนการจ้างทำผังแบ่งแปลงที่ดิน',
        description: 'ขั้นตอนส่งข้อมูลแปลง กำหนดเงื่อนไขผัง ตรวจแบบร่าง และรับไฟล์ผังสมบูรณ์',
        inLanguage: 'th-TH',
        step: subSteps.map((s) => ({
          '@type': 'HowToStep', position: Number(s.no), name: s.title, text: s.desc,
        })),
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'รับทำผังแบ่งแปลงที่ดิน', item: `${SITE}/subdivisionplan/` },
        ],
      },
    ],
  }, renderRoute('/subdivisionplan')));

  // /articles/:slug
  for (const { meta, faq } of articles) {
    const url = `${SITE}/articles/${meta.slug}/`;
    writeHtml(`articles/${meta.slug}`, buildHtml(template, {
      url, title: meta.title, description: meta.description, ogType: 'article', image: meta.cover,
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
            { '@type': 'ListItem', position: 2, name: 'บทความ',   item: `${SITE}/articles/` },
            { '@type': 'ListItem', position: 3, name: meta.title, item: url },
          ],
        },
        ...(faq && faq.length ? [{
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faq.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }] : []),
      ],
    }, renderRoute(`/articles/${meta.slug}`)));
  }

  // sitemap.xml — base + articles
  const urls = [
    { loc: `${SITE}/`,             changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://map.tnrmaphub.com/', changefreq: 'daily', priority: '0.9' },
    { loc: `${SITE}/tnrpdfstudio/`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE}/subdivisionplan/`, lastmod: '2026-07-19', changefreq: 'monthly', priority: '0.8' },
    { loc: `${SITE}/articles/`,    changefreq: 'weekly', priority: '0.6' },
    ...articles.map(({ meta }) => ({
      loc: `${SITE}/articles/${meta.slug}/`, lastmod: meta.updated ?? meta.date,
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
