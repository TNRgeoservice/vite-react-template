// TNR SiteMap — /sitemap/proxy/esri/{z}/{y}/{x} → ภาพดาวเทียม Esri World Imagery (key อยู่ฝั่ง server) — ดู functions/_lib/sitemap_esri.ts
// ตั้ง ARCGIS_KEY (secret) ใน Cloudflare Pages → Settings → Variables and Secrets
import { esriTile } from "../../../_lib/sitemap_esri";
export const onRequestGet = (ctx: { request: Request; params: { path?: string[] }; env: { ARCGIS_KEY?: string } }) =>
  esriTile(ctx.request, (ctx.params.path ?? []).join("/"), ctx.env.ARCGIS_KEY);
