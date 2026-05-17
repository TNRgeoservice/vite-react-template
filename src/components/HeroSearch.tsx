// HeroSearch.tsx — Multi-select smart search: เลือก tags + province รวมกัน ก่อนค้นหา
import { useState, useMemo, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, MapPin, Tag as TagIcon, X } from 'lucide-react'
import { PRESET_TAGS, suggestTags } from '../lib/tagTaxonomy'

const MAP_URL = 'https://map.tnrmaphub.com'

const TOP_PROVINCES = [
  'เชียงใหม่','เชียงราย','ภูเก็ต','ชลบุรี','ระยอง','ขอนแก่น','นครราชสีมา',
  'นนทบุรี','ปทุมธานี','สมุทรปราการ','พระนครศรีอยุธยา','เพชรบุรี','ประจวบคีรีขันธ์',
  'สุราษฎร์ธานี','กระบี่','กรุงเทพมหานคร','นครปฐม','สงขลา','อุดรธานี','อุบลราชธานี',
]

type Selection =
  | { kind: 'tag'; value: string }
  | { kind: 'province'; value: string }

export default function HeroSearch() {
  const [q, setQ] = useState('')
  const [selections, setSelections] = useState<Selection[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedTagSet = useMemo(
    () => new Set(selections.filter((s) => s.kind === 'tag').map((s) => s.value)),
    [selections]
  )
  const selectedProvinceSet = useMemo(
    () => new Set(selections.filter((s) => s.kind === 'province').map((s) => s.value)),
    [selections]
  )

  const suggestions = useMemo<Selection[]>(() => {
    const trimmed = q.trim().toLowerCase()
    if (!trimmed) return []
    const out: Selection[] = []
    suggestTags(q, Array.from(selectedTagSet)).slice(0, 5).forEach((t) =>
      out.push({ kind: 'tag', value: t })
    )
    TOP_PROVINCES
      .filter((p) => p.toLowerCase().includes(trimmed) && !selectedProvinceSet.has(p))
      .slice(0, 5)
      .forEach((p) => out.push({ kind: 'province', value: p }))
    return out
  }, [q, selectedTagSet, selectedProvinceSet])

  function addSelection(s: Selection) {
    if (s.kind === 'tag' && selectedTagSet.has(s.value)) return
    if (s.kind === 'province' && selectedProvinceSet.has(s.value)) return
    setSelections((prev) => [...prev, s])
    setQ('')
    inputRef.current?.focus()
  }

  function removeAt(index: number) {
    setSelections((prev) => prev.filter((_, i) => i !== index))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !q && selections.length > 0) {
      setSelections((prev) => prev.slice(0, -1))
    } else if (e.key === 'Enter' && q.trim()) {
      e.preventDefault()
      const trimmed = q.trim()
      // ถ้า match preset → add as tag
      if (PRESET_TAGS.includes(trimmed)) {
        addSelection({ kind: 'tag', value: trimmed })
      } else if (TOP_PROVINCES.some((p) => p === trimmed)) {
        addSelection({ kind: 'province', value: trimmed })
      } else if (suggestions.length > 0) {
        // ใช้ suggestion ตัวแรก
        addSelection(suggestions[0])
      } else {
        // free-form → ถือเป็น province
        addSelection({ kind: 'province', value: trimmed })
      }
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (selections.length === 0 && !q.trim()) {
      window.open(MAP_URL, '_blank', 'noopener,noreferrer')
      return
    }
    // ถ้ายังมี input ค้างใน q → ลองเพิ่มก่อน submit
    let finalSelections = selections
    if (q.trim()) {
      const trimmed = q.trim()
      const newSel: Selection = PRESET_TAGS.includes(trimmed)
        ? { kind: 'tag', value: trimmed }
        : { kind: 'province', value: trimmed }
      // ป้องกัน duplicate
      const exists = finalSelections.some((s) => s.kind === newSel.kind && s.value === newSel.value)
      if (!exists) finalSelections = [...finalSelections, newSel]
    }
    const tags = finalSelections.filter((s) => s.kind === 'tag').map((s) => s.value)
    const provinces = finalSelections.filter((s) => s.kind === 'province').map((s) => s.value)
    const sp = new URLSearchParams()
    if (tags.length > 0) {
      sp.set('tags', tags.join(','))
      sp.set('tagMode', 'and') // user เลือกหลาย tag = ต้องมีครบทุก tag
    }
    if (provinces.length > 0) sp.set('province', provinces[0]) // map รองรับ 1 province
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
      <div className="relative flex flex-wrap items-center gap-1.5 bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl pl-3 pr-1 py-1.5 focus-within:border-[var(--acc)]/60 focus-within:shadow-[0_0_0_3px_rgba(0,230,118,0.1)] transition-all">
        <Search className="w-5 h-5 text-[var(--tx2)] shrink-0" />

        {/* Selected chips inside input */}
        {selections.map((s, i) => {
          const Icon = s.kind === 'tag' ? TagIcon : MapPin
          return (
            <span
              key={`${s.kind}-${s.value}-${i}`}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--acc)]/15 border border-[var(--acc)]/40 text-[var(--acc)] text-xs"
            >
              <Icon className="w-3 h-3" />
              {s.value}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`ลบ ${s.value}`}
                className="ml-0.5 hover:text-[var(--tx)]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )
        })}

        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={selections.length === 0 ? 'ค้นหาจังหวัด หรือ tag เช่น ติดถนนใหญ่ วิวภูเขา' : 'เพิ่มอีก...'}
          aria-label="ค้นหาที่ดิน"
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
      </div>

      {/* Helper text */}
      {selections.length > 0 && (
        <div className="mt-2 text-[11px] text-[var(--tx2)]">
          เลือกแล้ว {selections.length} รายการ — กด Enter เพื่อเพิ่ม, Backspace เพื่อลบ, "ค้นหา" เมื่อพร้อม
        </div>
      )}

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[var(--brd)] bg-[var(--bg2)] shadow-2xl">
          {suggestions.map((s, i) => {
            const Icon = s.kind === 'tag' ? TagIcon : MapPin
            const label = s.kind === 'tag' ? 'Tag' : 'จังหวัด'
            return (
              <button
                key={`${s.kind}-${s.value}-${i}`}
                type="button"
                onClick={() => addSelection(s)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--tx)] hover:bg-[var(--bg)] transition-colors"
              >
                <Icon className="w-4 h-4 text-[var(--acc)] shrink-0" />
                <span className="flex-1">{s.value}</span>
                <span className="text-[10px] text-[var(--tx2)] uppercase tracking-wider">{label}</span>
              </button>
            )
          })}
        </div>
      )}
    </motion.form>
  )
}
