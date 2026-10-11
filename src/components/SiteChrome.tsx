// SiteChrome.tsx — header/footer/ธีม ชุดเดียวกับหน้าแรก (.v5) สำหรับหน้าย่อย (/tnrpdfstudio, /subdivisionplan)
// ต้องอยู่ใต้ element ที่มี className "v5" + data-theme (และ mount <Sprite/> ไว้ในหน้านั้น)
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../home/Icon'
import { MapHubWordmark } from './ui/MapHubWordmark'
import '../home/home.base.css'
import '../home/home.extra.css'
import '../home/home.dark.css'
import './SiteChrome.css'

export const MAP_URL = 'https://map.tnrmaphub.com'
export const FB_URL = 'https://www.facebook.com/TNRGEOSERVICE'
export const LINE_URL = 'https://line.me/ti/p/jkBzxcJVV0'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600&family=Inter:wght@400;500;600;650;700;800&family=Mitr:wght@400;500&display=swap'

// ธีมใช้ key เดียวกับหน้าแรก (HomeV5) ให้สลับที่ไหนก็ตามกัน
export type Theme = 'light' | 'dark'
const THEME_KEY = 'tnr-home-theme'
const THEME_BG: Record<Theme, string> = { light: '#f6f8fb', dark: '#0d1520' }
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* ใช้ค่าอุปกรณ์แทน */ }
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// ธีม + ฟอนต์ + สีพื้นหลัง body/theme-color (คืนค่าเมื่อออกจากหน้า)
export function useSiteTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    if (document.querySelector('link[data-home-fonts]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    link.dataset.homeFonts = ''
    document.head.appendChild(link)
  }, [])

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

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* ignore */ }
  }
  return { theme, toggleTheme }
}

const NAV = [
  { to: '/articles', label: 'บทความ' },
  { to: '/subdivisionplan', label: 'ทำผังแบ่งแปลง' },
  { to: '/tnrpdfstudio', label: 'Bailan', badge: 'ฟรี' },
  { href: '/#tools', label: 'เครื่องมือคำนวณ' },
  { href: '/#sellers', label: 'ลงประกาศฟรี' },
] as const

export function SiteHeader({ theme, onToggleTheme, active, cta }: {
  theme: Theme; onToggleTheme: () => void; active: string; cta: ReactNode
}) {
  const navLink = (n: (typeof NAV)[number]) => {
    const inner = (
      <>
        {n.label === 'Bailan' ? <span className="latin">Bailan</span> : n.label}
        {'badge' in n && <span className="new">{n.badge}</span>}
      </>
    )
    return 'to' in n
      ? <Link key={n.label} to={n.to} className={n.to === active ? 'active' : undefined}>{inner}</Link>
      : <a key={n.label} href={n.href}>{inner}</a>
  }
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="brand" to="/" aria-label="TNR MapHub หน้าแรก">
          <MapHubWordmark className="brand-logo" />
        </Link>
        <nav className="desktop-nav" aria-label="เมนูหลัก">{NAV.map(navLink)}</nav>
        <div className="header-actions">
          <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-pressed={theme === 'dark'}
                  aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'} title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
            <Icon name={theme === 'dark' ? 'i-sun' : 'i-moon'} />
          </button>
          {cta}
        </div>
        <details className="mobile-menu">
          <summary aria-label="เปิดเมนูหลัก"><Icon name="i-menu" /></summary>
          <nav aria-label="เมนูมือถือ">
            {NAV.map(navLink)}
            <a href={MAP_URL}>เปิดแผนที่</a>
          </nav>
        </details>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <Link className="brand" to="/" aria-label="TNR MapHub หน้าแรก">
            <MapHubWordmark className="brand-logo" />
          </Link>
          <nav className="footer-links" aria-label="ลิงก์ท้ายหน้า">
            <Link to="/articles">บทความ</Link>
            <Link to="/subdivisionplan">ทำผังแบ่งแปลง</Link>
            <Link to="/tnrpdfstudio">Bailan</Link>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อ TNR Geoservice ทาง LINE">LINE <Icon name="i-external" /></a>
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
  )
}

export function LineFab() {
  return (
    <a className="line-fab" href={LINE_URL} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อ TNR Geoservice ทาง LINE">
      <Icon name="i-chat" /><span>LINE</span>
    </a>
  )
}
