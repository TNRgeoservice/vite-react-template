// ระบบจ่ายเงินรายงาน (Stripe Checkout) — ไม่มีฐานข้อมูล: Stripe เป็นที่เก็บว่าใครจ่ายแล้ว · ทีละ 1 แปลง
// checkout: สร้างหน้าชำระเงิน PRICE_THB บาท (ค่าเริ่ม 149) · ผูกพิกัดแปลงไว้ใน metadata
// redeem:   ถาม Stripe ว่า session นี้จ่ายแล้ว + เป็นแปลงเดิม (ห่าง ≤ 200 ม. — เผื่อเลื่อนรูปแปลง) + ไม่เกิน 24 ชม. → ออกรายงานได้
// key: STRIPE_SECRET_KEY (ฝั่ง server เท่านั้น ห้ามขึ้นต้น VITE_)
// เรียก Stripe REST ด้วย fetch (ไม่ใช้ SDK) → ไฟล์เดียวใช้ได้ทั้ง dev (vite.config) และ Cloudflare Pages Functions
//   ⚠ ไฟล์นี้ถูกคัดลอกไป articles-web/functions/_lib/sitemap_pay.ts ตอน `npm run build:web` — แก้ที่นี่ที่เดียว
export type PayEnv = { STRIPE_SECRET_KEY?: string; PRICE_THB?: string };

const MAX_PARCELS = 1, VALID_MS = 24 * 3600e3, NEAR_M = 200;
type LL = [number, number];
type Session = { url?: string; created: number; payment_status: string; metadata?: Record<string, string>; error?: { message: string } };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });
async function stripe(env: PayEnv, path: string, form?: Record<string, string>): Promise<Session> {
  if (!env.STRIPE_SECRET_KEY) throw new Error("ยังไม่ได้ตั้งค่า STRIPE_SECRET_KEY");
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? "POST" : "GET",
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, ...(form && { "content-type": "application/x-www-form-urlencoded" }) },
    body: form && new URLSearchParams(form),
  });
  const j = (await r.json()) as Session;
  if (!r.ok) throw new Error(j.error?.message ?? `Stripe ${r.status}`);
  return j;
}
// พิกัดกลางแปลง [lat, lng] ในไทย · ปัด 5 ตำแหน่ง (~1 ม.)
function parseFp(v: unknown): LL[] | null {
  if (!Array.isArray(v) || v.length < 1 || v.length > MAX_PARCELS) return null;
  const out: LL[] = [];
  for (const p of v) {
    if (!Array.isArray(p) || p.length !== 2) return null;
    const [lat, lng] = p.map(Number);
    if (!(lat >= 5 && lat <= 21 && lng >= 97 && lng <= 106)) return null;
    out.push([Math.round(lat * 1e5) / 1e5, Math.round(lng * 1e5) / 1e5]);
  }
  return out;
}
const enc = (f: LL[]) => f.map(([a, b]) => `${a},${b}`).join("|");
const dec = (s: string): LL[] => s.split("|").filter(Boolean).map((x) => x.split(",").map(Number) as LL);
const distM = ([a1, o1]: LL, [a2, o2]: LL) => { const k = Math.PI / 180, x = (o2 - o1) * k * Math.cos(((a1 + a2) / 2) * k), y = (a2 - a1) * k; return Math.hypot(x, y) * 6371e3; };

export async function checkout(req: Request, env: PayEnv): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const fp = parseFp(body.fp);
    if (!fp) return json({ error: "ข้อมูลแปลงไม่ถูกต้อง (ทีละ 1 แปลง พิกัดในประเทศไทย)" }, 400);
    const price = Number(env.PRICE_THB ?? 149);
    const u = new URL(req.url), base = u.origin + u.pathname.replace(/api\/checkout\/?$/, ""); // หน้าแอป: …/sitemap/ (เว็บจริง) หรือ / (dev)
    const s = await stripe(env, "checkout/sessions", {
      mode: "payment",
      locale: "th",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "thb",
      "line_items[0][price_data][unit_amount]": String(Math.round(price * 100)),
      "line_items[0][price_data][product_data][name]": "รายงานเช็คที่ดินก่อนซื้อ TNR SiteMap",
      "line_items[0][price_data][product_data][description]": "รายงาน PDF + ภาพสรุปหน้าเดียว 1 แปลง",
      "metadata[fp]": enc(fp),
      success_url: `${base}?paid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}?paycancel=1`,
    });
    return json({ url: s.url });
  } catch (e) { return json({ error: (e as Error).message }, 500); }
}

export async function redeem(req: Request, env: PayEnv): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const id = String(body.session_id ?? ""), fp = parseFp(body.fp);
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id) || !fp) return json({ ok: false, error: "คำขอไม่ถูกต้อง" }, 400);
    const s = await stripe(env, `checkout/sessions/${id}`).catch(() => null);
    if (!s) return json({ ok: false, error: "ไม่พบรายการชำระเงินนี้" }, 404);
    if (s.payment_status !== "paid") return json({ ok: false, error: "ยังไม่ได้ชำระเงิน" }, 402);
    if (Date.now() - s.created * 1000 > VALID_MS) return json({ ok: false, error: "ใบเสร็จนี้เกิน 24 ชม. แล้ว — ชำระใหม่เพื่อออกรายงาน" }, 402);
    const paid = dec(s.metadata?.fp ?? "");
    if (!fp.every((p) => paid.some((q) => distM(p, q) <= NEAR_M))) return json({ ok: false, error: "แปลงไม่ตรงกับที่ชำระเงินไว้" }, 403);
    return json({ ok: true, until: s.created * 1000 + VALID_MS });
  } catch (e) { return json({ ok: false, error: (e as Error).message }, 500); }
}
