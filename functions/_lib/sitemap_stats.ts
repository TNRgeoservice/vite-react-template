// ตัวนับ "สร้างรายงานสะสม" + กล่อง feedback (เว็บลูกค้า tnrmaphub.com/sitemap)
// เก็บใน Cloudflare KV (binding ชื่อ SITEMAP_KV) · ดู feedback: Cloudflare dashboard → Storage & Databases → KV → namespace → คีย์ขึ้นต้น fb:
// ตอน dev: vite.config ส่ง KV ในหน่วยความจำมาแทน
//   ⚠ ไฟล์นี้ถูกคัดลอกไป articles-web/functions/_lib/sitemap_stats.ts ตอน `npm run build:web` — แก้ที่นี่ที่เดียว
export type KV = { get(k: string): Promise<string | null>; put(k: string, v: string): Promise<void> };
export type StatsEnv = { SITEMAP_KV?: KV };

const COUNT = "count:reports";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

// GET = อ่านยอด · POST = +1 (กดสร้างรายงาน) · KV ไม่ atomic: กดพร้อมกันเป๊ะอาจนับขาดได้ — พอสำหรับตัวเลขโชว์
export async function stat(req: Request, env: StatsEnv): Promise<Response> {
  const kv = env.SITEMAP_KV;
  if (!kv) return json({ count: null });
  let n = Number((await kv.get(COUNT)) ?? 0) || 0;
  if (req.method === "POST") await kv.put(COUNT, String(++n));
  return json({ count: n });
}

export async function feedback(req: Request, env: StatsEnv): Promise<Response> {
  const kv = env.SITEMAP_KV;
  if (!kv) return json({ ok: false, error: "ระบบรับความเห็นยังไม่พร้อม" }, 503);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (b.website) return json({ ok: true }); // ช่องดักบอท (คนไม่เห็น)
  const text = String(b.text ?? "").trim().slice(0, 2000), contact = String(b.contact ?? "").trim().slice(0, 200);
  if (text.length < 3) return json({ ok: false, error: "พิมพ์ข้อความก่อนส่ง" }, 400);
  const at = new Date().toISOString();
  await kv.put(`fb:${at}:${Math.random().toString(36).slice(2, 7)}`, JSON.stringify({ at, text, contact, ua: req.headers.get("user-agent")?.slice(0, 200) ?? "" }));
  return json({ ok: true });
}
