// ════════════════════════════════════════
// src/content/articles/index.tsx
// Article registry — metadata + body component ของแต่ละบทความ
// ใช้โดย ArticlesIndex, ArticlePage และ prerender script
// เพิ่มบทความใหม่ = สร้างไฟล์ component + เพิ่ม 1 entry ใน array นี้
// ════════════════════════════════════════
import type { ComponentType } from 'react';
import { CityPlanOnline, meta as cityPlanMeta } from './city-plan-online';

export interface ArticleMeta {
  slug:        string;   // URL: /articles/{slug}
  title:       string;   // <h1> + SEO title
  description: string;   // meta description (~150–160 ตัวอักษร)
  excerpt:     string;   // สรุปสั้นบนการ์ด index
  date:        string;   // ISO published (YYYY-MM-DD)
  updated?:    string;   // ISO last-updated
  tags?:       string[];
  readMin?:    number;   // เวลาอ่านโดยประมาณ (นาที)
  cover?:      string;   // hero + การ์ด thumbnail + OG; absolute URL: https://tnrmaphub.com/article-images/{slug}.webp (1200×630); ไม่ใส่ = ไม่โชว์ภาพ
}

export interface Article {
  meta: ArticleMeta;
  Body: ComponentType;
}

export const articles: Article[] = [
  { meta: cityPlanMeta, Body: CityPlanOnline },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.meta.slug === slug);
}
