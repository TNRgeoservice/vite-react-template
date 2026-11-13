// TNR SiteMap — /sitemap/api/topup (ระบบเครดิต · ต้องล็อกอิน Firebase) — ดู functions/_lib/sitemap_credit.ts
// ตั้งใน Cloudflare Pages: STRIPE_SECRET_KEY, FIREBASE_PROJECT_ID, KV binding SITEMAP_KV
import { credit, type CreditEnv } from "../../_lib/sitemap_credit";
export const onRequestPost = (ctx: { request: Request; env: CreditEnv }) => credit(ctx.request, ctx.env, "topup");
