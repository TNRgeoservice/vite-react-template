// HeroSearch.tsx — ช่องค้นหา: dropdown จังหวัด (แยกช่อง) + ช่องค้นหา tag (multi-select)
import { useState, useMemo, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, MapPin, Tag as TagIcon, X, ChevronDown } from 'lucide-react'
import { PRESET_TAGS, suggestTags } from '../lib/tagTaxonomy'

const MAP_URL = 'https://map.tnrmaphub.com'

// 77 จังหวัด (เรียงตามตัวอักษร) — ใช้ใน dropdown แยกช่อง
const PROVINCES = [
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

export default function HeroSearch() {
  const [province, setProvince] = useState('')
  const [q, setQ] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedTagSet = useMemo(() => new Set(tags), [tags])

  // suggestions = tag เท่านั้น (จังหวัดย้ายไป dropdown แล้ว)
  const suggestions = useMemo<string[]>(() => {
    const trimmed = q.trim()
    if (!trimmed) return []
    return suggestTags(q, Array.from(selectedTagSet)).slice(0, 6)
  }, [q, selectedTagSet])

  function addTag(value: string) {
    if (selectedTagSet.has(value)) return
    setTags((prev) => [...prev, value])
    setQ('')
    inputRef.current?.focus()
  }

  function removeAt(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !q && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    } else if (e.key === 'Enter' && q.trim()) {
      e.preventDefault()
      const trimmed = q.trim()
      // match preset → add ทันที, ไม่งั้นใช้ suggestion ตัวแรก, ไม่งั้น free-form tag
      if (PRESET_TAGS.includes(trimmed)) addTag(trimmed)
      else if (suggestions.length > 0) addTag(suggestions[0])
      else addTag(trimmed)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    // ถ้ามี input ค้างใน q → เพิ่มเป็น tag ก่อน submit
    let finalTags = tags
    if (q.trim() && !selectedTagSet.has(q.trim())) {
      finalTags = [...finalTags, q.trim()]
    }

    const sp = new URLSearchParams()
    if (finalTags.length > 0) {
      sp.set('tags', finalTags.join(','))
      sp.set('tagMode', 'and') // เลือกหลาย tag = ต้องมีครบทุก tag
    }
    if (province) sp.set('province', province) // ส่งจังหวัดเฉพาะเมื่อเลือกจาก dropdown
    const url = sp.toString() ? `${MAP_URL}/?${sp.toString()}` : MAP_URL
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="relative w-full max-w-xl"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Province dropdown — แยกช่อง */}
        <div className="relative shrink-0 sm:w-44">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tx2)]" />
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tx2)]" />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            aria-label="เลือกจังหวัด"
            className="w-full appearance-none bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl pl-9 pr-9 py-[14px] text-[var(--tx)] text-base outline-none focus:border-[var(--acc)]/60 cursor-pointer"
          >
            <option value="">ทุกจังหวัด</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Tag search box */}
        <div className="relative flex-1 flex flex-wrap items-center gap-1.5 bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl pl-3 pr-1 py-1.5 focus-within:border-[var(--acc)]/60 focus-within:shadow-[0_0_0_3px_rgba(0,230,118,0.1)] transition-all">
          <Search className="w-5 h-5 text-[var(--tx2)] shrink-0" />

          {/* Selected tag chips */}
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--acc)]/15 border border-[var(--acc)]/40 text-[var(--acc)] text-xs"
            >
              <TagIcon className="w-3 h-3" />
              {t}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`ลบ ${t}`}
                className="ml-0.5 hover:text-[var(--tx)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }}
            onKeyDown={onKeyDown}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={tags.length === 0 ? 'tag เช่น ติดถนนใหญ่ วิวภูเขา' : 'เพิ่มอีก...'}
            aria-label="ค้นหาด้วย tag"
            className="flex-1 min-w-[120px] bg-transparent py-2 text-[var(--tx)] placeholder:text-[var(--tx2)]/70 text-base outline-none"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-sm font-semibold hover:bg-[var(--acc2)] transition-colors whitespace-nowrap"
          >
            ค้นหา
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Autocomplete dropdown — tag เท่านั้น */}
          {open && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[var(--brd)] bg-[var(--bg2)] shadow-2xl">
              {suggestions.map((t, i) => (
                <button
                  key={`${t}-${i}`}
                  type="button"
                  onClick={() => addTag(t)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--tx)] hover:bg-[var(--bg)] transition-colors"
                >
                  <TagIcon className="w-4 h-4 text-[var(--acc)] shrink-0" />
                  <span className="flex-1">{t}</span>
                  <span className="text-[10px] text-[var(--tx2)] uppercase tracking-wider">Tag</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Helper text */}
      {(tags.length > 0 || province) && (
        <div className="mt-2 text-[11px] text-[var(--tx2)]">
          {province && `จังหวัด: ${province}`}
          {province && tags.length > 0 && ' · '}
          {tags.length > 0 && `${tags.length} tag`}
        </div>
      )}
    </motion.form>
  )
}
