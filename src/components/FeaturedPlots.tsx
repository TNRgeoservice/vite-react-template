// ════════════════════════════════════════
// FeaturedPlots.tsx — Section "ที่ดินแนะนำ" (Static JSON)
// ดึงจาก /featured.json → render 8 cards
// แต่ละ card click → map.tnrmaphub.com/plot/{id}
// Disclaimer ด้านบน: "ตัวอย่างผลงาน" (เพื่อไม่ทำลาย trust)
// ════════════════════════════════════════
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'

const MAP_URL = 'https://map.tnrmaphub.com'

interface Plot {
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

function formatBaht(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('th-TH', { maximumFractionDigits: 1 })} ล้านบาท`
  return `${n.toLocaleString('th-TH')} บาท`
}

function formatPerSqWa(n: number): string {
  return `${n.toLocaleString('th-TH')} บาท/ตร.ว.`
}

export default function FeaturedPlots() {
  const [plots, setPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/featured.json')
      .then((r) => r.json())
      .then((data: Plot[]) => setPlots(data))
      .catch(() => setPlots([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (plots.length === 0) return null

  return (
    <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">ที่ดินแนะนำ</h2>
            <p className="text-sm text-[var(--tx2)]">
              ตัวอย่างผลงาน — เปิดแผนที่ดูแปลงจริงทั่วไทย
            </p>
          </motion.div>
          <motion.a
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ x: 4 }}
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--acc)] hover:text-[var(--acc2)] font-semibold"
          >
            ดูทั้งหมดในแผนที่
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {plots.map((plot) => (
            <motion.a
              key={plot.id}
              href={`${MAP_URL}/plot/${plot.id}`}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl overflow-hidden hover:border-[var(--acc)]/40 transition-colors"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg)]">
                <img
                  src={plot.image}
                  alt={plot.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Demo badge — minimal */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-white/90">ตัวอย่าง</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs text-[var(--tx2)] mb-2">
                  <MapPin className="w-3 h-3 text-[var(--acc)]" />
                  <span>{plot.province} · {plot.district}</span>
                </div>

                <h3 className="text-sm font-semibold text-[var(--tx)] mb-2 line-clamp-2 min-h-[2.5rem]">
                  {plot.title}
                </h3>

                <div className="text-xs text-[var(--tx2)] mb-2">
                  ขนาด {plot.areaText} ไร่
                </div>

                <div className="mt-auto">
                  <div className="text-[var(--acc)] font-bold text-lg leading-tight">
                    {formatBaht(plot.price)}
                  </div>
                  <div className="text-xs text-[var(--tx2)] mb-3">
                    {formatPerSqWa(plot.pricePerSqWa)}
                  </div>

                  {/* Tags — clickable → filter map */}
                  <div className="flex flex-wrap gap-1.5">
                    {plot.tags.slice(0, 2).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(
                            `${MAP_URL}/?tags=${encodeURIComponent(tag)}`,
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }}
                        className="inline-block px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--brd)] text-[10px] text-[var(--tx2)] hover:border-[var(--acc)] hover:text-[var(--acc)] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
