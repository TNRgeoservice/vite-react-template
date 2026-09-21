// HeroSearch5.tsx — ค้นหาที่ดิน: จังหวัด + tag (multi) + ชิปด่วน → เปิดแผนที่จริงพร้อม query เดียวกับ HeroSearch เดิม
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Icon } from './Icon'
import { POPULAR_TAGS, PRESET_TAGS, suggestTags } from '../lib/tagTaxonomy'

const MAP_URL = 'https://map.tnrmaphub.com'

export const PROVINCES = [
  'กระบี่','กรุงเทพมหานคร','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา',
  'ชลบุรี','ชัยนาท','ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม',
  'นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์',
  'ปทุมธานี','ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พะเยา','พังงา','พัทลุง','พิจิตร',
  'พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา',
  'ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล',
  'สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี',
  'สุราษฎร์ธานี','สุรินทร์','หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์',
  'อุทัยธานี','อุบลราชธานี',
]

const QUICK_PROVINCES = ['เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'ขอนแก่น']

// ชิปราคา/ขนาด ไม่ใช่ tag → ส่งเป็น param แยก (เหมือน QuickFilterChips เดิม)
const RANGE_CHIPS = [
  { key: 'priceMax', label: 'ไม่เกิน 1 ล้าน', value: '1000000' },
  { key: 'areaMin', label: 'มากกว่า 5 ไร่', value: '2000' },
] as const
type RangeKey = (typeof RANGE_CHIPS)[number]['key']

export default function HeroSearch5() {
  const [province, setProvince] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [ranges, setRanges] = useState<Partial<Record<RangeKey, boolean>>>({})
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = useMemo(
    () => (q.trim() ? suggestTags(q, tags).slice(0, 6) : []),
    [q, tags],
  )

  function addTag(value: string) {
    if (tags.includes(value)) return
    setTags((p) => [...p, value])
    setQ('')
    inputRef.current?.focus()
  }
  const toggleTag = (t: string) => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !q && tags.length > 0) {
      setTags((p) => p.slice(0, -1))
    } else if (e.key === 'Enter' && q.trim()) {
      e.preventDefault()
      const t = q.trim()
      if (PRESET_TAGS.includes(t)) addTag(t)
      else if (suggestions.length > 0) addTag(suggestions[0])
      else addTag(t)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    let finalTags = tags
    if (q.trim() && !tags.includes(q.trim())) finalTags = [...tags, q.trim()]
    const sp = new URLSearchParams()
    if (finalTags.length > 0) {
      sp.set('tags', finalTags.join(','))
      sp.set('tagMode', 'and')
    }
    if (province) sp.set('province', province)
    for (const c of RANGE_CHIPS) if (ranges[c.key]) sp.set(c.key, c.value)
    const url = sp.toString() ? `${MAP_URL}/?${sp.toString()}` : MAP_URL
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <form className="search-card" onSubmit={onSubmit} id="land-search">
      <div className="search-heading"><Icon name="i-search" />ที่ดินที่ใช่ เริ่มจากทำเลที่ชอบ</div>
      <div className="search-fields">
        <div className="search-field">
          <label htmlFor="province">จังหวัด</label>
          <select id="province" value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">ทุกจังหวัด</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="search-field tag-field">
          <label htmlFor="query">ลักษณะที่ดิน</label>
          <div className="tag-box" onClick={() => inputRef.current?.focus()}>
            {tags.map((t) => (
              <span className="tag-pill" key={t}>
                {t}
                <button type="button" aria-label={`ลบ ${t}`} onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
              </span>
            ))}
            {RANGE_CHIPS.filter((c) => ranges[c.key]).map((c) => (
              <span className="tag-pill" key={c.key}>
                {c.label}
                <button type="button" aria-label={`ลบ ${c.label}`} onClick={() => setRanges((r) => ({ ...r, [c.key]: false }))}>×</button>
              </span>
            ))}
            <input
              id="query" ref={inputRef} type="text" value={q} autoComplete="off"
              onChange={(e) => { setQ(e.target.value); setOpen(true) }}
              onKeyDown={onKeyDown}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder={tags.length === 0 ? 'tag เช่น ติดถนนใหญ่ วิวภูเขา' : 'เพิ่มอีก...'}
            />
          </div>
          {open && suggestions.length > 0 && (
            <div className="suggest" role="listbox" aria-label="tag ที่แนะนำ">
              {suggestions.map((t) => (
                <button key={t} type="button" role="option" aria-selected="false" onMouseDown={(e) => e.preventDefault()} onClick={() => addTag(t)}>
                  <span>#{t}</span><em>Tag</em>
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-primary" type="submit"><Icon name="i-search" />ค้นหา</button>
      </div>
      <div className="chips" aria-label="จังหวัดค้นหาด่วน">
        <span className="quick-label">ลองค้นหา</span>
        {QUICK_PROVINCES.map((p) => (
          <button key={p} className="chip province-chip" type="button" aria-pressed={province === p} onClick={() => setProvince(province === p ? '' : p)}>{p}</button>
        ))}
      </div>
      <div className="chips" aria-label="ลักษณะที่ดินค้นหาด่วน" style={{ marginTop: -4 }}>
        {POPULAR_TAGS.map((t) => (
          <button key={t} className="chip" type="button" aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</button>
        ))}
        {RANGE_CHIPS.map((c) => (
          <button key={c.key} className="chip plain" type="button" aria-pressed={!!ranges[c.key]} onClick={() => setRanges((r) => ({ ...r, [c.key]: !r[c.key] }))}>{c.label}</button>
        ))}
      </div>
    </form>
  )
}
