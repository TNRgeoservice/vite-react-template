// gen-home-dark.mjs — สร้าง src/home/home.dark.css จากสีในธีมสว่าง (home.base.css + home.extra.css)
// รัน: node scripts/gen-home-dark.mjs   (แก้สีธีมสว่างแล้วรันใหม่ทุกครั้ง)
import fs from 'node:fs'

const SRC = ['src/home/home.base.css', 'src/home/home.extra.css']
const OUT = 'src/home/home.dark.css'
const DARK = '.v5[data-theme=dark]'

// ── สี ──
const hex2rgb = (h) => {
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).concat(h.length === 8 ? [h.slice(6, 8)] : [''])
}
const rgb2hsl = (r, g, b) => {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}
const hsl2hex = (h, s, l) => {
  const a = s * Math.min(l, 1 - l)
  const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)) }
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
}
// ความสว่างเดิม → ความสว่างใหม่ (พื้นสว่างกลายเป็นพื้นเข้ม / ตัวอักษรเข้มกลายเป็นตัวอักษรสว่าง)
const CURVE = [[1, 0.12], [0.96, 0.13], [0.9, 0.19], [0.8, 0.29], [0.6, 0.5], [0.4, 0.68], [0.2, 0.84], [0.07, 0.93], [0, 0.96]]
const curve = (l) => {
  for (let i = 0; i < CURVE.length - 1; i++) {
    const [l1, v1] = CURVE[i], [l2, v2] = CURVE[i + 1]
    if (l <= l1 && l >= l2) return v1 + ((l - l1) / (l2 - l1)) * (v2 - v1)
  }
  return 0.5
}
const FIXED = { ffffff: '111c2b', f6f8fb: '0d1520', fafbfc: '0e1826', f8faf9: '0e1826', f8fafc: '0e1826' } // พื้นหลักของหน้า/การ์ด/ช่องกรอก
function darken(hex) {
  const [r, g, b, a] = hex2rgb(hex)
  const base = [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
  if (FIXED[base]) return '#' + FIXED[base] + a
  const [h, s, l] = rgb2hsl(r, g, b)
  const neutral = s < 0.2
  // สีเน้น (เขียว/น้ำเงิน) ที่เข้มบนพื้นสว่าง → สว่างพอบนพื้นมืด แต่ไม่ซีดเป็นพาสเทล
  const accent = !neutral && s >= 0.45 && l >= 0.12 && l < 0.6
  const l2 = accent ? Math.min(curve(l), 0.6) : curve(l)
  const sat = neutral ? (l2 < 0.4 ? 0.32 : 0.25) : Math.min(s, l > 0.8 ? 0.24 : l2 > 0.6 ? 0.62 : l2 < 0.25 ? 0.4 : 0.55) // พื้นสีอ่อน (tint) → พื้นเข้มที่ไม่จัด
  return '#' + hsl2hex(neutral ? 213 : h, sat, l2) + a
}
const HEX = /#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g
const convert = (v) => v.replace(HEX, (_, h) => darken(h.toLowerCase())).replace(/\bwhite\b/g, darken('ffffff')).replace(/\bblack\b/g, '#eaf1f8')
// ส่วนที่ออกแบบเป็นแผงสีเข้มอยู่แล้ว (ตัวหนังสือขาวบนพื้นเขียวเข้ม/ป้ายดำ) — คงไว้ทั้งสองธีม
const KEEP = /final-cta|plot-card-badge|line-fab/
const SKIP = /^(box-shadow|text-shadow|filter|-webkit-tap-highlight-color)$/

// ── ตัวอ่าน CSS ──
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '')
function splitTop(s, sep) {
  const out = []; let depth = 0, cur = '', q = ''
  for (const ch of s) {
    if (q) { if (ch === q) q = ''; cur += ch; continue }
    if (ch === '"' || ch === "'") q = ch
    if ('([' .includes(ch)) depth++
    if (')]'.includes(ch)) depth--
    if (ch === sep && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  out.push(cur); return out
}
const darkSel = (sel) => {
  sel = sel.trim()
  if (sel.startsWith('.v5.js')) return DARK + sel.slice(3) // .v5.js X → .v5[data-theme=dark].js X
  return sel.startsWith('.v5') ? DARK + sel.slice(3) : null
}
function walk(block) {
  let out = '', i = 0
  while (i < block.length) {
    const j = block.indexOf('{', i)
    if (j < 0) break
    let d = 1, k = j + 1
    while (d && k < block.length) { if (block[k] === '{') d++; else if (block[k] === '}') d--; k++ }
    const head = block.slice(i, j).trim(), body = block.slice(j + 1, k - 1)
    i = k
    if (head.startsWith('@media') || head.startsWith('@container')) {
      const inner = walk(body)
      if (inner) out += `${head}{${inner}}`
      continue
    }
    if (head.startsWith('@')) continue
    const decls = splitTop(body, ';').map((x) => x.trim()).filter(Boolean).flatMap((x) => {
      const c = x.indexOf(':'); if (c < 0) return []
      const prop = x.slice(0, c).trim(), val = x.slice(c + 1).trim()
      if (SKIP.test(prop)) return []
      const nv = convert(val)
      return nv !== val ? [`${prop}:${nv}`] : []
    })
    if (!decls.length) continue
    if (KEEP.test(head)) continue
    const sels = splitTop(head, ',').map(darkSel).filter(Boolean)
    if (sels.length) out += `${sels.join(',')}{${decls.join(';')}}\n`
  }
  return out
}

let css = `/* home.dark.css — สร้างอัตโนมัติจาก scripts/gen-home-dark.mjs (อย่าแก้มือ) */\n${DARK}{color-scheme:dark}\n`
for (const f of SRC) css += walk(strip(fs.readFileSync(f, 'utf8')).replace(/\s*\n\s*/g, ' '))
// วงกลม/ภาพ SVG ตกแต่ง: พลิกสีให้เข้ากับธีมมืด
css += `${DARK} .feature-visual>svg,${DARK} .geo-symbol svg{filter:invert(.9) hue-rotate(180deg)}\n`
css += `${DARK} .plot-card-img img{filter:brightness(.92)}\n`
fs.writeFileSync(OUT, css)
console.log('wrote', OUT, css.length, 'bytes')
