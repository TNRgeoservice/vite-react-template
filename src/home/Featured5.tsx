// Featured5.tsx — "ที่ดินแนะนำ": ข้อมูลจริงจาก map.tnrmaphub.com/api/plots/featured, ถ้าน้อยกว่า 8 ต่อด้วย /featured.json (ป้าย "ตัวอย่าง")
import { useEffect, useState } from 'react'
import { Icon } from './Icon'

const MAP_URL = 'https://map.tnrmaphub.com'
const TARGET_COUNT = 8

interface ApiPlot {
  id: string
  name: string
  province: string | null
  amphoe: string | null
  areaSqm: number | null
  priceTotal: number | null
  tags: string[]
  photo: string | null
}

interface MockPlot {
  id: string
  title: string
  province: string
  district: string
  areaText: string
  price: number
  pricePerSqWa: number
  image: string
  tags: string[]
}

interface DisplayPlot {
  id: string
  title: string
  province: string
  district: string
  areaText: string
  price: number
  pricePerSqWa: number | null
  image: string
  tags: string[]
  isMock: boolean
  href: string
}

// รูปประกาศต้นฉบับกว้าง 2,000+ px แต่การ์ดแสดง ~320px → ขอรูปย่อ (webp) จาก image optimizer ของแผนที่จริง
const OPTIMIZABLE = /^https:\/\/(firebasestorage\.googleapis\.com|lh3\.googleusercontent\.com)\//
const THUMB_WIDTHS = [384, 640, 828] // ต้องอยู่ใน images.deviceSizes/imageSizes ของ Next
const thumbUrl = (src: string, w: number) => `${MAP_URL}/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=70`
const thumbSrcSet = (src: string) => THUMB_WIDTHS.map((w) => `${thumbUrl(src, w)} ${w}w`).join(', ')
const THUMB_SIZES = '(max-width:520px) 92vw, (max-width:1000px) 46vw, (max-width:1250px) 31vw, 320px'

function formatBaht(n: number | null): string {
  if (!n || !Number.isFinite(n)) return 'ติดต่อสอบถาม'
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('th-TH', { maximumFractionDigits: 1 })} ล้านบาท`
  return `${n.toLocaleString('th-TH')} บาท`
}

function formatPerSqWa(n: number | null): string {
  if (!n || !Number.isFinite(n)) return '—'
  return `${n.toLocaleString('th-TH')} บาท/ตร.ว.`
}

/** ตร.ม. → "X-Y-Z" (ไร่-งาน-ตร.วา) */
function formatRaiNganWa(sqm: number | null): string {
  if (!sqm || !Number.isFinite(sqm) || sqm <= 0) return '—'
  const rai = Math.floor(sqm / 1600)
  const rest = sqm - rai * 1600
  const ngan = Math.floor(rest / 400)
  const wa = Math.round((rest - ngan * 400) / 4)
  return `${rai}-${ngan}-${wa}`
}

function apiToDisplay(p: ApiPlot): DisplayPlot {
  const wa = p.areaSqm && p.areaSqm > 0 ? p.areaSqm / 4 : 0
  return {
    id: p.id,
    title: p.name || 'ที่ดินขาย',
    province: p.province || '',
    district: p.amphoe || '',
    areaText: formatRaiNganWa(p.areaSqm),
    price: p.priceTotal || 0,
    pricePerSqWa: p.priceTotal && wa ? Math.round(p.priceTotal / wa) : null,
    image: p.photo || '',
    tags: p.tags || [],
    isMock: false,
    href: `${MAP_URL}/plot/${p.id}`,
  }
}

function mockToDisplay(m: MockPlot): DisplayPlot {
  return { ...m, title: m.title, isMock: true, href: `${MAP_URL}/plot/${m.id}` }
}

function PlotImage({ src, alt }: { src: string; alt: string }) {
  const [fallback, setFallback] = useState(false)
  if (!OPTIMIZABLE.test(src) || fallback) return <img src={src} alt={alt} loading="lazy" decoding="async" />
  return (
    <img
      src={thumbUrl(src, 640)} srcSet={thumbSrcSet(src)} sizes={THUMB_SIZES} alt={alt}
      loading="lazy" decoding="async" onError={() => setFallback(true)} // optimizer ล่ม → ใช้รูปต้นฉบับแทน
    />
  )
}

export default function Featured5() {
  const [plots, setPlots] = useState<DisplayPlot[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let real: DisplayPlot[] = []
      try {
        const r = await fetch(`${MAP_URL}/api/plots/featured?limit=${TARGET_COUNT}`)
        if (r.ok) real = (((await r.json()).plots || []) as ApiPlot[]).map(apiToDisplay)
      } catch { /* ใช้ตัวอย่างแทน */ }
      let final = real
      if (real.length < TARGET_COUNT) {
        try {
          const r = await fetch('/featured.json')
          if (r.ok) {
            const mocks = (await r.json()) as MockPlot[]
            final = [...real, ...mocks.slice(0, TARGET_COUNT - real.length).map(mockToDisplay)]
          }
        } catch { /* ignore */ }
      }
      if (!cancelled) setPlots(final)
    })()
    return () => { cancelled = true }
  }, [])

  if (plots.length === 0) return null
  const hasMock = plots.some((p) => p.isMock)

  return (
    <section className="section featured-section" id="featured" aria-labelledby="featured-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow">ที่ดินแนะนำ</div>
            <h2 id="featured-title">แปลงล่าสุดในระบบ</h2>
          </div>
          <p>
            {hasMock ? 'แปลงล่าสุดในระบบ + ตัวอย่างผลงาน — ' : 'เปิดแผนที่ดูแปลงจริง — '}
            <a className="link inline" href={MAP_URL} target="_blank" rel="noopener noreferrer">ดูทั้งหมดในแผนที่ <Icon name="i-arrow" /></a>
          </p>
        </div>
        <div className="plot-cards">
          {plots.map((p) => (
            <a key={p.id} className="plot-card reveal" href={p.href} target="_blank" rel="noopener noreferrer">
              <div className="plot-card-img">
                {p.image ? <PlotImage src={p.image} alt={p.title} /> : <div className="plot-card-noimg" aria-hidden="true"><Icon name="i-map" /></div>}
                {p.isMock && <span className="plot-card-badge">ตัวอย่าง</span>}
              </div>
              <div className="plot-card-body">
                <div className="plot-card-loc"><Icon name="i-pin" />{[p.province, p.district].filter(Boolean).join(' · ') || '—'}</div>
                <h3>{p.title}</h3>
                <div className="plot-card-area">ขนาด <span className="latin">{p.areaText}</span> ไร่</div>
                <div className="plot-card-price latin">{formatBaht(p.price)}</div>
                <div className="plot-card-unit">{formatPerSqWa(p.pricePerSqWa)}</div>
                {p.tags.length > 0 && (
                  <div className="plot-card-tags">
                    {p.tags.slice(0, 2).map((t) => (
                      <button
                        key={t} type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`${MAP_URL}/?tags=${encodeURIComponent(t)}`, '_blank', 'noopener,noreferrer') }}
                      >#{t}</button>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
