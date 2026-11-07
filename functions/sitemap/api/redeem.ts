// TNR SiteMap — POST /sitemap/api/redeem → ตรวจกับ Stripe ว่าจ่ายแล้วและเป็นแปลงเดิม
import { redeem, type PayEnv } from "../../_lib/sitemap_pay";
export const onRequestPost = (ctx: { request: Request; env: PayEnv }) => redeem(ctx.request, ctx.env);
