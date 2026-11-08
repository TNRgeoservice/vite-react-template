// TNR SiteMap — POST /sitemap/api/feedback {text, contact} → เก็บใน KV (คีย์ fb:<เวลา>) · ดูใน Cloudflare dashboard → KV
import { feedback, type StatsEnv } from "../../_lib/sitemap_stats";
export const onRequestPost = (ctx: { request: Request; env: StatsEnv }) => feedback(ctx.request, ctx.env);
