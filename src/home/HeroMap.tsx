// HeroMap.tsx — แผนที่สาธิตหน้าแรก: ใช้ Leaflet + ภาพดาวเทียม + ชั้นข้อมูลภาครัฐ (WMS) ชุดเดียวกับแผนที่จริง
// แปลงที่ดิน/ราคาเป็นตัวอย่างที่วาดขึ้นเอง (ไม่ใช่ประกาศจริง) — โหลด Leaflet แบบ lazy เพื่อไม่ถ่วงหน้าแรก
import { useEffect, useRef, useState } from 'react'
import type { FeatureGroup, LatLng, LeafletMouseEvent, Map as LMap, Marker, TileLayer } from 'leaflet'
import { Icon } from './Icon'

const MAP_URL = 'https://map.tnrmaphub.com'
const CENTER: [number, number] = [18.9285, 98.9157]
const ZOOM = 17

type LL = [number, number]
interface Plot {
  id: string
  name: string
  price: number
  poly: LL[]
}

// รูปแปลงตัวอย่าง (วาดบนทุ่งนาแถวเชียงใหม่) — ราคา/เนื้อที่เป็นตัวอย่าง
const PLOTS: Plot[] = [
  { id: 'D', name: 'ที่ดินแปลงใหญ่ ติดถนน เหมาะทำบ้านสวน', price: 6700000, poly: [[18.928473, 98.91504], [18.928493, 98.91592], [18.928371, 98.916414], [18.927275, 98.916371], [18.927316, 98.915126]] },
  { id: 'C', name: 'ที่ดินโล่ง เหมาะปลูกสร้าง', price: 4900000, poly: [[18.928453, 98.916457], [18.928554, 98.917905], [18.927742, 98.918012], [18.927641, 98.916618]] },
  { id: 'B', name: 'ที่ดินใกล้ชุมชน น้ำไฟถึง', price: 2850000, poly: [[18.928696, 98.913238], [18.928838, 98.914118], [18.928453, 98.914225], [18.928148, 98.913324]] },
  { id: 'F', name: 'ที่ดินแปลงเล็ก เหมาะสร้างบ้าน', price: 1650000, poly: [[18.928635, 98.914311], [18.928696, 98.914869], [18.928047, 98.91489], [18.927986, 98.914332]] },
]

const MIN_BUDGET = 1000000
const MAX_BUDGET = 7000000

const BASEMAPS = [
  { key: 'gsat', label: 'Satellite', url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' },
  { key: 'ghybrid', label: 'Hybrid', url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' },
  { key: 'groad', label: 'Road', url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' },
] as const

const GOV = [
  { key: 'landuse', label: 'ผังเมือง', layers: 'cityplan_dpt', version: '1.1.1' as const },
  { key: 'parcel', label: 'รูปแปลงที่ดิน', layers: 'dol_hd', version: '1.3.0' as const },
  { key: 'forest', label: 'ป่าไม้', layers: 'forest', version: '1.1.1' as const },
]
type GovKey = (typeof GOV)[number]['key']

// เครื่องมือบนแผนที่ (ทำงานได้จริงในตัวอย่าง)
type Tool = 'area' | 'measure' | 'edges'
const TOOLS: { key: Tool; label: string; hint: string }[] = [
  { key: 'area', label: '📏 คำนวณพื้นที่', hint: 'คลิกบนแผนที่เพื่อวางจุดมุมแปลง อย่างน้อย 3 จุด' },
  { key: 'measure', label: '↔ วัดระยะ', hint: 'คลิกบนแผนที่เพื่อวางจุด ระยะรวมจะแสดงต่อเนื่อง' },
  { key: 'edges', label: '📍 ระยะรอบแปลง', hint: 'คลิกแปลงตัวอย่างเพื่อดูระยะแต่ละด้านและเนื้อที่' },
]

// ค้นหาสถานที่ใกล้เคียง — endpoint เดียวกับแผนที่จริง (Places API ผ่านเซิร์ฟเวอร์ของ MapHub)
interface Place { name: string; address: string; lat: number; lng: number; province: string | null }

// ── helpers ─────────────────────────────────────────────
function areaSqm(poly: LL[]): number {
  const lat0 = poly.reduce((s, p) => s + p[0], 0) / poly.length
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180)
  const ky = 110540
  const pts = poly.map((p) => [p[1] * kx, p[0] * ky])
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    a += x1 * y2 - x2 * y1
  }
  return Math.abs(a) / 2
}
const raiNganWa = (sqm: number) => {
  const rai = Math.floor(sqm / 1600)
  const rest = sqm - rai * 1600
  const ngan = Math.floor(rest / 400)
  return `${rai}-${ngan}-${Math.round((rest - ngan * 400) / 4)}`
}
const th = (n: number) => Math.round(n).toLocaleString('th-TH')

const AREA = Object.fromEntries(PLOTS.map((p) => [p.id, areaSqm(p.poly)])) as Record<string, number>
const perWa = (p: Plot) => p.price / (AREA[p.id] / 4)

function centroid(poly: LL[]): LL {
  return [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length]
}

function popupHtml(p: Plot): string {
  return `
    <div class="tnr-pop">
      <div class="tnr-pop-t"><span>${p.name}</span><span class="tnr-st-tag tnr-st-available">ว่าง</span></div>
      <div class="tnr-pop-r"><span class="tnr-pop-k">💰 ราคา</span><span class="tnr-pop-v tnr-pop-hl">${th(p.price)} บาท</span></div>
      <div class="tnr-pop-r"><span class="tnr-pop-k">📐 เนื้อที่</span><span class="tnr-pop-v tnr-pop-area">${raiNganWa(AREA[p.id])} ไร่</span></div>
      <div class="tnr-pop-r"><span class="tnr-pop-k">🏷 ราคา/ตร.ว.</span><span class="tnr-pop-v">${th(perWa(p))} บาท</span></div>
      <div class="tnr-pop-r"><span class="tnr-pop-k">📍 ที่ตั้ง</span><span class="tnr-pop-v">เชียงใหม่ · ตัวอย่าง</span></div>
      <div class="tnr-pop-actions">
        <a href="${MAP_URL}" target="_blank" rel="noopener noreferrer" class="tnr-pop-btn tnr-pop-detail">รายละเอียด</a>
        <a href="${MAP_URL}/?login=1" target="_blank" rel="noopener noreferrer" class="tnr-pop-btn tnr-pop-contact">💬 ติดต่อผู้ขาย</a>
      </div>
      <div class="tnr-pop-actions2">
        <a href="${MAP_URL}" target="_blank" rel="noopener noreferrer" class="tnr-pop-btn tnr-pop-fav">🤍 บันทึก</a>
        <a href="${MAP_URL}" target="_blank" rel="noopener noreferrer" class="tnr-pop-btn">⇆ เทียบ</a>
        <a href="${MAP_URL}" target="_blank" rel="noopener noreferrer" class="tnr-pop-btn tnr-pop-ico" aria-label="Street View">🚶</a>
      </div>
    </div>`
}

// กล่องแผนที่แคบ → ช่องค้นหา+ตัวกรองกินพื้นที่ด้านบนมากกว่า ต้องเว้นให้ autoPan
const popupOptions = (width: number) => ({
  className: 'tnr-popup', maxWidth: 300, minWidth: 250,
  autoPanPaddingTopLeft: [12, width < 520 ? 140 : 64] as [number, number], autoPanPaddingBottomRight: [12, 12] as [number, number],
})

const escapeHtml = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

function labelHtml(p: Plot): string {
  return `<div class="tnr-price-box">
      <div class="tnr-price-top">${th(p.price)} บาท</div>
      <div class="tnr-price-sub">${raiNganWa(AREA[p.id])} ไร่ (${th(perWa(p))} บาท/ตร.ว.)</div>
    </div>`
}

// ── component ───────────────────────────────────────────
export default function HeroMap() {
  const elRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LMap | null>(null)
  const LRef = useRef<typeof import('leaflet') | null>(null)
  const baseRef = useRef<TileLayer | null>(null)
  const govRef = useRef<Partial<Record<GovKey, TileLayer>>>({})
  const plotsRef = useRef<Record<string, { group: FeatureGroup; label: Marker }>>({})

  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [base, setBase] = useState(0)
  const [limit, setLimit] = useState(MAX_BUDGET)
  const [showPrice, setShowPrice] = useState(true)
  const [layers, setLayers] = useState<Record<GovKey, boolean>>({ landuse: false, parcel: false, forest: false })
  const [tool, setTool] = useState<Tool | null>(null)
  const [readout, setReadout] = useState('')
  const [resetTick, setResetTick] = useState(0)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [searching, setSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [pinned, setPinned] = useState<string | null>(null)
  const placePinRef = useRef<Marker | null>(null)

  // สร้างแผนที่ครั้งเดียว — แสดงภาพนิ่งก่อน โหลด Leaflet + ไทล์ดาวเทียมเมื่อผู้ใช้กด "แตะเพื่อเล่นแผนที่" เท่านั้น
  // (ประหยัดโควตา/ค่าไทล์ และไม่ถ่วงหน้าแรกของคนที่แค่เข้ามาดู)
  useEffect(() => {
    if (!active) return
    let cancelled = false
    let map: LMap | undefined
    const start = () => {
      void (async () => {
      try {
        const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
        if (cancelled || !elRef.current) return
        LRef.current = L
        const touch = L.Browser.mobile
        map = L.map(elRef.current, {
          center: CENTER, zoom: ZOOM, maxZoom: 20, zoomControl: false, scrollWheelZoom: false,
          dragging: !touch, touchZoom: !touch,
        })
        mapRef.current = map
        map.attributionControl.addAttribution('© Google · แปลงและราคาเป็นตัวอย่าง')

        // เลื่อนล้อเมาส์ซูมได้เมื่อคลิกในแผนที่แล้วเท่านั้น (ไม่แย่งการเลื่อนหน้าเว็บ)
        map.on('click', () => map!.scrollWheelZoom.enable())
        map.on('mouseout', () => map!.scrollWheelZoom.disable())

        for (const p of PLOTS) {
          const c = centroid(p.poly)
          const group = L.featureGroup()
          L.polygon(p.poly, { color: '#00e676', weight: 2, fillOpacity: 0.25 }).addTo(group)
          L.circleMarker(c, { radius: 8, color: '#fff', weight: 2, fillColor: '#00e676', fillOpacity: 0.95 }).addTo(group)
          group.bindPopup(popupHtml(p), popupOptions(elRef.current.clientWidth))
          const label = L.marker(c, {
            icon: L.divIcon({ className: 'tnr-price-label', html: labelHtml(p), iconSize: [0, 0], iconAnchor: [0, 0] }),
            interactive: false, keyboard: false,
          })
          plotsRef.current[p.id] = { group, label }
        }
        setReady(true)
      } catch {
        if (!cancelled) setFailed(true)
      }
      })()
    }
    start()
    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
      baseRef.current = null
      govRef.current = {}
      plotsRef.current = {}
      placePinRef.current = null
      setReady(false)
    }
  }, [active])

  // พื้นหลังแผนที่
  useEffect(() => {
    const map = mapRef.current, L = LRef.current
    if (!ready || !map || !L) return
    baseRef.current?.remove()
    baseRef.current = L.tileLayer(BASEMAPS[base].url, { subdomains: ['0', '1', '2', '3'], maxZoom: 20 }).addTo(map)
    baseRef.current.bringToBack()
  }, [ready, base])

  // ชั้นข้อมูลภาครัฐ (WMS จริง)
  useEffect(() => {
    const map = mapRef.current, L = LRef.current
    if (!ready || !map || !L) return
    for (const g of GOV) {
      const existing = govRef.current[g.key]
      if (layers[g.key] && !existing) {
        govRef.current[g.key] = L.tileLayer.wms('https://ms.longdo.com/mapproxy/service?', {
          layers: g.layers, format: 'image/png', transparent: true, version: g.version,
          ...(g.version === '1.3.0' ? { crs: L.CRS.EPSG3857 } : {}), maxZoom: 20, opacity: 1,
        }).addTo(map)
      } else if (!layers[g.key] && existing) {
        existing.remove()
        delete govRef.current[g.key]
      }
    }
  }, [ready, layers])

  // กรองงบประมาณ + ป้ายราคา
  useEffect(() => {
    const map = mapRef.current
    if (!ready || !map) return
    for (const p of PLOTS) {
      const it = plotsRef.current[p.id]
      if (!it) continue
      const show = p.price <= limit
      if (show && !map.hasLayer(it.group)) it.group.addTo(map)
      if (!show && map.hasLayer(it.group)) it.group.remove()
      const wantLabel = show && showPrice
      if (wantLabel && !map.hasLayer(it.label)) it.label.addTo(map)
      if (!wantLabel && map.hasLayer(it.label)) it.label.remove()
    }
  }, [ready, limit, showPrice])

  // เครื่องมือ: คำนวณพื้นที่ / วัดระยะ / ระยะรอบแปลง
  useEffect(() => {
    const map = mapRef.current, L = LRef.current
    if (!ready || !map || !L || !tool) return
    const draw = L.layerGroup().addTo(map)
    const el = map.getContainer()
    el.classList.add('crosshair')
    if (tool === 'edges') el.classList.add('tool-edges') // ซ่อนป้ายราคาไม่ให้บังตัวเลขระยะ
    map.doubleClickZoom.disable()
    map.closePopup()
    // ระหว่างใช้เครื่องมือ คลิกแปลงไม่ควรเปิดการ์ด
    for (const p of PLOTS) plotsRef.current[p.id]?.group.unbindPopup()
    const vertex = (ll: LatLng) => L.circleMarker(ll, { radius: 4, color: '#fff', weight: 2, fillColor: '#ffb300', fillOpacity: 1 }).addTo(draw)
    const label = (ll: [number, number] | LatLng, text: string, cls = '') =>
      L.marker(ll, { icon: L.divIcon({ className: `tnr-edge-label ${cls}`, html: `<span>${text}</span>`, iconSize: [0, 0] }), interactive: false, keyboard: false }).addTo(draw)

    const cleanups: (() => void)[] = []
    if (tool === 'edges') {
      setReadout('คลิกแปลงตัวอย่างเพื่อดูระยะรอบแปลง')
      for (const p of PLOTS) {
        const group = plotsRef.current[p.id]?.group
        if (!group) continue
        const onClick = () => {
          draw.clearLayers()
          const n = p.poly.length
          for (let i = 0; i < n; i++) {
            const a = p.poly[i], b = p.poly[(i + 1) % n]
            label([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], map.distance(a, b).toFixed(1))
          }
          label(centroid(p.poly), `${raiNganWa(AREA[p.id])} ไร่`, 'area')
          setReadout(`แปลง ${p.id}: ${n} ด้าน · เนื้อที่ ${raiNganWa(AREA[p.id])} ไร่ (${th(AREA[p.id])} ตร.ม.)`)
        }
        group.on('click', onClick)
        cleanups.push(() => group.off('click', onClick))
      }
    } else {
      const pts: LatLng[] = []
      setReadout('คลิกบนแผนที่เพื่อวางจุด')
      const redraw = () => {
        draw.clearLayers()
        if (tool === 'area' && pts.length >= 3) L.polygon(pts, { color: '#ffb300', weight: 2, fillOpacity: 0.2 }).addTo(draw)
        else if (pts.length >= 2) L.polyline(pts, { color: '#ffb300', weight: 3, dashArray: tool === 'measure' ? '6 6' : '4 4' }).addTo(draw)
        pts.forEach(vertex)
        if (tool === 'measure') {
          let total = 0
          for (let i = 1; i < pts.length; i++) total += map.distance(pts[i - 1], pts[i])
          setReadout(pts.length < 2 ? 'คลิกจุดถัดไปเพื่อเริ่มวัด' : `ระยะรวม ${total >= 1000 ? (total / 1000).toFixed(2) + ' กม.' : total.toFixed(1) + ' ม.'} · ${pts.length - 1} ช่วง`)
        } else if (pts.length < 3) {
          setReadout(`วางจุดแล้ว ${pts.length} จุด — ต้องมีอย่างน้อย 3 จุด`)
        } else {
          const sqm = areaSqm(pts.map((c) => [c.lat, c.lng] as LL))
          setReadout(`เนื้อที่ ${raiNganWa(sqm)} ไร่ · ${th(sqm / 4)} ตร.วา · ${th(sqm)} ตร.ม.`)
        }
      }
      const onClick = (e: LeafletMouseEvent) => { pts.push(e.latlng); redraw() }
      map.on('click', onClick)
      cleanups.push(() => map.off('click', onClick))
    }
    return () => {
      cleanups.forEach((f) => f())
      draw.remove()
      el.classList.remove('crosshair', 'tool-edges')
      map.doubleClickZoom.enable()
      for (const p of PLOTS) plotsRef.current[p.id]?.group.bindPopup(popupHtml(p), popupOptions(el.clientWidth))
      setReadout('')
    }
  }, [ready, tool, resetTick])

  // ค้นหาสถานที่ใกล้เคียง (หน่วงเวลาพิมพ์ 350ms)
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) { setResults([]); setSearching(false); return }
    const ctrl = new AbortController()
    setSearching(true)
    const t = window.setTimeout(async () => {
      try {
        const r = await fetch(`${MAP_URL}/api/places-search?q=${encodeURIComponent(term)}&lat=${CENTER[0]}&lng=${CENTER[1]}`, { signal: ctrl.signal })
        setResults(r.ok ? ((await r.json()) as Place[]) : [])
      } catch { if (!ctrl.signal.aborted) setResults([]) }
      if (!ctrl.signal.aborted) setSearching(false)
    }, 350)
    return () => { window.clearTimeout(t); ctrl.abort() }
  }, [q])

  function goToPlace(pl: Place) {
    const map = mapRef.current, L = LRef.current
    if (!map || !L) return
    placePinRef.current?.remove()
    placePinRef.current = L.marker([pl.lat, pl.lng], {
      icon: L.divIcon({ className: 'tnr-place-pin', html: `<div><span>📍</span><b>${escapeHtml(pl.name)}</b></div>`, iconSize: [0, 0] }),
      interactive: false, keyboard: false,
    }).addTo(map)
    map.closePopup()
    map.flyTo([pl.lat, pl.lng], 16, { animate: !window.matchMedia('(prefers-reduced-motion: reduce)').matches })
    setPinned(pl.name)
    setQ('')
    setResults([])
    setSearchOpen(false)
  }

  function clearPlace() {
    placePinRef.current?.remove()
    placePinRef.current = null
    setPinned(null)
    mapRef.current?.flyTo(CENTER, ZOOM)
  }

  // เปิดการ์ดแปลงแรกให้เห็นหน้าตาเหมือนแผนที่จริง (กล่องแผนที่แคบ = มือถือ → ไม่เปิด การ์ดจะบังแปลงหมด)
  useEffect(() => {
    if (!ready || (elRef.current?.clientWidth ?? 0) < 520) return
    const t = window.setTimeout(() => plotsRef.current.D?.group.openPopup(), 700)
    return () => window.clearTimeout(t)
  }, [ready])

  const visible = PLOTS.filter((p) => p.price <= limit).length
  const budget = (limit / 1000000).toFixed(1)

  return (
    <div className="product-stage" aria-label="แผนที่สาธิตแบบโต้ตอบ แปลงและราคาเป็นตัวอย่าง">
      <div className="product-topline">
        <span className="label">A clearer view of your next move.</span>
        <span><i />ทดลองใช้งานแผนที่</span>
      </div>
      <div className="product-window">
        <div className="window-bar" aria-hidden="true">
          <i className="dot" /><i className="dot" /><i className="dot" />
          <span className="address"><Icon name="i-lock" />map.tnrmaphub.com</span>
        </div>
        <div className="app-bar hm-appbar">
          <div className="app-brand"><Icon name="i-menu" /><span>TNR MapHub <small>beta</small></span></div>
          <span className="example-badge">ข้อมูลตัวอย่าง</span>
        </div>
        <div className="map-body hm">
          <div ref={elRef} className="hm-canvas" role="application" aria-label="แผนที่ดาวเทียมพร้อมรูปแปลงที่ดินตัวอย่าง" />
          {!ready && (
            <div className="hm-loading">
              {failed ? (
                <p className="hm-fail">โหลดแผนที่ไม่สำเร็จ — เปิดแผนที่จริงจากปุ่มด้านบน</p>
              ) : (
                <button type="button" className="hm-start" onClick={() => setActive(true)} disabled={active} aria-busy={active}>
                  <span className="hm-start-pill">{active ? 'กำลังโหลดแผนที่…' : '▶ แตะเพื่อเล่นแผนที่'}</span>
                  <span className="hm-start-sub">ภาพดาวเทียมจริง · เลือกแปลง · เปิดชั้นข้อมูล · วัดระยะ</span>
                </button>
              )}
            </div>
          )}

          {ready && (
            <>
            <div className="hm-search">
              <Icon name="i-search" />
              <input
                type="search" value={q} placeholder={pinned ? `📍 ${pinned}` : 'ค้นหาสถานที่ใกล้เคียง…'} aria-label="ค้นหาสถานที่ใกล้เคียง"
                autoComplete="off"
                onChange={(e) => { setQ(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) { e.preventDefault(); goToPlace(results[0]) }
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
              {pinned && !q && <button type="button" className="hm-clear" onClick={clearPlace} aria-label="ล้างสถานที่ที่ค้นหา">✕</button>}
              {searchOpen && q.trim().length >= 2 && (
                <div className="hm-suggest" role="listbox" aria-label="สถานที่ที่พบ">
                  {searching && !results.length && <div className="hm-suggest-note">กำลังค้นหา…</div>}
                  {!searching && !results.length && <div className="hm-suggest-note">ไม่พบสถานที่</div>}
                  {results.map((r, i) => (
                    <button key={`${r.lat},${r.lng},${i}`} type="button" role="option" aria-selected="false" onMouseDown={(e) => e.preventDefault()} onClick={() => goToPlace(r)}>
                      <b>{r.name}</b><small>{r.address}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hm-card hm-filter">
              <label htmlFor="price-range">งบสูงสุด <b className="latin">{budget}</b> ล้านบาท</label>
              <input
                id="price-range" type="range" min={MIN_BUDGET} max={MAX_BUDGET} step={500000} value={limit}
                onChange={(e) => setLimit(Number(e.target.value))} aria-valuetext={`${budget} ล้านบาท`}
              />
              <div className="hm-hint" aria-live="polite">{visible ? `แสดง ${visible} แปลงตัวอย่าง` : 'ไม่พบแปลง ลองเพิ่มงบ'}</div>
            </div>

            <div className="hm-right">
              <div className="hm-btns">
                <button type="button" className="hm-btn" aria-pressed={showPrice} onClick={() => setShowPrice((v) => !v)}>
                  <span className="hm-dot" aria-hidden="true" />แสดงราคา
                </button>
                <button type="button" className="hm-btn" onClick={() => setBase((b) => (b + 1) % BASEMAPS.length)} aria-label={`เปลี่ยนแผนที่พื้นหลัง (ตอนนี้ ${BASEMAPS[base].label})`}>
                  <Icon name="i-map" />{BASEMAPS[base].label}
                </button>
              </div>
              <div className="hm-card hm-layers" role="group" aria-label="ชั้นข้อมูลภาครัฐ">
                <div className="hm-layers-t"><Icon name="i-layers" />ชั้นข้อมูล</div>
                {GOV.map((g) => (
                  <button
                    key={g.key} type="button" className="hm-toggle" aria-pressed={layers[g.key]}
                    onClick={() => setLayers((s) => ({ ...s, [g.key]: !s[g.key] }))}
                  >
                    {g.label}<span className="switch" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="hm-tools" role="group" aria-label="เครื่องมือบนแผนที่">
              {TOOLS.map((t) => (
                <button key={t.key} type="button" aria-pressed={tool === t.key} onClick={() => setTool((cur) => (cur === t.key ? null : t.key))} title={t.hint}>
                  {t.label}
                </button>
              ))}
            </div>
            {tool && (
              <div className="hm-readout" role="status" aria-live="polite">
                <div className="hm-readout-main">{readout}</div>
                <div className="hm-readout-sub">ระยะและเนื้อที่ใช้ดูคร่าวๆ เท่านั้น อ้างอิงทางกฎหมายไม่ได้</div>
                <div className="hm-readout-act">
                  {tool !== 'edges' && <button type="button" onClick={() => setResetTick((n) => n + 1)}>ล้าง</button>}
                  <button type="button" onClick={() => setTool(null)}>ปิดเครื่องมือ</button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </div>
      <div className="product-footnote">
        <span><Icon name="i-info" />แผนที่จริง · แปลงและราคาเป็นตัวอย่าง</span>
        <span className="interaction-hint">{ready ? 'คลิกแปลง · ปรับงบ · เปิดชั้นข้อมูล ↗' : 'แตะเพื่อเริ่มเล่นแผนที่ตัวอย่าง ↗'}</span>
      </div>
    </div>
  )
}
