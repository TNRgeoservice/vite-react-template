// tools.ts — สูตรคำนวณของเครื่องมือฟรีบนหน้าแรก (copy จาก TransferFeeCalculator / MortgageCalculator ของแอปแผนที่)

/** 1 ไร่ = 4 งาน = 400 ตร.วา · 1 ตร.วา = 4 ตร.ม. */
export const SQM_PER_WA = 4
export const SQM_PER_NGAN = 400
export const SQM_PER_RAI = 1600
const SQM_PER_ACRE = 4046.8564224

export function toSqm(rai: number, ngan: number, wa: number): number {
  return rai * SQM_PER_RAI + ngan * SQM_PER_NGAN + wa * SQM_PER_WA
}

/** ตร.ม. → ไร่-งาน-ตร.วา (ตร.วา ทศนิยม 2 ตำแหน่ง) */
export function fromSqm(sqm: number): { rai: number; ngan: number; wa: number } {
  const rai = Math.floor(sqm / SQM_PER_RAI)
  let rest = sqm - rai * SQM_PER_RAI
  const ngan = Math.floor(rest / SQM_PER_NGAN)
  rest -= ngan * SQM_PER_NGAN
  return { rai, ngan, wa: Math.round((rest / SQM_PER_WA) * 100) / 100 }
}

export function areaSummary(sqm: number) {
  return {
    sqm,
    wa: sqm / SQM_PER_WA,
    raiDecimal: sqm / SQM_PER_RAI,
    acre: sqm / SQM_PER_ACRE,
    hectare: sqm / 10000,
  }
}

// ── ค่าโอนที่ดิน ─────────────────────────────────────────

export type HoldingMode = 'over5y' | 'under5y' | 'company'

export interface TransferFeeResult {
  base: number
  transferFee: number
  specificBusinessTax: number
  stampDuty: number
  withholdingTax: number
  total: number
  buyerShare: number
  sellerShare: number
}

export function calcTransferFee(base: number, holding: HoldingMode, years: number): TransferFeeResult {
  const transferFee = base * 0.02
  let specificBusinessTax = 0
  let stampDuty = 0
  if (holding === 'under5y' || holding === 'company') {
    specificBusinessTax = base * 0.033 // 3% + ภาษีท้องถิ่น 10% ของ 3% = 3.3%
  } else {
    stampDuty = base * 0.005
  }
  const withholdingTax = holding === 'company' ? base * 0.01 : calcPersonalWHT(base, years)
  const total = transferFee + specificBusinessTax + stampDuty + withholdingTax
  const buyerShare = transferFee / 2 // ค่าธรรมเนียมแบ่งครึ่ง ภาษี/อากรผู้ขายจ่าย
  return { base, transferFee, specificBusinessTax, stampDuty, withholdingTax, total, buyerShare, sellerShare: total - buyerShare }
}

function calcPersonalWHT(base: number, years: number): number {
  if (base <= 0 || years <= 0) return 0
  const expenseRates: Record<number, number> = { 1: 0.92, 2: 0.84, 3: 0.77, 4: 0.71, 5: 0.65, 6: 0.6, 7: 0.55, 8: 0.5 }
  const rate = years <= 8 ? expenseRates[years] : 0.5
  const yearly = (base * (1 - rate)) / years
  return progressiveTax(yearly) * years
}

function progressiveTax(income: number): number {
  const brackets = [
    { upTo: 150_000, rate: 0 },
    { upTo: 300_000, rate: 0.05 },
    { upTo: 500_000, rate: 0.1 },
    { upTo: 750_000, rate: 0.15 },
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: 2_000_000, rate: 0.25 },
    { upTo: 5_000_000, rate: 0.3 },
    { upTo: Infinity, rate: 0.35 },
  ]
  let tax = 0
  let prev = 0
  for (const b of brackets) {
    if (income <= prev) break
    tax += (Math.min(income, b.upTo) - prev) * b.rate
    prev = b.upTo
    if (income <= b.upTo) break
  }
  return tax
}

// ── สินเชื่อ ─────────────────────────────────────────────

export function calcMortgage(price: number, downPct: number, ratePct: number, years: number) {
  const principal = Math.max(0, price * (1 - downPct / 100))
  const months = Math.round(years * 12)
  const r = ratePct / 100 / 12
  if (principal <= 0 || months <= 0) return null
  const monthly = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const totalPaid = monthly * months
  return { principal, monthly, totalPaid, interest: totalPaid - principal, minIncome: monthly / 0.4 }
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString('th-TH', { minimumFractionDigits: digits, maximumFractionDigits: digits })
export const fmtBaht = (n: number) => `฿${fmt(Math.round(n))}`
