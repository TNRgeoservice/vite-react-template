// Google Map Tiles API ผ่าน proxy ของเรา: key (GOOGLE_MAPS_KEY ไม่ขึ้นต้น VITE_) อยู่ฝั่ง server เท่านั้น → ไม่หลุดไปใน JS ของเว็บ/GitHub
// dev = vite.config.ts (devApi) · เว็บจริง = articles-web/functions/sitemap/proxy/gmap/[[path]].ts (build:web copy ไฟล์นี้ไป _lib/sitemap_gmap.ts)
// รับเฉพาะ: POST session?type= · GET tile/{z}/{x}/{y}?session= · GET viewport?session=&zoom=&north=&south=&east=&west= จากหน้าเว็บเราเอง · ไม่เก็บ cache ฝั่ง server (ข้อตกลง Google)
const OK_HOST = /^(localhost(:\d+)?|tnrmaphub\.com|([a-z0-9-]+\.)?tnrmaphub-landing\.pages\.dev)$/;
const API = "https://tile.googleapis.com";
const SESSION: Record<string, object> = {
  gsat: { mapType: "satellite", language: "th-TH", region: "TH" },
  ghybrid: { mapType: "satellite", language: "th-TH", region: "TH", layerTypes: ["layerRoadmap"] },
  groad: { mapType: "roadmap", language: "th-TH", region: "TH" },
};
const NUM = /^-?\d{1,3}(\.\d{1,20})?$/;
// key ล็อก referrer ไว้ที่ tnrmaphub.com → ส่ง referer นี้จากฝั่ง server
const H = { referer: "https://tnrmaphub.com/" };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

export async function gmap(req: Request, path: string, key: string | undefined): Promise<Response> {
  if (!key) return json({ error: { message: "Google basemap not configured" } }, 503);
  let host = "";
  try { host = new URL(req.headers.get("referer") ?? req.headers.get("origin") ?? "").host; } catch { /* ไม่มี referer */ }
  if (!OK_HOST.test(host)) return json({ error: { message: "forbidden" } }, 403);
  const q = new URL(req.url).searchParams, k = encodeURIComponent(key);

  if (path === "session" && req.method === "POST") {
    const body = SESSION[q.get("type") ?? ""];
    if (!body) return json({ error: { message: "bad type" } }, 400);
    const r = await fetch(`${API}/v1/createSession?key=${k}`, { method: "POST", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = (await r.json().catch(() => ({}))) as { session?: string; expiry?: string; error?: { message?: string } };
    return r.ok ? json({ session: j.session, expiry: j.expiry }) : json({ error: { message: j.error?.message ?? `Map Tiles API ${r.status}` } }, r.status);
  }
  const session = q.get("session") ?? "";
  if (!/^[\w-]{10,600}$/.test(session)) return json({ error: { message: "bad session" } }, 400);

  const t = path.match(/^tile\/(\d{1,2})\/(\d{1,7})\/(\d{1,7})$/);
  if (t && req.method === "GET") {
    const r = await fetch(`${API}/v1/2dtiles/${t[1]}/${t[2]}/${t[3]}?session=${session}&key=${k}`, { headers: H });
    return new Response(r.ok ? r.body : null, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "image/png", "cache-control": "private, max-age=3600" } });
  }
  if (path === "viewport" && req.method === "GET") {
    const p = ["zoom", "north", "south", "east", "west"].map((n) => q.get(n) ?? "");
    if (!p.every((v) => NUM.test(v))) return json({ error: { message: "bad viewport" } }, 400);
    const r = await fetch(`${API}/tile/v1/viewport?session=${session}&key=${k}&zoom=${p[0]}&north=${p[1]}&south=${p[2]}&east=${p[3]}&west=${p[4]}`, { headers: H });
    const j = (await r.json().catch(() => ({}))) as { copyright?: string };
    return json({ copyright: j.copyright ?? "Google" }, r.ok ? 200 : r.status);
  }
  return json({ error: { message: "not allowed" } }, 404);
}
