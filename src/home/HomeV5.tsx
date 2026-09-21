// HomeV5.tsx — หน้าแรกดีไซน์ "Daylight Precision" (โทนสว่าง) — ใช้เนื้อหา/ลิงก์/พารามิเตอร์ค้นหาของเว็บจริง
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Sprite } from './Icon'
import HeroSearch5 from './HeroSearch5'
import HeroMap from './HeroMap'
import Featured5 from './Featured5'
import Tools from './Tools'
import LatestArticles from './LatestArticles'
import { FEATURE_DISCOVER, GEO_SYMBOL } from './svgArt'
import './home.base.css'
import './home.extra.css'
import './home.dark.css'
import './home.map.css'

const MAP_URL = 'https://map.tnrmaphub.com'
const FB_URL = 'https://www.facebook.com/TNRGEOSERVICE'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Inter:wght@400;500;600;650;700;800&family=Mitr:wght@400;500&display=swap'

const NAV = [
  { to: '/articles', label: 'บทความ' },
  { to: '/subdivisionplan', label: 'ทำผังแบ่งแปลง' },
  { to: '/tnrpdfstudio', label: 'PDF Studio', badge: 'ฟรี' },
  { href: '#tools', label: 'เครื่องมือคำนวณ' },
  { href: '#sellers', label: 'ลงประกาศฟรี' },
  { href: '#about', label: 'เกี่ยวกับ' },
] as const

const HOT_PROVINCES = [
  'กรุงเทพมหานคร', 'เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'ขอนแก่น', 'นครราชสีมา',
  'ระยอง', 'สุราษฎร์ธานี', 'อุดรธานี', 'เชียงราย', 'สงขลา', 'ประจวบคีรีขันธ์',
]

const CHECKLIST = [
  ['ตรวจเอกสารสิทธิ์', 'ขอดูโฉนดตัวจริง เทียบชื่อเจ้าของกับบัตรประชาชน หรือหนังสือมอบอำนาจที่ถูกต้อง'],
  ['เทียบตำแหน่งกับแผนที่', 'ดูรูปแปลงและพิกัดบนแผนที่ แล้วไปดูหน้างานจริง — ระยะและเนื้อที่บนแผนที่ใช้ดูคร่าวๆ เท่านั้น'],
  ['เช็กผังเมือง', 'ตรวจสีผังเมืองและข้อกำหนดการใช้ประโยชน์ที่ดินว่าทำสิ่งที่ตั้งใจได้หรือไม่'],
  ['ตรวจทางเข้าออก', 'แปลงติดถนนสาธารณะหรือมีทางเข้าออกที่จดทะเบียนไว้ ไม่ใช่แค่ทางที่เจ้าของอนุญาตปากเปล่า'],
  ['ตรวจภาระผูกพัน', 'สอบถามสำนักงานที่ดินว่ามีจำนอง ภาระจำยอม หรือข้อห้ามโอนหรือไม่'],
  ['ทำสัญญาที่สำนักงานที่ดิน', 'นัดโอนกรรมสิทธิ์ต่อหน้าเจ้าหน้าที่ที่สำนักงานที่ดิน และเก็บหลักฐานการชำระเงินทุกครั้ง'],
] as const

const WARNINGS = [
  'อย่าโอนเงินมัดจำก่อนได้พบเจ้าของและตรวจโฉนดด้วยตัวเอง',
  'ระวังราคาต่ำผิดปกติ หรือถูกเร่งให้ตัดสินใจโดยไม่ให้ไปดูที่ดิน',
  'อย่าส่งรูปบัตรประชาชน รหัส OTP หรือข้อมูลบัญชีให้ผู้ที่ยังไม่รู้จัก',
  'TNR MapHub เป็นแพลตฟอร์มแสดงประกาศ ไม่ได้รับชำระเงินแทนผู้ซื้อหรือผู้ขาย',
]

// a = ข้อความล้วน (ใช้ทั้งบนหน้าและใน FAQPage JSON-LD) · link = ลิงก์ต่อท้ายคำตอบ (ถ้ามี)
const FAQ: { q: string; a: string; link?: { href: string; label: string } }[] = [
  { q: 'ลงประกาศขายที่ดินฟรีจริงไหม?', a: 'ลงประกาศขายที่ดินได้ฟรี ไม่จำกัดจำนวนแปลง และไม่มีค่าธรรมเนียมการลงประกาศ เจ้าของที่ดินสามารถเพิ่มรายละเอียดและติดต่อผู้ซื้อผ่านระบบได้โดยตรง' },
  { q: 'TNR MapHub เป็นนายหน้าหรือเปล่า?', a: 'TNR MapHub เป็นแพลตฟอร์มให้เจ้าของที่ดินลงประกาศและผู้ซื้อค้นหาบนแผนที่ เจ้าของและผู้ซื้อพูดคุย นัดดูที่ดิน และตกลงซื้อขายกันโดยตรง ไม่ผ่านนายหน้า' },
  { q: 'บนแผนที่ดูข้อมูลอะไรได้บ้าง?', a: 'ค้นหาพิกัด รูปแปลง ขนาด และรายละเอียดประกาศ พร้อมชั้นข้อมูลผังเมือง แปลงที่ดิน พื้นที่ป่า และสถานที่ใกล้เคียงตามข้อมูลที่มี เพื่อประกอบการเปรียบเทียบทำเลและราคา ควรตรวจสอบรายละเอียดของแปลงและเอกสารที่เกี่ยวข้องก่อนตัดสินใจ' },
  { q: 'จะติดต่อเจ้าของที่ดินได้อย่างไร?', a: 'เปิดแผนที่ เลือกประกาศที่สนใจ แล้วเข้าสู่ระบบเพื่อใช้แชทพูดคุยกับเจ้าของที่ดินโดยตรง สอบถามข้อมูลเพิ่มเติมและนัดหมายดูที่ดินกันได้' },
  { q: 'ต้องเข้าสู่ระบบก่อนไหม?', a: 'ค้นหาและดูที่ดินบนแผนที่ได้โดยไม่ต้องเข้าสู่ระบบ ต้องเข้าสู่ระบบเมื่อต้องการแชทกับเจ้าของ ลงประกาศ หรือดาวน์โหลดไฟล์ข้อมูลแปลง (.gpkg)' },
  { q: 'ระยะและเนื้อที่บนแผนที่เชื่อถือได้แค่ไหน?', a: 'ระยะรอบแปลงและเนื้อที่ที่แสดงบนแผนที่ใช้ดูคร่าวๆ เท่านั้น ไม่ใช่การรังวัดและใช้อ้างอิงทางกฎหมายไม่ได้ ตัวเลขที่ถูกต้องให้ดูจากโฉนดหรือขอรังวัดที่สำนักงานที่ดิน' },
  { q: 'ค่าใช้จ่ายตอนโอนที่ดินมีอะไรบ้าง?', a: 'หลักๆ คือค่าธรรมเนียมโอน 2% ภาษีธุรกิจเฉพาะ 3.3% (หรืออากรแสตมป์ 0.5% กรณีได้รับยกเว้น) และภาษีเงินได้หัก ณ ที่จ่าย ลองประมาณการได้ที่', link: { href: '#tools', label: 'เครื่องมือคำนวณค่าโอน' } },
  { q: '1 ไร่ เท่ากับกี่งาน กี่ตารางวา?', a: '1 ไร่ = 4 งาน = 400 ตารางวา = 1,600 ตารางเมตร (1 ตารางวา = 4 ตารางเมตร) แปลงหน่วยได้ทันทีที่', link: { href: '#tools', label: 'เครื่องมือแปลงหน่วยที่ดิน' } },
]

type Theme = 'light' | 'dark'
const THEME_KEY = 'tnr-home-theme'
const THEME_BG: Record<Theme, string> = { light: '#f6f8fb', dark: '#0d1520' }

// ธีมเริ่มต้น: ตามที่ผู้ใช้เลือกไว้ ถ้ายังไม่เคยเลือกให้ตามค่าของอุปกรณ์
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* ใช้ค่าอุปกรณ์แทน */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function HomeV5() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const rootRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDetailsElement>(null)

  // ฟอนต์ + scroll ของหน้าแรก (คืนค่าเมื่อออกจากหน้า)
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[data-home-fonts]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = FONTS_HREF
      link.dataset.homeFonts = ''
      document.head.appendChild(link)
    }
    const html = document.documentElement
    const prev = { sb: html.style.scrollBehavior, sp: html.style.scrollPaddingTop }
    html.style.scrollBehavior = 'smooth'
    html.style.scrollPaddingTop = '100px'
    return () => {
      html.style.scrollBehavior = prev.sb
      html.style.scrollPaddingTop = prev.sp
    }
  }, [])

  // สีพื้นหลังหน้า + theme-color ตามธีม (คืนค่าเมื่อออกจากหน้า)
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const prev = { bg: document.body.style.background, tc: meta?.content }
    document.body.style.background = THEME_BG[theme]
    if (meta) meta.content = THEME_BG[theme]
    return () => {
      document.body.style.background = prev.bg
      if (meta && prev.tc !== undefined) meta.content = prev.tc
    }
  }, [theme])

  // FAQPage JSON-LD (Google อ่านหลังรัน JS) — เอาออกเมื่อออกจากหน้าแรก ไม่ให้ค้างในหน้าอื่น
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.homeFaq = ''
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.link ? `${f.a} ${f.link.label}` : f.a },
      })),
    })
    document.head.appendChild(el)
    return () => { el.remove() }
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* ignore */ }
  }

  // reveal-on-scroll (รวม element ที่โผล่มาทีหลัง เช่น ที่ดินแนะนำที่โหลดจาก API)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || reduced) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.08 },
    )
    const seen = new WeakSet<Element>()
    const scan = () => root.querySelectorAll('.reveal').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el) } })
    scan()
    root.classList.add('js')
    const mo = new MutationObserver(scan)
    mo.observe(root, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect(); root.classList.remove('js') }
  }, [])

  // แถบ progress การเลื่อน + ปิดเมนูมือถือเมื่อกด Esc / คลิกนอกเมนู
  useEffect(() => {
    let queued = false
    const update = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${d > 0 ? Math.min(1, Math.max(0, window.scrollY / d)) : 0})`
      queued = false
    }
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update) } }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuRef.current?.open) { menuRef.current.open = false; menuRef.current.querySelector('summary')?.focus() }
    }
    const onClick = (e: MouseEvent) => {
      if (menuRef.current?.open && !menuRef.current.contains(e.target as Node)) menuRef.current.open = false
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const closeMenu = () => { if (menuRef.current) menuRef.current.open = false }

  const navLink = (n: (typeof NAV)[number], mobile = false) => {
    const inner = (
      <>
        {n.label === 'PDF Studio' ? <span className="latin">PDF Studio</span> : n.label}
        {'badge' in n && <span className="new">{n.badge}</span>}
      </>
    )
    return 'to' in n
      ? <Link key={n.label} to={n.to} onClick={mobile ? closeMenu : undefined}>{inner}</Link>
      : <a key={n.label} href={n.href} onClick={mobile ? closeMenu : undefined}>{inner}</a>
  }

  return (
    <div className="v5" ref={rootRef} data-theme={theme}>
      <Sprite />
      <a className="skip" href="#main">ข้ามไปยังเนื้อหา</a>

      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" to="/" aria-label="TNR MapHub หน้าแรก">
            <span className="brand-mark"><Icon name="i-map" /></span>
            <span className="brand-name">TNR <span>MapHub</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="เมนูหลัก">{NAV.map((n) => navLink(n))}</nav>
          <div className="header-actions">
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'} title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
              <Icon name={theme === 'dark' ? 'i-sun' : 'i-moon'} />
            </button>
            <a className="btn login" href={`${MAP_URL}/?login=1`}>เข้าสู่ระบบ</a>
            <a className="btn btn-primary" href={MAP_URL}>เปิดแผนที่ <Icon name="i-arrow" /></a>
          </div>
          <details className="mobile-menu" ref={menuRef}>
            <summary aria-label="เปิดเมนูหลัก"><Icon name="i-menu" /></summary>
            <nav aria-label="เมนูมือถือ">
              {NAV.map((n) => navLink(n, true))}
              <a href={`${MAP_URL}/?login=1`}>เข้าสู่ระบบ</a>
            </nav>
          </details>
        </div>
        <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="status-dot" />โดย TNR Geoservice — ผู้เชี่ยวชาญด้าน GIS</div>
              <h1 id="hero-title">
                <span className="intro">ศูนย์รวม</span>
                <em>ฝากขายที่ดิน</em>
                <span className="last">ลงประกาศฟรี<br />ค้นหาด้วยแผนที่ <span className="latin">GIS</span></span>
              </h1>
              <p className="hero-description">แพลตฟอร์มซื้อขายที่ดินออนไลน์ ลงประกาศขายที่ดินฟรี เจ้าของขายเอง ค้นหาที่ดินทำเลดีผ่านระบบแผนที่ — ดูพิกัด ผังเมือง โฉนด และเปรียบเทียบราคาได้ในที่เดียว</p>
              <HeroSearch5 />
              <div className="hero-ctas">
                <a className="link" href={MAP_URL}>ค้นหาที่ดินจากแผนที่ <Icon name="i-arrow" /></a>
                <a className="link" href="#sellers">ลงประกาศฟรี <Icon name="i-plus" /></a>
              </div>
              <div className="hero-highlights">
                {['แผนที่ GIS แม่นยำ', 'ฟรี ลงประกาศ', 'ไม่มีนายหน้า', 'เจ้าของขายเอง'].map((t) => (
                  <span key={t}><Icon name="i-check" />{t}</span>
                ))}
              </div>
            </div>
            <HeroMap />
          </div>
          <div className="wrap hero-bottom">
            <p>มองเห็นที่ดิน เข้าใจทุกทำเล <span className="label">&nbsp; / &nbsp; LAND. DATA. CLARITY.</span></p>
            <a href="#features">รู้จัก MapHub <Icon name="i-chevron" /></a>
          </div>
        </section>

        <div className="capabilities">
          <div className="wrap capability-grid">
            {[
              ['i-target', 'GIS แม่นยำ', 'มองเห็นพิกัดจริงของทุกแปลง'],
              ['i-layers', 'ชั้นข้อมูลภาครัฐ', 'ผังเมือง แปลงที่ดิน พื้นที่ป่า'],
              ['i-sliders', 'วัดระยะรอบแปลง', 'ดูระยะและเนื้อที่ ไร่-งาน-วา'],
              ['i-chat', 'แชทตรงกับเจ้าของ', 'ให้ทุกการพูดคุยใกล้กันกว่าเดิม'],
            ].map(([ic, t, s]) => (
              <div className="capability" key={t}>
                <Icon name={ic} />
                <div><strong>{t}</strong><small>{s}</small></div>
              </div>
            ))}
          </div>
        </div>

        <section className="section" id="features" aria-labelledby="features-title">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <div className="eyebrow">ทุกมุมของที่ดิน อยู่ในมุมมองเดียว</div>
                <h2 id="features-title">ทำไมต้อง <span className="latin">TNR MapHub</span></h2>
              </div>
              <p>ครบทุกเครื่องมือในการซื้อขายที่ดิน — ตั้งแต่ค้นหา วิเคราะห์ทำเล จนถึงปิดดีล</p>
            </div>
            <div className="features-grid">
              <article className="feature-card reveal">
                <div className="feature-number"><span className="label">01 / DISCOVER</span><Icon name="i-map" /></div>
                <div className="feature-visual" aria-hidden="true" dangerouslySetInnerHTML={{ __html: FEATURE_DISCOVER }} />
                <h3>ค้นหาที่ดินจากแผนที่</h3>
                <p>ดูที่ดินขายทั่วไทยบนแผนที่ GIS แม่นยำ — เห็นพิกัดจริง รูปแปลง ขนาด ติดถนนเส้นไหน</p>
                <ul className="check-list">
                  {['ดูพิกัด GPS ทุกแปลง', 'ซ้อนชั้นผังเมือง/พื้นที่ป่า', 'กรองตามจังหวัด/ราคา/ขนาด'].map((t) => <li key={t}><Icon name="i-check" />{t}</li>)}
                </ul>
              </article>
              <article className="feature-card reveal">
                <div className="feature-number"><span className="label">02 / CONNECT</span><Icon name="i-chat" /></div>
                <div className="feature-visual">
                  <div className="mini-listing">
                    <div className="mini-listing-top">
                      <span className="mini-listing-avatar"><Icon name="i-user" /></span>
                      <div><strong>ประกาศของคุณ</strong><small>เจ้าของขายเอง · ตัวอย่าง</small></div>
                    </div>
                    <div className="mini-listing-bottom"><span>ค่าลงประกาศ</span><b>฿0</b></div>
                  </div>
                  <div className="sent-badge"><Icon name="i-check" />พร้อมให้ผู้ซื้อค้นพบ</div>
                </div>
                <h3>ลงประกาศขายฟรี</h3>
                <p>เจ้าของที่ดินลงประกาศได้ฟรี ไม่มีค่าธรรมเนียม ไม่ผ่านนายหน้า — ติดต่อผู้ซื้อโดยตรง</p>
                <ul className="check-list">
                  {['ลงประกาศฟรีไม่จำกัด', 'แชทคุยกับผู้ซื้อโดยตรง', 'แชร์ FB/LINE เพิ่ม reach'].map((t) => <li key={t}><Icon name="i-check" />{t}</li>)}
                </ul>
              </article>
              <article className="feature-card reveal">
                <div className="feature-number"><span className="label">03 / DECIDE</span><Icon name="i-chart" /></div>
                <div className="feature-visual">
                  <div className="mini-compare">
                    <div className="mini-compare-head"><strong>เปรียบเทียบราคา / ตร.วา</strong><small>ตัวอย่าง</small></div>
                    {[['แปลง B', 88, '฿6,000', false], ['แปลง A', 73, '฿5,000', true], ['แปลง C', 62, '฿4,250', false]].map(([l, w, p, a]) => (
                      <div className={'comparison-row' + (a ? ' active' : '')} key={l as string}>
                        <span>{l}</span><span className="bar"><i style={{ width: `${w}%` }} /></span><span className="latin">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <h3>ข้อมูลเชิงลึก ตัดสินใจแม่นยำ</h3>
                <p>มากกว่าเว็บประกาศทั่วไป — ดูโฉนด ผังเมือง ราคาเปรียบเทียบรอบพื้นที่ ก่อนตัดสินใจซื้อขาย</p>
                <ul className="check-list">
                  {['เปรียบเทียบราคา/ตร.วา', 'ข้อมูลโฉนด เอกสารสิทธิ์', 'แลนด์มาร์ก สิ่งใกล้เคียง'].map((t) => <li key={t}><Icon name="i-check" />{t}</li>)}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <Featured5 />

        <Tools />

        <section className="seller-section" id="sellers" aria-labelledby="sellers-title">
          <div className="wrap">
            <div className="seller-box reveal">
              <div className="seller-copy">
                <div className="eyebrow">สำหรับเจ้าของที่ดิน</div>
                <h2 id="sellers-title">ฝากขายที่ดินกับเรา<br /><span>ฟรี ไม่มีนายหน้า</span></h2>
                <p>ลงประกาศขายที่ดินได้ไม่จำกัด ไม่มีค่าธรรมเนียม คุยกับผู้ซื้อโดยตรงผ่านระบบแชท — เหมาะสำหรับเจ้าของที่ดินที่อยากขายเองโดยไม่ผ่านนายหน้า</p>
                <ul className="check-list">
                  {['ลงประกาศขายที่ดินฟรี ไม่จำกัดจำนวนแปลง', 'ติดต่อผู้ซื้อโดยตรง ไม่ผ่านนายหน้า', 'แชร์ Facebook / LINE ขยายการเข้าถึง', 'แสดงบนแผนที่ — ผู้ซื้อหาเจอง่ายกว่า'].map((t) => <li key={t}><Icon name="i-check" />{t}</li>)}
                </ul>
                <a className="btn btn-primary" href={MAP_URL}>เริ่มลงประกาศฟรี <Icon name="i-arrow" /></a>
              </div>
              <div className="seller-art">
                <div className="free-card">
                  <div className="free-card-top"><span>TNR MapHub</span><Icon name="i-map" /></div>
                  <div className="free-word">ฟรี</div>
                  <p>ลงประกาศขายที่ดิน</p>
                  <div className="free-card-foot">ไม่จำกัดจำนวน · ไม่มีค่าธรรมเนียม</div>
                  <div className="free-stamp"><Icon name="i-check" />เจ้าของขายเอง</div>
                </div>
                <span className="seller-art-label">YOUR LAND. YOUR OPPORTUNITY.</span>
              </div>
            </div>
            <div className="steps" aria-label="เริ่มขายใน 3 ขั้นตอน">
              {[['01', 'เพิ่มรายละเอียดที่ดิน', 'เล่าเรื่องแปลงของคุณ พร้อมรูปและราคาขาย'], ['02', 'ระบุตำแหน่งบนแผนที่', 'ช่วยให้ผู้ซื้อเห็นที่ดินในบริบทของทำเลจริง'], ['03', 'คุยกับผู้ซื้อโดยตรง', 'ตอบคำถาม นัดดูที่ดิน และตกลงกันได้เอง']].map(([n, t, d]) => (
                <div className="step reveal" key={n}><span className="step-number">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section provinces-section" id="provinces" aria-labelledby="provinces-title">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <div className="eyebrow">ค้นหาตามทำเล</div>
                <h2 id="provinces-title">จังหวัดยอดนิยม</h2>
              </div>
              <p>เลือกจังหวัดแล้วเปิดแผนที่ดูแปลงที่ลงประกาศในพื้นที่นั้นได้ทันที</p>
            </div>
            <div className="province-grid reveal">
              {HOT_PROVINCES.map((p) => (
                <a key={p} href={`${MAP_URL}/?province=${encodeURIComponent(p)}`} target="_blank" rel="noopener noreferrer"><Icon name="i-pin" />{p}</a>
              ))}
              <a className="all" href={MAP_URL} target="_blank" rel="noopener noreferrer">ทุกจังหวัดบนแผนที่ <Icon name="i-arrow" /></a>
            </div>
          </div>
        </section>

        <section className="trust-section" id="safety" aria-labelledby="safety-title">
          <div className="wrap trust-grid">
            <div className="reveal">
              <div className="eyebrow">ซื้อที่ดินอย่างมั่นใจ</div>
              <h2 id="safety-title">6 สิ่งที่ควรตรวจก่อนซื้อที่ดิน</h2>
              <ol className="checklist">
                {CHECKLIST.map(([t, d], i) => (
                  <li key={t}><span className="step-number">{String(i + 1).padStart(2, '0')}</span><div><strong>{t}</strong><p>{d}</p></div></li>
                ))}
              </ol>
            </div>
            <aside className="warning-card reveal" aria-labelledby="warn-title">
              <div className="warning-head"><Icon name="i-info" /><h3 id="warn-title">ข้อควรระวัง</h3></div>
              <ul>{WARNINGS.map((w) => <li key={w}><Icon name="i-check" />{w}</li>)}</ul>
            </aside>
          </div>
        </section>

        <LatestArticles />

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="wrap about-grid reveal">
            <div className="about-identity">
              <div className="geo-symbol" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GEO_SYMBOL }} />
              <div>
                <div className="eyebrow">BUILT ON SPATIAL EXPERTISE</div>
                <h2 id="about-title">เกี่ยวกับ<br /><span className="latin">TNR Geoservice</span></h2>
                <small>ความเชี่ยวชาญที่อยู่เบื้องหลังทุกพิกัด</small>
              </div>
            </div>
            <div className="about-copy">
              <p>เราคือผู้เชี่ยวชาญด้านการวางผังที่ดินดิจิทัลและการวิเคราะห์ข้อมูลเชิงพื้นที่ (GIS) พัฒนาแพลตฟอร์ม TNR MapHub เพื่อให้การซื้อขายที่ดินในไทยโปร่งใส แม่นยำ และเข้าถึงง่ายกว่าที่เคย</p>
              <div className="about-note"><Icon name="i-info" /><span>หมายเหตุ: บริการของเราเน้นการออกแบบผังและวิเคราะห์ข้อมูลเชิงพื้นที่ ไม่รวมการรังวัดที่ดินภาคสนาม</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="wrap faq-grid">
            <div className="faq-intro reveal">
              <div className="eyebrow">ก่อนเริ่มต้น</div>
              <h2 id="faq-title">คำถามที่พบบ่อย</h2>
              <p>รู้จัก MapHub อีกนิด<br />ก่อนค้นพบที่ดินแปลงถัดไปของคุณ</p>
            </div>
            <div className="faq-list reveal">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}<Icon name="i-plus" /></summary>
                  <p>{f.a}{f.link && <> <a href={f.link.href} className="link inline">{f.link.label}</a></>}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-section" aria-labelledby="final-title">
          <div className="wrap">
            <div className="final-cta reveal">
              <div>
                <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
                <h2 id="final-title">พร้อมเริ่มต้นซื้อขายที่ดินแล้วหรือยัง?</h2>
                <p>เปิดแผนที่ค้นหาที่ดินทำเลดี หรือลงประกาศขายของคุณเองได้ฟรีในไม่กี่คลิก</p>
              </div>
              <a className="btn" href={MAP_URL}>เปิดแผนที่ TNR MapHub <Icon name="i-arrow" /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-main">
            <Link className="brand" to="/" aria-label="TNR MapHub กลับด้านบน">
              <span className="brand-mark"><Icon name="i-map" /></span>
              <span className="brand-name">TNR <span>MapHub</span></span>
            </Link>
            <nav className="footer-links" aria-label="ลิงก์ท้ายหน้า">
              <Link to="/articles">บทความ</Link>
              <Link to="/subdivisionplan">ทำผังแบ่งแปลง</Link>
              <Link to="/tnrpdfstudio">PDF Studio</Link>
              <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="TNR Geoservice บน Facebook">Facebook <Icon name="i-external" /></a>
              <a href={MAP_URL}>เปิดแผนที่ <Icon name="i-arrow" /></a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} TNR Geoservice</span>
            <span><Icon name="i-target" />DESIGNED AROUND LAND. BUILT AROUND YOU.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
