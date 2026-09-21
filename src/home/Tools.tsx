// Tools.tsx — เครื่องมือฟรี (ไม่ต้องเข้าสู่ระบบ): แปลงหน่วยที่ดิน · ค่าโอน · ผ่อนต่อเดือน
import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import {
  areaSummary, calcMortgage, calcTransferFee, fmt, fmtBaht, fromSqm, toSqm, type HoldingMode,
} from './calc'

type Tab = 'area' | 'transfer' | 'loan'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'area', label: 'แปลงหน่วยที่ดิน', icon: 'i-target' },
  { key: 'transfer', label: 'ค่าโอน / ภาษี', icon: 'i-doc' },
  { key: 'loan', label: 'ผ่อนต่อเดือน', icon: 'i-chart' },
]

const num = (s: string) => {
  const n = parseFloat(s)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function NumField({
  id, label, value, onChange, placeholder, suffix, step,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  placeholder?: string; suffix?: string; step?: string
}) {
  return (
    <div className="tool-field">
      <label htmlFor={id}>{label}</label>
      <div className="tool-input">
        <input
          id={id} type="number" inputMode="decimal" min="0" step={step || 'any'}
          value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={'tool-row' + (strong ? ' strong' : '')}>
      <span>{label}</span>
      <b className="latin">{value}</b>
    </div>
  )
}

function AreaTool() {
  const [mode, setMode] = useState<'toSqm' | 'fromSqm'>('toSqm')
  const [rai, setRai] = useState('1')
  const [ngan, setNgan] = useState('0')
  const [wa, setWa] = useState('0')
  const [sqmIn, setSqmIn] = useState('')

  const sqm = mode === 'toSqm' ? toSqm(num(rai), num(ngan), num(wa)) : num(sqmIn)
  const s = areaSummary(sqm)
  const r = fromSqm(sqm)

  return (
    <div className="tool-body">
      <div className="tool-form">
      <div className="tool-seg" role="group" aria-label="ทิศทางการแปลง">
        <button type="button" aria-pressed={mode === 'toSqm'} onClick={() => setMode('toSqm')}>ไร่-งาน-ตร.วา → ตร.ม.</button>
        <button type="button" aria-pressed={mode === 'fromSqm'} onClick={() => setMode('fromSqm')}>ตร.ม. → ไร่-งาน-ตร.วา</button>
      </div>
      {mode === 'toSqm' ? (
        <div className="tool-grid3">
          <NumField id="t-rai" label="ไร่" value={rai} onChange={setRai} suffix="ไร่" />
          <NumField id="t-ngan" label="งาน" value={ngan} onChange={setNgan} suffix="งาน" />
          <NumField id="t-wa" label="ตารางวา" value={wa} onChange={setWa} suffix="ตร.วา" />
        </div>
      ) : (
        <NumField id="t-sqm" label="เนื้อที่ (ตารางเมตร)" value={sqmIn} onChange={setSqmIn} placeholder="เช่น 3200" suffix="ตร.ม." />
      )}
      </div>
      <div className="tool-side">
      <div className="tool-result" aria-live="polite">
        {mode === 'fromSqm' && <Row label="ไร่-งาน-ตร.วา" value={sqm ? `${r.rai}-${r.ngan}-${fmt(r.wa, 2)}` : '—'} strong />}
        <Row label="ตารางเมตร" value={sqm ? fmt(s.sqm, 2) : '—'} strong={mode === 'toSqm'} />
        <Row label="ตารางวา" value={sqm ? fmt(s.wa, 2) : '—'} />
        <Row label="ไร่ (ทศนิยม)" value={sqm ? fmt(s.raiDecimal, 4) : '—'} />
        <Row label="เอเคอร์" value={sqm ? fmt(s.acre, 4) : '—'} />
        <Row label="เฮกตาร์" value={sqm ? fmt(s.hectare, 4) : '—'} />
      </div>
      <p className="tool-note">1 ไร่ = 4 งาน = 400 ตร.วา = 1,600 ตร.ม. · 1 ตร.วา = 4 ตร.ม.</p>
      </div>
    </div>
  )
}

function TransferTool() {
  const [appraised, setAppraised] = useState('')
  const [sale, setSale] = useState('')
  const [holding, setHolding] = useState<HoldingMode>('over5y')
  const [years, setYears] = useState('5')

  const a = num(appraised)
  const p = num(sale)
  const y = Math.max(0, Math.min(40, parseInt(years, 10) || 0))
  const result = useMemo(
    () => (a > 0 && p > 0 ? calcTransferFee(Math.max(a, p), holding, y) : null),
    [a, p, holding, y],
  )

  return (
    <div className="tool-body">
      <div className="tool-form">
      <div className="tool-grid2">
        <NumField id="t-app" label="ราคาประเมิน (บาท)" value={appraised} onChange={setAppraised} placeholder="เช่น 1500000" />
        <NumField id="t-sale" label="ราคาซื้อขายจริง (บาท)" value={sale} onChange={setSale} placeholder="เช่น 1800000" />
      </div>
      <div className="tool-field">
        <span className="tool-label">สถานะผู้ขาย / ระยะเวลาถือครอง</span>
        <div className="tool-seg" role="group" aria-label="สถานะผู้ขาย">
          {([['over5y', 'บุคคล ถือ ≥ 5 ปี'], ['under5y', 'บุคคล ถือ < 5 ปี'], ['company', 'นิติบุคคล']] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={holding === k} onClick={() => setHolding(k)}>{l}</button>
          ))}
        </div>
      </div>
      {holding !== 'company' && (
        <NumField id="t-years" label="จำนวนปีที่ถือครอง (ใช้คำนวณภาษีเงินได้)" value={years} onChange={setYears} suffix="ปี" step="1" />
      )}
      </div>
      <div className="tool-side">
      <div className="tool-result" aria-live="polite">
        {result ? (
          <>
            <Row label="ฐานคำนวณ (สูงกว่าระหว่างราคาประเมิน/ขาย)" value={fmtBaht(result.base)} />
            <Row label="ค่าธรรมเนียมโอน 2%" value={fmtBaht(result.transferFee)} />
            {result.specificBusinessTax > 0 && <Row label="ภาษีธุรกิจเฉพาะ 3.3%" value={fmtBaht(result.specificBusinessTax)} />}
            {result.stampDuty > 0 && <Row label="อากรแสตมป์ 0.5%" value={fmtBaht(result.stampDuty)} />}
            <Row label="ภาษีเงินได้หัก ณ ที่จ่าย" value={fmtBaht(result.withholdingTax)} />
            <Row label="รวมค่าโอนทั้งหมด" value={fmtBaht(result.total)} strong />
            <Row label="ผู้ซื้อจ่าย (ครึ่งหนึ่งของค่าธรรมเนียม)" value={fmtBaht(result.buyerShare)} />
            <Row label="ผู้ขายจ่าย (ที่เหลือ)" value={fmtBaht(result.sellerShare)} />
          </>
        ) : (
          <p className="tool-empty">กรอกราคาประเมิน + ราคาซื้อขาย เพื่อคำนวณ</p>
        )}
      </div>
      <p className="tool-note">ประมาณการเบื้องต้น อิงอัตราทั่วไปของกรมที่ดิน/กรมสรรพากร — ตัวเลขจริงขึ้นกับเงื่อนไขแต่ละแปลง ยืนยันกับสำนักงานที่ดินอีกครั้งก่อนนัดโอน</p>
      </div>
    </div>
  )
}

function LoanTool() {
  const [price, setPrice] = useState('')
  const [down, setDown] = useState('20')
  const [rate, setRate] = useState('5.5')
  const [years, setYears] = useState('30')

  const result = useMemo(
    () => (num(price) > 0 ? calcMortgage(num(price), Math.min(100, num(down)), num(rate), num(years)) : null),
    [price, down, rate, years],
  )

  return (
    <div className="tool-body">
      <div className="tool-form">
      <NumField id="t-price" label="ราคาที่ดิน / โครงการ (บาท)" value={price} onChange={setPrice} placeholder="เช่น 2000000" />
      <div className="tool-grid3">
        <NumField id="t-down" label="เงินดาวน์" value={down} onChange={setDown} suffix="%" />
        <NumField id="t-rate" label="ดอกเบี้ย/ปี" value={rate} onChange={setRate} suffix="%" step="0.05" />
        <NumField id="t-loanyears" label="ระยะเวลา" value={years} onChange={setYears} suffix="ปี" step="1" />
      </div>
      </div>
      <div className="tool-side">
      <div className="tool-result" aria-live="polite">
        {result ? (
          <>
            <Row label="ค่างวดต่อเดือน" value={fmtBaht(result.monthly)} strong />
            <Row label="ยอดกู้" value={fmtBaht(result.principal)} />
            <Row label="ดอกเบี้ยรวมตลอดสัญญา" value={fmtBaht(result.interest)} />
            <Row label="ยอดชำระรวม" value={fmtBaht(result.totalPaid)} />
            <Row label="รายได้ต่อเดือนที่แนะนำ (ค่างวด ≤ 40%)" value={fmtBaht(result.minIncome)} />
          </>
        ) : (
          <p className="tool-empty">กรอกราคาเพื่อคำนวณค่างวด</p>
        )}
      </div>
      <p className="tool-note">คำนวณแบบอัตราดอกเบี้ยคงที่ตลอดสัญญา เพื่อประเมินเบื้องต้นเท่านั้น — เงื่อนไขจริงขึ้นกับสถาบันการเงิน</p>
      </div>
    </div>
  )
}

export default function Tools() {
  const [tab, setTab] = useState<Tab>('area')
  return (
    <section className="section tools-section" id="tools" aria-labelledby="tools-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow">เครื่องมือฟรี ไม่ต้องเข้าสู่ระบบ</div>
            <h2 id="tools-title">คำนวณก่อนตัดสินใจ</h2>
          </div>
          <p>แปลงหน่วยไร่-งาน-ตารางวา ประเมินค่าโอน และค่างวดผ่อน — ใช้ได้ทันทีในหน้านี้</p>
        </div>
        <div className="tools-card reveal">
          <div className="tool-tabs" role="tablist" aria-label="เครื่องมือคำนวณ">
            {TABS.map((t) => (
              <button
                key={t.key} type="button" role="tab" id={`tab-${t.key}`} aria-selected={tab === t.key}
                aria-controls={`panel-${t.key}`} onClick={() => setTab(t.key)}
              >
                <Icon name={t.icon} />{t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {tab === 'area' && <AreaTool />}
            {tab === 'transfer' && <TransferTool />}
            {tab === 'loan' && <LoanTool />}
          </div>
        </div>
      </div>
    </section>
  )
}
