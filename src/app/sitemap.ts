// ════════════════════════════════════════
// src/app/sitemap.ts
// Dynamic sitemap — generated at build time
// Next.js auto-serves at /sitemap.xml
// ════════════════════════════════════════
import type { MetadataRoute } from 'next';
import { getAdminDb }         from '@/lib/firebase-admin';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnrmaphub.netlify.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:              SITE_URL,
      lastModified:     new Date(),
      changeFrequency:  'daily',
      priority:         1.0,
    },
  ];

  try {
    const db   = getAdminDb();
    const snap = await db.collection('fieldsurvey_points')
      .where('status', '==', 'available')
      .orderBy('updatedAt', 'desc')
      .limit(5000)   // sitemap max 50k URLs — split if needed
      .get();

    const plotRoutes: MetadataRoute.Sitemap = snap.docs.map(doc => {
      const d = doc.data();
      return {
        url:             `${SITE_URL}/plot/${doc.id}`,
        lastModified:    d.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      };
    });

    return [...staticRoutes, ...plotRoutes];
  } catch(e) {
    console.error('[Sitemap] error:', e);
    return staticRoutes;
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;
