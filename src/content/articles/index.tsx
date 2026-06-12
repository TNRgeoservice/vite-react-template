// ════════════════════════════════════════
// src/content/articles/index.tsx
// Article registry — metadata + body component ของแต่ละบทความ
// ใช้โดย ArticlesIndex, ArticlePage และ prerender script
// เพิ่มบทความใหม่ = สร้างไฟล์ component + เพิ่ม 1 entry ใน array นี้
// ════════════════════════════════════════
import type { ComponentType } from 'react';
import { LandlockedLand, meta as landlockedMeta, FAQ as landlockedFaq } from './landlocked-land';
import { CheckLandBeforeBuying, meta as checkLandMeta, FAQ as checkLandFaq } from './check-land-before-buying';
import { CityPlanOnline, meta as cityPlanMeta, FAQ as cityPlanFaq } from './city-plan-online';
import { LandSubdivisionVsAllocation, meta as subdivisionMeta, FAQ as subdivisionFaq } from './land-subdivision-vs-allocation';
import { LandSubdivisionSteps, meta as subdivisionStepsMeta, FAQ as subdivisionStepsFaq } from './land-subdivision-steps';
import { LandAppraisalPriceOnline, meta as appraisalMeta, FAQ as appraisalFaq } from './land-appraisal-price-online';
import { ObjectLandAppraisalPrice, meta as objectAppraisalMeta, FAQ as objectAppraisalFaq } from './object-land-appraisal-price';
import { LandAllocationLicense, meta as allocationLicenseMeta, FAQ as allocationLicenseFaq } from './land-allocation-license';

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
  faq?: { q: string; a: string }[];   // ใช้ gen FAQPage JSON-LD ตอน prerender
}

export const articles: Article[] = [
  { meta: landlockedMeta, Body: LandlockedLand, faq: landlockedFaq },
  { meta: checkLandMeta, Body: CheckLandBeforeBuying, faq: checkLandFaq },
  { meta: allocationLicenseMeta, Body: LandAllocationLicense, faq: allocationLicenseFaq },
  { meta: objectAppraisalMeta, Body: ObjectLandAppraisalPrice, faq: objectAppraisalFaq },
  { meta: appraisalMeta, Body: LandAppraisalPriceOnline, faq: appraisalFaq },
  { meta: subdivisionStepsMeta, Body: LandSubdivisionSteps, faq: subdivisionStepsFaq },
  { meta: subdivisionMeta, Body: LandSubdivisionVsAllocation, faq: subdivisionFaq },
  { meta: cityPlanMeta, Body: CityPlanOnline, faq: cityPlanFaq },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.meta.slug === slug);
}
