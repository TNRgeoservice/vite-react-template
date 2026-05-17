// QuickFilterChips.tsx — Province + Popular tags + price/area
import { motion } from 'framer-motion'
import { MapPin, Tag as TagIcon, Coins, Maximize2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { POPULAR_TAGS } from '../lib/tagTaxonomy'

const MAP_URL = 'https://map.tnrmaphub.com'

type Chip = {
  label: string
  icon: LucideIcon
  params: Record<string, string>
}

const PROVINCE_CHIPS: Chip[] = [
  { label: 'เชียงใหม่', icon: MapPin, params: { province: 'เชียงใหม่' } },
  { label: 'ภูเก็ต', icon: MapPin, params: { province: 'ภูเก็ต' } },
  { label: 'ชลบุรี', icon: MapPin, params: { province: 'ชลบุรี' } },
  { label: 'ขอนแก่น', icon: MapPin, params: { province: 'ขอนแก่น' } },
]

const TAG_CHIPS: Chip[] = POPULAR_TAGS.map((t) => ({
  label: t,
  icon: TagIcon,
  params: { tags: t },
}))

const QUICK_CHIPS: Chip[] = [
  { label: 'ไม่เกิน 1 ล้าน', icon: Coins, params: { priceMax: '1000000' } },
  { label: 'มากกว่า 5 ไร่', icon: Maximize2, params: { areaMin: '2000' } },
]

const ALL_CHIPS: Chip[] = [...PROVINCE_CHIPS, ...TAG_CHIPS, ...QUICK_CHIPS]

function buildUrl(params: Record<string, string>): string {
  const sp = new URLSearchParams(params)
  return `${MAP_URL}/?${sp.toString()}`
}

export default function QuickFilterChips() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap gap-2 max-w-xl"
    >
      {ALL_CHIPS.map((chip, i) => {
        const Icon = chip.icon
        return (
          <motion.a
            key={chip.label}
            href={buildUrl(chip.params)}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--brd)] text-[var(--tx)] text-sm hover:bg-[var(--bg)] hover:text-[var(--acc)] hover:border-[var(--acc)]/50 transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            {chip.label}
          </motion.a>
        )
      })}
    </motion.div>
  )
}
