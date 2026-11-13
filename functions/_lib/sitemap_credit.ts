// ระบบเครดิตรายงาน (ล็อกอินด้วยบัญชี Firebase เดียวกับ MapHub) — 1 เครดิต = รายงาน 1 แปลง
// GET  /api/credit            → {bal, packs}   (ตรวจรายการเติมที่ยังไม่เข้า จาก Stripe ด้วย — กันกรณีจ่ายแล้วปิดหน้าก่อนกลับ)
// POST /api/topup {pack}      → {url} หน้าชำระเงิน Stripe
// POST /api/topup-redeem {session_id} → {bal} เติมเครดิตทันทีหลังกลับจาก Stripe
// POST /api/spend {fp}        → {ok, bal} หัก 1 เครดิต (แปลงเดิมภายใน 24 ชม. ไม่หักซ้ำ)
// ทุกคำขอต้องมี header  authorization: Bearer <Firebase ID token>  → ตรวจลายเซ็นกับ public key ของ Google (ไม่ต้องใช้ service account)
// เก็บใน Cloudflare KV (SITEMAP_KV): cr:<uid> = ยอด · pi:<payment_intent> = เติมแล้ว · un:<uid> = แปลงที่ปลดล็อกล่าสุด
//   ⚠ KV ไม่ atomic: กดพร้อมกันเป๊ะจากหลายแท็บอาจหัก/เติมคลาดได้ — ยอมรับได้สำหรับปริมาณตอนนี้
//   ⚠ ไฟล์นี้ถูกคัดลอกไป articles-web/functions/_lib/sitemap_credit.ts ตอน `npm run build:web` — แก้ที่นี่ที่เดียว
import type { KV } from "./_stats.js";

export type CreditEnv = { STRIPE_SECRET_KEY?: string; FIREBASE_PROJECT_ID?: string; SITEMAP_KV?: KV };
export type Verify = (token: string, env: CreditEnv) => Promise<{ uid: string; email: string }>;

export const PACKS: Record<string, { n: number; thb: number }> = {
  p5: { n: 5, thb: 690 },
  p10: { n: 10, thb: 1290 },
  p30: { n: 30, thb: 3290 },
};
const VALID_MS = 24 * 3600e3, NEAR_M = 200;
type LL = [number, number];

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
class HttpErr extends Error { status: number; constructor(status: number, msg: string) { super(msg); this.status = status; } }

// ---------- Firebase ID token (RS256) ----------
const JWKS = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
type CK = Awaited<ReturnType<typeof crypto.subtle.importKey>>;
let jwks: { at: number; keys: Record<string, CK> } | null = null;
const b64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
async function keys(): Promise<Record<string, CK>> {
  if (jwks && Date.now() - jwks.at < 3600e3) return jwks.keys;
  const j = (await (await fetch(JWKS)).json()) as { keys: ({ kid: string } & Record<string, unknown>)[] };
  const out: Record<string, CK> = {};
  for (const k of j.keys) out[k.kid] = await crypto.subtle.importKey("jwk", k as never, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  jwks = { at: Date.now(), keys: out };
  return out;
}
export const verifyFirebase: Verify = async (token, env) => {
  const pid = env.FIREBASE_PROJECT_ID;
  if (!pid) throw new HttpErr(500, "ยังไม่ได้ตั้งค่า FIREBASE_PROJECT_ID");
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) throw new HttpErr(401, "กรุณาเข้าสู่ระบบใหม่");
  let head: { alg: string; kid: string }, body: { aud: string; iss: string; exp: number; iat: number; sub: string; email?: string };
  try { head = JSON.parse(new TextDecoder().decode(b64u(h))); body = JSON.parse(new TextDecoder().decode(b64u(p))); }
  catch { throw new HttpErr(401, "กรุณาเข้าสู่ระบบใหม่"); }
  const key = head.alg === "RS256" ? (await keys())[head.kid] : undefined;
  const ok = key && await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64u(s), new TextEncoder().encode(`${h}.${p}`));
  const now = Date.now() / 1000;
  if (!ok || body.aud !== pid || body.iss !== `https://securetoken.google.com/${pid}` || body.exp < now || body.iat > now + 300 || !body.sub)
    throw new HttpErr(401, "กรุณาเข้าสู่ระบบใหม่");
  return { uid: body.sub, email: body.email ?? "" };
};

// ---------- Stripe ----------
async function stripe<T>(env: CreditEnv, path: string, form?: Record<string, string>): Promise<T> {
  if (!env.STRIPE_SECRET_KEY) throw new HttpErr(500, "ยังไม่ได้ตั้งค่า STRIPE_SECRET_KEY");
  const r = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: form ? "POST" : "GET",
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, ...(form && { "content-type": "application/x-www-form-urlencoded" }) },
    body: form && new URLSearchParams(form),
  });
  const j = (await r.json()) as T & { error?: { message: string } };
  if (!r.ok) throw new HttpErr(502, j.error?.message ?? `Stripe ${r.status}`);
  return j;
}
type PI = { id: string; status: string; metadata?: Record<string, string> };

// ---------- ยอดเครดิต ----------
const bal = async (kv: KV, uid: string) => Number((await kv.get(`cr:${uid}`)) ?? 0) || 0;
const setBal = (kv: KV, uid: string, n: number) => kv.put(`cr:${uid}`, String(n));
// เติมจาก payment intent ที่จ่ายแล้ว (ครั้งเดียวต่อ pi) → คืนจำนวนที่เติม
async function creditPI(kv: KV, uid: string, pi: PI): Promise<number> {
  const n = Number(pi.metadata?.credits ?? 0);
  if (pi.status !== "succeeded" || pi.metadata?.uid !== uid || !(n > 0) || await kv.get(`pi:${pi.id}`)) return 0;
  await kv.put(`pi:${pi.id}`, JSON.stringify({ uid, n, at: new Date().toISOString() }));
  await setBal(kv, uid, (await bal(kv, uid)) + n);
  return n;
}

function parseFp(v: unknown): LL | null {
  if (!Array.isArray(v) || v.length !== 1 || !Array.isArray(v[0]) || v[0].length !== 2) return null;
  const [lat, lng] = v[0].map(Number);
  return lat >= 5 && lat <= 21 && lng >= 97 && lng <= 106 ? [lat, lng] : null;
}
const distM = ([a1, o1]: LL, [a2, o2]: LL) => { const k = Math.PI / 180, x = (o2 - o1) * k * Math.cos(((a1 + a2) / 2) * k), y = (a2 - a1) * k; return Math.hypot(x, y) * 6371e3; };

export async function credit(req: Request, env: CreditEnv, action: "credit" | "topup" | "topup-redeem" | "spend", verify: Verify = verifyFirebase): Promise<Response> {
  try {
    const kv = env.SITEMAP_KV;
    if (!kv) throw new HttpErr(503, "ระบบเครดิตยังไม่พร้อม");
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    const { uid, email } = await verify(token, env);
    const body = req.method === "POST" ? (await req.json().catch(() => ({}))) as Record<string, unknown> : {};

    if (action === "credit") {
      // เก็บตก: รายการเติมที่จ่ายแล้วแต่ยังไม่เข้า (Stripe Search อัปเดตช้าราว 1 นาที)
      if (env.STRIPE_SECRET_KEY) {
        const q = encodeURIComponent(`metadata['uid']:'${uid}' AND status:'succeeded'`);
        const r = await stripe<{ data: PI[] }>(env, `payment_intents/search?query=${q}&limit=20`).catch(() => ({ data: [] }));
        for (const pi of r.data) await creditPI(kv, uid, pi);
      }
      return json({ bal: await bal(kv, uid), packs: PACKS });
    }

    if (action === "topup") {
      const pack = PACKS[String(body.pack)];
      if (!pack) throw new HttpErr(400, "ไม่พบแพ็กนี้");
      const u = new URL(req.url), base = u.origin + u.pathname.replace(/api\/topup\/?$/, "");
      const s = await stripe<{ url: string }>(env, "checkout/sessions", {
        mode: "payment",
        locale: "th",
        ...(email && { customer_email: email }),
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "thb",
        "line_items[0][price_data][unit_amount]": String(pack.thb * 100),
        "line_items[0][price_data][product_data][name]": `เครดิตรายงาน TNR SiteMap ${pack.n} ฉบับ`,
        "line_items[0][price_data][product_data][description]": `รายงานเช็คที่ดิน ${pack.n} แปลง (ฉบับละ ${Math.round(pack.thb / pack.n)} บาท) · ใช้ได้ไม่มีวันหมดอายุ`,
        "metadata[uid]": uid,
        "metadata[credits]": String(pack.n),
        "payment_intent_data[metadata][uid]": uid,
        "payment_intent_data[metadata][credits]": String(pack.n),
        success_url: `${base}?topup={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}?topupcancel=1`,
      });
      return json({ url: s.url });
    }

    if (action === "topup-redeem") {
      const id = String(body.session_id ?? "");
      if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) throw new HttpErr(400, "คำขอไม่ถูกต้อง");
      const s = await stripe<{ payment_status: string; payment_intent: string | null; metadata?: Record<string, string> }>(env, `checkout/sessions/${id}`);
      if (s.metadata?.uid !== uid) throw new HttpErr(403, "รายการนี้ไม่ใช่ของบัญชีนี้");
      if (s.payment_status !== "paid" || !s.payment_intent) throw new HttpErr(402, "ยังไม่ได้ชำระเงิน (พร้อมเพย์อาจใช้เวลาสักครู่ — เครดิตจะเข้าเองเมื่อชำระสำเร็จ)");
      const added = await creditPI(kv, uid, await stripe<PI>(env, `payment_intents/${s.payment_intent}`));
      return json({ bal: await bal(kv, uid), added });
    }

    // spend: แปลงเดิม (≤ 200 ม.) ภายใน 24 ชม. หลังหัก → ไม่หักซ้ำ
    const fp = parseFp(body.fp);
    if (!fp) throw new HttpErr(400, "ข้อมูลแปลงไม่ถูกต้อง (ทีละ 1 แปลง พิกัดในประเทศไทย)");
    const un = JSON.parse((await kv.get(`un:${uid}`)) ?? "null") as { fp: LL; until: number } | null;
    if (un && un.until > Date.now() && distM(un.fp, fp) <= NEAR_M) return json({ ok: true, bal: await bal(kv, uid), charged: 0, until: un.until });
    const b = await bal(kv, uid);
    if (b < 1) throw new HttpErr(402, "เครดิตไม่พอ — เติมเครดิตก่อน");
    await setBal(kv, uid, b - 1);
    const until = Date.now() + VALID_MS;
    await kv.put(`un:${uid}`, JSON.stringify({ fp, until }));
    await kv.put(`use:${uid}:${new Date().toISOString()}`, JSON.stringify({ fp, email }));
    return json({ ok: true, bal: b - 1, charged: 1, until });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, e instanceof HttpErr ? e.status : 500);
  }
}
