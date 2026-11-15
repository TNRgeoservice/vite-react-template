// ภาพดาวเทียม Esri World Imagery ผ่าน proxy ของเรา: key (ARCGIS_KEY ไม่ขึ้นต้น VITE_) อยู่ฝั่ง server เท่านั้น → ไม่หลุดไปใน JS ของเว็บ/GitHub
// dev = vite.config.ts (devApi) · เว็บจริง = articles-web/functions/sitemap/proxy/esri/[[path]].ts (build:web copy ไฟล์นี้ไป _lib/sitemap_esri.ts)
// รับเฉพาะ tile z/y/x (z ≤ 19) จากหน้าเว็บเราเอง (ไม่เป็น open proxy) · ไม่ส่งต่อข้อความ error ของ Esri
const OK_HOST = /^(localhost(:\d+)?|tnrmaphub\.com|([a-z0-9-]+\.)?tnrmaphub-landing\.pages\.dev)$/;

export async function esriTile(req: Request, path: string, key: string | undefined): Promise<Response> {
  if (!key) return new Response("imagery not configured", { status: 503 });
  const m = path.match(/^(\d{1,2})\/(\d{1,7})\/(\d{1,7})$/);
  if (!m || Number(m[1]) > 19) return new Response("bad tile", { status: 400 });
  let host = "";
  try { host = new URL(req.headers.get("referer") ?? req.headers.get("origin") ?? "").host; } catch { /* ไม่มี referer */ }
  if (!OK_HOST.test(host)) return new Response("forbidden", { status: 403 });
  // key ล็อก referrer ไว้ที่ tnrmaphub.com → ส่ง referer นี้จากฝั่ง server
  const r = await fetch(`https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/${m[1]}/${m[2]}/${m[3]}?token=${encodeURIComponent(key)}`, { headers: { referer: "https://tnrmaphub.com/" } });
  const h = new Headers({ "content-type": r.headers.get("content-type") ?? "image/jpeg", "cache-control": "private, max-age=86400" });
  return new Response(r.ok ? r.body : null, { status: r.status, headers: h });
}
