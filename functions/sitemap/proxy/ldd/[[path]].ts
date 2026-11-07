// TNR SiteMap — กรมพัฒนาที่ดินไม่เปิด CORS → ส่งต่อเฉพาะบริการกลุ่มชุดดิน/การใช้ที่ดิน (ไม่เป็น open proxy)
export const onRequestGet = async (ctx: { request: Request; params: { path?: string[] } }) => {
  const path = (ctx.params.path ?? []).join("/");
  if (!/^ArcGIS\/rest\/services\/LDD_SOIL_(WM_CACHE|QUERY_WM)\/MapServer\//.test(path)) return new Response("not allowed", { status: 403 });
  const tail = `eis.ldd.go.th/${path}${new URL(ctx.request.url).search}`, init = { cf: { cacheTtl: 86400, cacheEverything: true } } as RequestInit;
  // https ก่อน · บาง runtime ไม่มี root GlobalSign R46 → ถอยไป http (ข้อมูลสาธารณะ เนื้อหาเดียวกัน)
  const r = await fetch(`https://${tail}`, init).catch(() => fetch(`http://${tail}`, init));
  const h = new Headers(r.headers);
  h.set("cache-control", "public, max-age=86400");
  return new Response(r.body, { status: r.status, headers: h });
};
