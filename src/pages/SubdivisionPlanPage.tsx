import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Map, MapPin, Layers, ArrowRight, ScanLine, Hash, Maximize2,
  FileImage, FileText, PenTool, ClipboardList, SendHorizontal, Plus, Minus, X,
} from 'lucide-react'

// ── shared motion variants (match App.tsx) ──
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

// Facebook glyph (not in this lucide build)
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.95.93-1.95 1.87v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  )
}

const FB_URL = 'https://www.facebook.com/TNRGEOSERVICE'

// ── accuracy bar — domain 0–100%, fills from left so higher = fuller ──
// solid layer = guaranteed floor (min) · faded layer = up to best case (max)
function AccuracyBar({ min, max, color }: { min: number; max: number; color: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-3 rounded-full bg-[var(--bg3)] overflow-hidden">
      {/* faded upper-range fill: 0 → max */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `var(${color})`, opacity: 0.3 }}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${max}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      {/* solid floor fill: 0 → min */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `var(${color})` }}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${min}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── count-up number (animates once when scrolled into view) ──
function CountUp({ to, suffix = '', duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (reduce) { setVal(to); return }
    const el = ref.current
    if (!el) return
    let raf = 0, start = 0, done = false
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !done) {
        done = true
        const step = (t: number) => {
          if (!start) start = t
          const p = Math.min((t - start) / (duration * 1000), 1)
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => { obs.disconnect(); cancelAnimationFrame(raf) }
  }, [to, duration, reduce])
  return <span ref={ref}>{val}{suffix}</span>
}

const inputMethods = [
  {
    icon: ScanLine, title: 'ส่งไฟล์สแกนโฉนด', color: '--land',
    min: 90, max: 100,
    note: 'ความแม่นยำระยะขึ้นอยู่กับปีที่รังวัดและมาตราส่วนของโฉนด',
  },
  {
    icon: Hash, title: 'ส่งแค่เลขโฉนด', color: '--poly',
    min: 80, max: 100,
    note: 'ค้นรูปแปลงจากเว็บกรมที่ดิน (LandsMaps) แล้วใช้รูปแปลงตามเว็บ',
  },
  {
    icon: MapPin, title: 'ส่งพิกัดหมุดแปลง', color: '--acc',
    min: 99, max: 100,
    note: 'ได้จากใบ รว.25 หรือการรังวัดอื่น แม่นยำตามที่รังวัดจริง',
  },
]

export const steps = [
  {
    no: '01', tag: 'ทางเลือกส่งข้อมูล', title: 'ส่งไฟล์สแกนโฉนด',
    desc: 'ลูกค้าส่งภาพสแกนโฉนดมาให้ เราถอดรูปแปลงจากโฉนด — ความแม่นยำระยะ 90–100% ขึ้นอยู่กับปีที่รังวัดและมาตราส่วนของโฉนด',
  },
  {
    no: '02', tag: 'ทางเลือกส่งข้อมูล', title: 'ส่งแค่เลขโฉนด',
    desc: 'ลูกค้าส่งเฉพาะเลขโฉนด เราไปค้นหารูปแปลงที่เว็บกรมที่ดิน (LandsMaps) แล้วใช้รูปแปลงตามเว็บ — ความแม่นยำ 80–100%',
  },
  {
    no: '03', tag: 'ทางเลือกส่งข้อมูล', title: 'ส่งพิกัดหมุดแปลง',
    desc: 'ลูกค้าส่งพิกัดหมุดแปลงที่ได้จากใบ รว.25 หรือการรังวัดอื่น — ความแม่นยำ 99–100% ตามที่รังวัดจริง',
  },
  {
    no: '04', tag: 'ระบุความต้องการ', title: 'กำหนดเงื่อนไขผังใหม่',
    desc: 'ลูกค้าระบุจำนวนแปลงที่ต้องการ, ขนาด ตร.ว. ต่อแปลง, หน้ากว้างขั้นต่ำ (เมตร), ความกว้างถนนภายใน (เมตร) และไฟล์ผลลัพธ์ที่ต้องการ (.jpg .pdf .dwg .shp)',
  },
  {
    no: '05', tag: 'ดำเนินงาน', title: 'ทยอยส่งร่าง แก้ไข แล้วส่งไฟล์สมบูรณ์',
    desc: 'เราทยอยส่งแบบร่างให้ลูกค้าตรวจเป็นระยะ แก้ไขได้ทันทีก่อนงานไปไกล เมื่อพอใจแล้วจึงส่งไฟล์สมบูรณ์',
  },
]

const formats = [
  { ext: '.jpg', icon: FileImage, color: '--land', use: 'ดูง่าย แชร์ต่อได้ทันที', detail: 'ภาพผังพร้อมดู เปิดได้ทุกเครื่อง เหมาะสำหรับส่งให้ลูกค้าดู แชร์ในแชท หรือโพสต์ประกาศ' },
  { ext: '.pdf', icon: FileText, color: '--road', use: 'พร้อมพิมพ์ ใช้แนบเอกสาร', detail: 'ผังคุณภาพสำหรับพิมพ์และแนบเอกสาร คงสัดส่วนและความคมชัด เหมาะกับงานนำเสนอ' },
  { ext: '.dwg', icon: PenTool, color: '--poly', use: 'เปิดใน CAD แก้ไขต่อ', detail: 'ไฟล์ CAD เปิดใน AutoCAD และโปรแกรมออกแบบ นำไปแก้ไข ต่อยอด หรือถอดปริมาณงานได้' },
  { ext: '.shp', icon: Layers, color: '--acc', use: 'เข้าโปรแกรม GIS/แผนที่', detail: 'Shapefile สำหรับงาน GIS นำเข้าโปรแกรมแผนที่ ซ้อนกับชั้นข้อมูลเชิงพื้นที่อื่นได้' },
]

// ── real work samples (from TNR GEOSERVICE archive) ──
const portfolio = [
  { src: '/subdivision/portfolio/work-1.jpg', w: 1600, h: 1131, title: 'แบ่ง 18 แปลง + พื้นที่ส่วนกลาง', meta: 'ถนนภายใน 8 ม. · มาตราส่วน 1:500' },
  { src: '/subdivision/portfolio/work-2.jpg', w: 1600, h: 1131, title: 'โครงการจัดสรร 42 แปลง', meta: 'ถนน 8–10 ม. · มาตราส่วน 1:1000' },
  { src: '/subdivision/portfolio/work-3.jpg', w: 1600, h: 2263, title: 'ผังเต็มพื้นที่ 44 แปลง', meta: 'แปลง 100–200 ตร.ว. · 1:1000' },
  { src: '/subdivision/portfolio/work-4.jpg', w: 1600, h: 1132, title: 'แบ่งแปลงใหญ่ 14 แปลง', meta: 'แปลง 100+ ตร.ว. · ถนน 6–8 ม.' },
  { src: '/subdivision/portfolio/work-5.jpg', w: 1600, h: 2263, title: 'ผังแบ่งแปลงติดถนนคอนกรีต', meta: 'ถนนภายใน 7–8 ม. · 1:500' },
  { src: '/subdivision/portfolio/work-6.jpg', w: 1600, h: 1132, title: 'แบ่งแปลงใหญ่ติดร่องน้ำ', meta: 'แปลงหลักไร่ · แสดงเนื้อที่ ตร.ว./ไร่' },
]

export const faqs = [
  {
    q: 'ใช้เวลานานไหม',
    a: 'ขึ้นอยู่กับความซับซ้อนของงานและจำนวนแปลง เราทำงานแบบทยอยส่งแบบร่างให้เห็นความคืบหน้าเป็นระยะ ไม่ต้องรอจนจบแล้วค่อยเห็นงาน',
  },
  {
    q: 'ต้องเตรียมเอกสารอะไรบ้าง',
    a: 'เลือกส่งอย่างใดอย่างหนึ่ง: ไฟล์สแกนโฉนด, เลขโฉนด, หรือพิกัดหมุดแปลง พร้อมระบุความต้องการผัง (จำนวนแปลง ขนาด ตร.ว. หน้ากว้าง และถนนภายใน)',
  },
  {
    q: 'แก้แบบได้กี่ครั้ง',
    a: 'แก้ไขได้ระหว่างทางก่อนสรุปไฟล์สมบูรณ์ เพราะเราทยอยส่งแบบร่างให้ตรวจเป็นระยะ จึงปรับแก้ได้ทันทีก่อนงานเดินไปไกล',
  },
  {
    q: 'ผังนี้ใช้ยื่นขออนุญาตจัดสรรได้ไหม',
    a: 'ผังนี้เป็นแบบออกแบบ/นำเสนอเพื่อวางแผนการแบ่งแปลง ไม่ใช่เอกสารราชการ การยื่นขอจัดสรรที่ดินต้องดำเนินการรังวัดและยื่นผ่านหน่วยงานที่เกี่ยวข้องแยกต่างหาก',
  },
  {
    q: 'ราคาเท่าไหร่',
    a: 'ประเมินตามความซับซ้อนของงานและจำนวนแปลง ทักมาคุยรายละเอียดก่อนได้ที่ Facebook แล้วเราประเมินให้',
  },
  {
    q: 'ได้ไฟล์อะไรบ้าง',
    a: 'เลือกได้ตามการใช้งาน — .jpg สำหรับดู/แชร์, .pdf สำหรับพิมพ์/เอกสาร, .dwg สำหรับ CAD, และ .shp สำหรับงาน GIS',
  },
]

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export function SubdivisionPlanPage() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const headerBg = useTransform(scrollYProgress, [0, 0.08], ['rgba(13, 21, 32, 0)', 'rgba(13, 21, 32, 0.95)'])
  const [activeStep, setActiveStep] = useState(0)
  const [activeFmt, setActiveFmt] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const lbCloseRef = useRef<HTMLButtonElement>(null)
  const lbReturnRef = useRef<HTMLElement | null>(null)

  // lightbox lifecycle: Esc-to-close, scroll lock, focus in / return
  useEffect(() => {
    if (lightbox === null) return
    lbReturnRef.current = document.activeElement as HTMLElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lbCloseRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lbReturnRef.current?.focus?.()
    }
  }, [lightbox])

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      {/* ── Header ── */}
      <motion.header
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[var(--brd)]/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-[var(--acc)]/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-[var(--acc)]" />
              </span>
              <span className="text-lg font-semibold tracking-tight">TNR MapHub</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-7">
              <Link to="/" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">หน้าหลัก</Link>
              <Link to="/articles" className="hidden sm:inline text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">บทความ</Link>
              <a
                href={FB_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold hover:bg-[var(--acc2)] transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
                ปรึกษาโปรเจกต์
              </a>
            </nav>
          </div>
        </div>
        {/* scroll progress */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--acc)] origin-left"
        />
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          animate={reduce ? undefined : { opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-[var(--acc)]/10 blur-3xl pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--brd)] mb-6"
            >
              <Layers className="w-4 h-4 text-[var(--acc)]" />
              <span className="text-sm text-[var(--tx2)]">บริการโดย TNR GEOSERVICE</span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(1.9rem, 5.2vw, 3.4rem)' }}
            >
              รับทำผังแบ่งแปลงที่ดิน{' '}
              <span className="text-[var(--acc)]">ออกแบบเป็นรูปเป็นร่าง</span>{' '}
              ก่อนลงมือจริง
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[var(--tx)] mb-8 max-w-xl leading-relaxed"
            >
              ส่งแค่ไฟล์สแกนโฉนด เลขโฉนด หรือพิกัดหมุดแปลง ก็เริ่มงานได้
              บอกจำนวนแปลง ขนาด หน้ากว้าง และถนนภายในที่ต้องการ
              แล้วรับผังเป็นไฟล์ .jpg .pdf .dwg .shp ทยอยส่งแบบร่างให้ตรวจก่อนสรุปงานจริง
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
              <a
                href={FB_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-colors"
              >
                <FacebookIcon className="w-5 h-5" />
                ปรึกษาผังของคุณ
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--brd)] text-[var(--tx)] rounded-xl text-base font-medium hover:bg-[var(--bg2)] transition-colors"
              >
                ดูตัวอย่างผลงาน
              </a>
            </motion.div>
          </motion.div>

          {/* hero visual: illustration plate, degrades to clean panel if missing */}
          <motion.div
            variants={scaleIn} initial="hidden" animate="visible"
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative rounded-2xl border border-[var(--brd)] overflow-hidden"
            style={{ background: 'var(--bg)', minHeight: '18rem' }}
          >
            <img
              src="/subdivision/hero.webp"
              alt="ตัวอย่างผังแบ่งแปลงที่ดินสำหรับออกแบบผังจัดสรร โดย TNR GEOSERVICE"
              width={1400} height={933}
              loading="eager" fetchpriority="high" decoding="async"
              onError={hideOnError}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Input methods comparison ── */}
      <section id="methods" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer} className="max-w-3xl mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              รับทำผังแบ่งแปลงที่ดินจากข้อมูล 3 แบบ — เลือกได้ตามที่มี
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] text-base">
              แต่ละวิธีให้ความแม่นยำระยะต่างกัน ยิ่งข้อมูลตั้งต้นดี ผังยิ่งตรงกับของจริง
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            {/* comparison rows */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer} className="space-y-4"
            >
              {inputMethods.map((m) => (
                <motion.div
                  key={m.title} variants={fadeInUp}
                  className="rounded-2xl border border-[var(--brd)] bg-[var(--bg)] p-5"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `var(${m.color})15`, color: `var(${m.color})` }}
                    >
                      <m.icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--tx)]">{m.title}</h3>
                        <span className="text-sm font-bold shrink-0" style={{ color: `var(${m.color})` }}>
                          {m.min}–{m.max}%
                        </span>
                      </div>
                      <p className="text-sm text-[var(--tx2)] mb-3">{m.note}</p>
                      <AccuracyBar min={m.min} max={m.max} color={m.color} />
                    </div>
                  </div>
                </motion.div>
              ))}
              <p className="text-sm text-[var(--tx2)] pt-1">
                แถบทึบ = ความแม่นยำขั้นต่ำที่การันตี · แถบจาง = ช่วงสูงสุด — ยิ่งเต็ม ยิ่งแม่นยำ
              </p>
            </motion.div>

            {/* deed → digital illustration plate */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="rounded-2xl border border-[var(--brd)] overflow-hidden"
              style={{ background: 'var(--bg)' }}
            >
              <img
                src="/subdivision/deed-to-digital.webp"
                alt="แปลงไฟล์สแกนโฉนดที่ดินเป็นรูปแปลงดิจิทัลเพื่อทำผังแบ่งแปลง"
                width={1200} height={800}
                loading="lazy" decoding="async"
                onError={hideOnError}
                className="w-full h-auto object-cover"
              />
              <div className="p-5 border-t border-[var(--brd)]">
                <p className="text-sm text-[var(--tx)] leading-relaxed">
                  จากภาพสแกนโฉนดสู่รูปแปลงดิจิทัลที่นำไปแบ่งและออกแบบต่อได้
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Portfolio gallery ── */}
      <section id="portfolio" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer} className="max-w-3xl mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              ตัวอย่างผลงานผังแบ่งแปลง
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] text-base">
              ผังจริงบางส่วนจากงานที่เราทำ — ตั้งแต่แบ่งไม่กี่แปลงไปจนถึงโครงการจัดสรรหลายสิบแปลง
              พร้อมถนนภายใน เนื้อที่ต่อแปลง และมาตราส่วน แตะที่ภาพเพื่อดูเต็ม
            </motion.p>
          </motion.div>

          {/* count-up stats */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { n: 400, suffix: '+', color: '--acc', label: 'ผังแบ่งแปลงที่จัดทำ' },
              { n: 99, suffix: '%', color: '--land', label: 'ความแม่นยำสูงสุด' },
              { n: 4, suffix: '', color: '--poly', label: 'รูปแบบไฟล์ส่งมอบ' },
              { n: 3, suffix: '', color: '--road', label: 'ช่องทางส่งข้อมูล' },
            ].map((s) => (
              <motion.div
                key={s.label} variants={scaleIn}
                className="rounded-2xl border border-[var(--brd)] bg-[var(--bg2)] px-4 py-5 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold leading-none" style={{ color: `var(${s.color})` }}>
                  <CountUp to={s.n} suffix={s.suffix} />
                </div>
                <div className="text-[13px] text-[var(--tx2)] mt-2">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* masonry-style columns, preserves each plan's aspect ratio */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="[column-count:1] sm:[column-count:2] lg:[column-count:3] gap-4 sm:gap-5"
          >
            {portfolio.map((p, i) => (
              <motion.button
                key={p.src} variants={fadeInUp} type="button"
                onClick={() => setLightbox(i)}
                className="group mb-4 sm:mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-[var(--brd)] bg-[var(--bg2)] text-left transition-colors hover:border-[var(--acc)]/60"
                aria-label={`ดูภาพเต็ม: ${p.title}`}
              >
                <div className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
                  <img
                    src={p.src} alt={`ผลงานผังแบ่งแปลง: ${p.title}`}
                    width={p.w} height={p.h} loading="lazy" onError={hideOnError}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-[var(--bg)]/85 backdrop-blur px-2 py-1 text-[11px] font-medium text-[var(--tx2)] opacity-70 group-hover:opacity-100 group-hover:text-[var(--acc)] transition-all">
                    <Maximize2 className="w-3 h-3" /> ดูเต็ม
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--tx)]">{p.title}</h3>
                  <p className="text-[13px] text-[var(--tx2)] mt-0.5">{p.meta}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
          <p className="text-sm text-[var(--tx2)] mt-2">
            ภาพผังตัวอย่างจากงานจริง ปรับลดรายละเอียดเฉพาะบางส่วนเพื่อการนำเสนอ
          </p>
        </div>
      </section>

      {/* ── 5-step timeline ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer} className="mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              ขั้นตอนการจ้างทำผังแบ่งแปลง
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] text-base">
              ขั้นที่ 01–03 คือทางเลือกวิธีส่งข้อมูล (เลือกอย่างใดอย่างหนึ่ง) จากนั้นเข้าสู่การระบุความต้องการและดำเนินงาน
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* vertical rail */}
            <div className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-[var(--brd)] hidden sm:block" aria-hidden="true" />
            <ol className="space-y-3">
              {steps.map((s, i) => {
                const active = activeStep === i
                return (
                  <li key={s.no} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveStep(i)}
                      aria-expanded={active}
                      className="w-full text-left flex gap-4 sm:gap-5 rounded-2xl border p-4 sm:p-5 transition-colors"
                      style={{
                        borderColor: active ? 'var(--acc)' : 'var(--brd)',
                        background: active ? 'var(--bg3)' : 'var(--bg)',
                      }}
                    >
                      <span
                        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base z-10"
                        style={{
                          background: active ? 'var(--acc)' : 'var(--bg2)',
                          color: active ? 'var(--bg)' : 'var(--tx2)',
                          border: active ? 'none' : '1px solid var(--brd)',
                        }}
                      >
                        {s.no}
                      </span>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[13px] font-semibold" style={{ color: 'var(--tx2)' }}>{s.tag}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--tx)]">{s.title}</h3>
                        <p
                          className="text-sm text-[var(--tx2)] leading-relaxed overflow-hidden transition-all duration-300"
                          style={{ maxHeight: active ? '10rem' : '0', opacity: active ? 1 : 0, marginTop: active ? '0.5rem' : 0 }}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Output formats ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer} className="mb-10 max-w-2xl"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              รับเขียนผังแบ่งขายที่ดินเป็นไฟล์ JPG PDF DWG และ SHP
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] text-base">
              แตะเลือกนามสกุลไฟล์เพื่อดูว่าแต่ละแบบเหมาะกับงานไหน
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-[auto_1fr] gap-5 md:gap-8 items-stretch">
            {/* selectable format tabs (non-uniform layout) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-1">
              {formats.map((f, i) => {
                const active = activeFmt === i
                return (
                  <button
                    key={f.ext} type="button" onClick={() => setActiveFmt(i)}
                    className="shrink-0 md:w-52 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors text-left"
                    style={{
                      borderColor: active ? `var(${f.color})` : 'var(--brd)',
                      background: active ? `var(${f.color})12` : 'var(--bg2)',
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `var(${f.color})15`, color: `var(${f.color})` }}
                    >
                      <f.icon className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block font-mono font-bold text-[var(--tx)]">{f.ext}</span>
                      <span className="block text-[13px] text-[var(--tx2)]">{f.use}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* active format detail panel */}
            <div
              className="rounded-2xl border p-6 sm:p-8 flex flex-col justify-center min-h-[12rem]"
              style={{ borderColor: `var(${formats[activeFmt].color})`, background: 'var(--bg2)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `var(${formats[activeFmt].color})15`, color: `var(${formats[activeFmt].color})` }}
                >
                  {(() => { const Icon = formats[activeFmt].icon; return <Icon className="w-6 h-6" /> })()}
                </span>
                <span className="font-mono text-2xl font-bold text-[var(--tx)]">{formats[activeFmt].ext}</span>
              </div>
              <p className="text-[var(--tx)] text-base sm:text-lg leading-relaxed">{formats[activeFmt].detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service knowledge (SEO content) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--brd)]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
          >
            รู้ก่อนจ้างทำผังแบ่งแปลงที่ดิน
          </motion.h2>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-[var(--tx)] mb-2">ผังแบ่งแปลงที่ดิน กับ ผังจัดสรร ต่างกันอย่างไร</h3>
              <p className="text-sm text-[var(--tx2)] leading-relaxed mb-3">
                ผังแบ่งแปลงที่ดิน คือแบบวางตำแหน่ง ขนาด และหน้ากว้างของแต่ละแปลง พร้อมถนนภายในและมาตราส่วน
                เพื่อวางแผนแบ่งขายหรือพัฒนาที่ดิน ส่วนการจัดสรรที่ดินเป็นกระบวนการทางกฎหมายที่ต้องรังวัด
                และยื่นขออนุญาตกับหน่วยงานราชการ — ผังที่เราจัดทำเป็นแบบออกแบบและนำเสนอ ไม่ใช่เอกสารราชการ
              </p>
              <p className="text-sm text-[var(--tx2)] leading-relaxed">
                อ่านต่อ:{' '}
                <Link to="/articles/land-subdivision-vs-allocation" className="text-[var(--land)] hover:underline">แบ่งแปลงที่ดินกับจัดสรรที่ดินต่างกันอย่างไร</Link>
                {' · '}
                <Link to="/articles/land-subdivision-steps" className="text-[var(--land)] hover:underline">ขั้นตอนแบ่งแปลงที่ดิน</Link>
                {' · '}
                <Link to="/articles/land-allocation-license" className="text-[var(--land)] hover:underline">การขออนุญาตจัดสรรที่ดิน</Link>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold text-[var(--tx)] mb-2">บริการนี้เหมาะกับใคร</h3>
              <ul className="space-y-2">
                {[
                  'เจ้าของที่ดินที่ต้องการวางแผนแบ่งขายที่ดิน',
                  'ผู้เตรียมโครงการจัดสรรที่ดินก่อนยื่นขออนุญาต',
                  'ผู้ต้องการแบบผังไว้นำเสนอหุ้นส่วนหรือผู้ซื้อ',
                  'ผู้ต้องการไฟล์ CAD (.dwg) หรือ GIS (.shp) ไปทำงานต่อ',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-[var(--tx2)]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--acc)] shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="mt-8 rounded-2xl border border-[var(--brd)] bg-[var(--bg2)] p-6"
          >
            <h3 className="text-lg font-semibold text-[var(--tx)] mb-2">ราคาและขอบเขตงาน</h3>
            <p className="text-sm text-[var(--tx2)] leading-relaxed">
              ราคาออกแบบผังแบ่งแปลงที่ดินประเมินตามจำนวนแปลง ความซับซ้อนของผัง ข้อมูลตั้งต้น และรูปแบบไฟล์ที่ต้องการ
              จึงไม่มีราคาสำเร็จรูปที่ใช้ได้กับทุกงาน — ส่งรายละเอียดแปลงและความต้องการมาเพื่อประเมินราคาเป็นรายงานได้
              ขอบเขตงานครอบคลุมการออกแบบผังและส่งมอบไฟล์ .jpg .pdf .dwg .shp โดยไม่รวมการรังวัดที่ดินภาคสนาม
              และการยื่นขออนุญาตจัดสรรกับหน่วยงานราชการ
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
          >
            คำถามที่พบบ่อย
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="rounded-2xl border border-[var(--brd)] bg-[var(--bg)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-base font-semibold text-[var(--tx)]">{f.q}</span>
                    <span className="shrink-0 text-[var(--acc)]">
                      {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: open ? '16rem' : '0', opacity: open ? 1 : 0 }}
                  >
                    <p className="px-5 pb-5 text-sm text-[var(--tx)] leading-relaxed">{f.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center rounded-3xl border border-[var(--brd)] bg-[var(--bg2)] px-6 py-12 sm:px-10 sm:py-14"
        >
          <motion.div
            variants={scaleIn}
            className="inline-flex w-14 h-14 rounded-2xl bg-[var(--acc)]/12 items-center justify-center mb-5"
          >
            <ClipboardList className="w-7 h-7 text-[var(--acc)]" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold mb-3">
            พร้อมทำผังแบ่งแปลงของคุณแล้วหรือยัง
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[var(--tx2)] mb-8 max-w-xl mx-auto">
            ส่งไฟล์สแกนโฉนด เลขโฉนด หรือพิกัดหมุดมาก็เริ่มได้ ทักมาคุยรายละเอียดและประเมินงานผ่าน Facebook
          </motion.p>
          <motion.a
            variants={scaleIn}
            href={FB_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-lg font-semibold hover:bg-[var(--acc2)] transition-colors"
          >
            <FacebookIcon className="w-5 h-5" />
            ทักผ่าน Facebook — TNR GEOSERVICE
            <SendHorizontal className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--brd)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[var(--acc)]" />
            <span className="font-semibold">TNR MapHub</span>
            <span className="text-xs text-[var(--tx2)] hidden sm:inline">— รับทำผังแบ่งแปลงที่ดิน</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--tx2)]">
            <Link to="/" className="hover:text-[var(--acc)] transition-colors">หน้าหลัก</Link>
            <Link to="/articles" className="hover:text-[var(--acc)] transition-colors">บทความ</Link>
            <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--acc)] transition-colors">Facebook</a>
            <span>© {new Date().getFullYear()} TNR Geoservice</span>
          </div>
        </div>
      </footer>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto"
          onClick={() => setLightbox(null)}
          role="dialog" aria-modal="true" aria-labelledby="lb-title"
          onKeyDown={(e) => {
            // simple focus trap: keep Tab on the close button
            if (e.key === 'Tab') { e.preventDefault(); lbCloseRef.current?.focus() }
          }}
        >
          <button
            ref={lbCloseRef}
            type="button" onClick={() => setLightbox(null)} aria-label="ปิด"
            className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--bg2)] border border-[var(--brd)] flex items-center justify-center text-[var(--tx)] hover:bg-[var(--bg3)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <motion.div
            key={lightbox}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="max-w-5xl w-full my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={portfolio[lightbox].src} alt={portfolio[lightbox].title}
              width={portfolio[lightbox].w} height={portfolio[lightbox].h}
              decoding="async"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl bg-[var(--bg)]"
            />
            <div className="mt-3 text-center">
              <p id="lb-title" className="text-sm font-semibold text-[var(--tx)]">{portfolio[lightbox].title}</p>
              <p className="text-[13px] text-[var(--tx2)]">{portfolio[lightbox].meta}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
