// TNR SiteMap — GET/POST /sitemap/api/stat → {count} ยอดกดสร้างรายงานสะสม (ต้อง bind KV ชื่อ SITEMAP_KV ใน Cloudflare Pages)
import { stat, type StatsEnv } from "../../_lib/sitemap_stats";
export const onRequest = (ctx: { request: Request; env: StatsEnv }) => stat(ctx.request, ctx.env);
