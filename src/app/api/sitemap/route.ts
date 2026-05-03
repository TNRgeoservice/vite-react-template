// DEPRECATED — real sitemap is at src/app/sitemap.ts (Next metadata convention).
// Kept for backward compatibility with any hard-coded /api/sitemap links.
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
    headers: { 'Content-Type': 'application/xml' },
  });
}
