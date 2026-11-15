// TNR SiteMap — /sitemap/proxy/gmap/* → Google Map Tiles API (key อยู่ฝั่ง server) — ดู functions/_lib/sitemap_gmap.ts
// ตั้ง GOOGLE_MAPS_KEY (secret) ใน Cloudflare Pages → Settings → Variables and Secrets
import { gmap } from "../../../_lib/sitemap_gmap";
export const onRequest = (ctx: { request: Request; params: { path?: string[] }; env: { GOOGLE_MAPS_KEY?: string } }) =>
  gmap(ctx.request, (ctx.params.path ?? []).join("/"), ctx.env.GOOGLE_MAPS_KEY);
