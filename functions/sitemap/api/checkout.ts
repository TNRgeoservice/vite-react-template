// TNR SiteMap (tnrmaphub.com/sitemap) — POST /sitemap/api/checkout → หน้าชำระเงิน Stripe
// ตั้ง STRIPE_SECRET_KEY (secret) + PRICE_THB ใน Cloudflare Pages → Settings → Variables and Secrets
import { checkout, type PayEnv } from "../../_lib/sitemap_pay";
export const onRequestPost = (ctx: { request: Request; env: PayEnv }) => checkout(ctx.request, ctx.env);
