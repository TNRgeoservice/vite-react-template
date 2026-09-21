// Icon.tsx — ไอคอนจาก SVG sprite (<Sprite/> ต้อง mount ครั้งเดียวใน HomeV5)
import { SPRITE } from './svgArt'

// ไอคอนเพิ่มเติม (สลับธีม)
const EXTRA =
  '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute"><defs>' +
  '<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>' +
  '<symbol id="i-moon" viewBox="0 0 24 24"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z"/></symbol>' +
  '</defs></svg>'

export function Sprite() {
  return <div aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: SPRITE + EXTRA }} />
}

export function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true"><use href={`#${name}`} /></svg>
  )
}
