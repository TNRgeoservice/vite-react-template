// ════════════════════════════════════════
// src/pages/PdfStudioPage.tsx  — หน้า /tnrpdfstudio
// Landing + lead magnet สำหรับ TNR PDF Studio (.exe ฟรี)
// flow: intro/ฟีเจอร์ → ปุ่มดาวน์โหลดตรง (ไม่ต้องล็อกอิน) → CTA marketplace
// ════════════════════════════════════════
import { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Download, ShieldCheck, ScanLine, Stamp, Eraser,
  Layers, Combine, Languages, ArrowRight, Map, Tag, X,
} from 'lucide-react';

// ── ตั้งค่า ────────────────────────────────────────────────────────────────
// GitHub "latest release" — ชี้ไป release ล่าสุดเสมอ ตราบใดที่ชื่อไฟล์ asset = "TNR_PDF_Studio.exe" (ไม่ใส่เวอร์ชันในชื่อไฟล์)
// อัปเวอร์ชันใหม่: สร้าง release ใหม่ (tag อะไรก็ได้) แนบไฟล์ชื่อเดิม → ลิงก์นี้ไม่ต้องแก้ ไม่ต้อง redeploy
const DOWNLOAD_URL = 'https://github.com/TNRgeoservice/vite-react-template/releases/latest/download/TNR_PDF_Studio.exe';
const MAP_URL = 'https://map.tnrmaphub.com';

const FEATURES = [
  { icon: Eraser,    color: 'var(--acc)',  title: 'ลบ/แก้ข้อความบนสแกน',  desc: 'ครอบเนียน (smart whiteout) แล้วพิมพ์ทับ — กลมกลืนกับงานสแกนโฉนด เอกสารราชการ' },
  { icon: Languages, color: 'var(--land)', title: 'OCR ภาษาไทย',           desc: 'ดึงข้อความจากเอกสารสแกนเป็นข้อความแก้ไขได้ รองรับไทย+อังกฤษ' },
  { icon: ScanLine,  color: 'var(--poly)', title: 'ตรวจ & แก้กล่องข้อความ', desc: 'จับกล่องข้อความอัตโนมัติ คลิกแก้ทีละจุด พร้อมจับคู่ฟอนต์/ขนาดเดิม' },
  { icon: Stamp,     color: 'var(--road)', title: 'ลายน้ำ · เลขหน้า · ตรา', desc: 'ใส่ลายน้ำ "สำเนาถูกต้อง" เลขหน้า หัว-ท้ายกระดาษ และตราประทับ' },
  { icon: ShieldCheck,color:'var(--acc)',  title: 'ปกปิดข้อมูล (Redact)',  desc: 'ลบข้อมูลส่วนตัวออกจริง — เลขบัตร เบอร์โทร ที่อยู่ ตรวจจับอัตโนมัติได้' },
  { icon: Combine,   color: 'var(--land)', title: 'รวม · แยก · หมุนหน้า',   desc: 'จัดการหน้า PDF — รวมหลายไฟล์ แยกหน้า หมุน ลบ แทรกหน้าใหม่' },
  { icon: Layers,    color: 'var(--poly)', title: 'เลเยอร์ + เอฟเฟกต์',     desc: 'จัดการทุกอย่างเป็นเลเยอร์ ปรับเส้นขอบ เงา ไล่สี ความทึบ แบบ Photoshop' },
  { icon: FileText,  color: 'var(--road)', title: 'ส่งออก Word · รูปภาพ',   desc: 'แปลง PDF เป็น Word แก้ต่อได้ หรือบันทึกเป็น PNG/JPG ความละเอียดสูง' },
];

// ── ภาพหน้าจอ (วางไฟล์ใน public/pdfstudio/ แล้วใส่ชื่อไฟล์ใน file) ───────────────
// file='' = ยังไม่มี → โชว์ placeholder "เร็วๆ นี้". ใส่ชื่อไฟล์เมื่อแคปภาพแล้ว.
const SHOTS_DIR = '/pdfstudio';
const HERO_SHOT = { file: 'hero.png', caption: 'ภาพหน้าจอโปรแกรม TNR PDF Studio', ratio: '16 / 10' };
const GALLERY_SHOTS = [
  { file: 'whiteout.png', caption: 'ลบ/แก้ข้อความบนโฉนดสแกน — ครอบเนียน' },
  { file: 'compare.png', caption: 'เทียบก่อน/หลังแก้ไข — สไลด์เทียบ' },
  { file: 'watermark.png', caption: 'ใส่ลายน้ำ "สำเนาถูกต้อง" + เลขหน้า' },
  { file: 'redact.png', caption: 'ปกปิดข้อมูล (Redact) เลขบัตร/เบอร์โทร' },
  { file: 'ocr-word.png', caption: 'OCR ไทย + ส่งออกเป็น Word' },
];

// กดภาพ → เปิดดูเต็มจอ (lightbox) ; ส่ง opener ผ่าน context เลี่ยง prop drilling ผ่าน Hero/Features
const ZoomCtx = createContext<(src: string, caption: string) => void>(() => {});

export function PdfStudioPage() {
  const [zoom, setZoom] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    document.title = 'TNR PDF Studio — โปรแกรมแก้ PDF โฉนด/เอกสารที่ดิน ฟรี | TNR MapHub';
  }, []);

  // ตอนเปิดภาพเต็มจอ: ล็อกสกรอลล์พื้นหลัง + ปิดด้วย Esc
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom]);

  return (
    <ZoomCtx.Provider value={(src, caption) => setZoom({ src, caption })}>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
        <Header />
        <Hero />
        <Features />
        <DownloadSection />
        <MarketplaceCTA />
        <Footer />
      </div>
      {zoom && <Lightbox src={zoom.src} caption={zoom.caption} onClose={() => setZoom(null)} />}
    </ZoomCtx.Provider>
  );
}

// ── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--brd)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[var(--acc)]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[var(--acc)]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">TNR PDF Studio</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/articles" className="hidden sm:inline text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
              บทความ
            </Link>
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold hover:bg-[var(--acc2)] transition-colors">
              เปิดแผนที่ <ArrowRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(var(--tx) 1px, transparent 1px), linear-gradient(90deg, var(--tx) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--brd)] mb-6">
            <Tag className="w-4 h-4 text-[var(--acc)]" />
            <span className="text-sm text-[var(--tx2)]">ฟรี 100% · สำหรับ Windows</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            แก้ไข <span className="text-[var(--land)]">PDF โฉนด</span> และเอกสารที่ดิน
            <br />ได้ครบ จบในโปรแกรมเดียว
          </h1>
          <p className="text-lg text-[var(--tx2)] mb-8 leading-relaxed">
            TNR PDF Studio — โปรแกรมแก้ไขไฟล์ PDF บนเครื่องคุณ ลบ/แก้ข้อความบนสแกน OCR ไทย
            ใส่ลายน้ำ ปกปิดข้อมูล รวม-แยกไฟล์ และแปลงเป็น Word ได้ฟรี ไม่ต้องอัปโหลดไฟล์ขึ้นเว็บ
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#download"
               className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all">
              <Download className="w-5 h-5" /> ดาวน์โหลดฟรี
            </a>
            <a href="#features"
               className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--brd)] text-[var(--tx)] rounded-xl text-base font-medium hover:bg-[var(--bg2)] transition-colors">
              ดูฟีเจอร์ทั้งหมด
            </a>
          </div>
        </div>

        {/* ภาพหน้าจอโปรแกรม — โชว์ภาพจริงถ้ามี ไม่งั้น placeholder */}
        <Shot file={HERO_SHOT.file} caption={HERO_SHOT.caption} ratio={HERO_SHOT.ratio} />
      </div>
    </section>
  );
}

// ── ช่องภาพ: โชว์ <img> ถ้ามีไฟล์ ไม่งั้นโชว์ placeholder dashed ──────────────────
function Shot({ file, caption, ratio = '16 / 9' }: { file: string; caption: string; ratio?: string }) {
  const openZoom = useContext(ZoomCtx);
  if (file) {
    const src = `${SHOTS_DIR}/${file}`;
    return (
      <img
        src={src} alt={caption} loading="lazy"
        onClick={() => openZoom(src, caption)}
        className="w-full rounded-2xl border border-[var(--brd)] bg-[var(--bg2)] object-cover shadow-lg cursor-zoom-in hover:opacity-90 hover:border-[var(--acc)]/40 transition-all"
        style={{ aspectRatio: ratio }}
      />
    );
  }
  return (
    <div
      className="w-full rounded-2xl border border-dashed border-[var(--brd)] bg-[var(--bg2)] flex flex-col items-center justify-center text-center p-6"
      style={{ aspectRatio: ratio }}
    >
      <FileText className="w-10 h-10 text-[var(--txd)] mb-3" />
      <span className="text-sm text-[var(--tx2)]">{caption}</span>
      <span className="text-xs text-[var(--txd)] mt-1">เร็วๆ นี้</span>
    </div>
  );
}

// ── Lightbox: ดูภาพเต็มจอ (คลิกพื้นหลัง/ปุ่ม X/Esc เพื่อปิด) ────────────────────
function Lightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={caption}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8"
    >
      <button
        onClick={onClose} aria-label="ปิด"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <img
        src={src} alt={caption}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain cursor-default"
      />
      <p className="mt-4 text-sm text-white/80 text-center max-w-2xl">{caption}</p>
    </div>
  );
}

// ── Features ────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">เครื่องมือครบสำหรับงานเอกสารที่ดิน</h2>
          <p className="text-[var(--tx2)] max-w-2xl mx-auto">
            ออกแบบมาเพื่อคนทำงานโฉนด เอกสารสิทธิ์ และเอกสารราชการ — ทำงานบนเครื่องคุณ ข้อมูลไม่รั่ว
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 bg-[var(--bg)] rounded-2xl border border-[var(--brd)] hover:border-[var(--acc)]/40 transition-colors">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.color + '1a' }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--tx2)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* แกลเลอรีภาพตัวอย่างการใช้งาน (จาก GALLERY_SHOTS) */}
        <div className="mt-14">
          <h3 className="text-center text-xl font-semibold mb-6">ตัวอย่างการใช้งานจริง</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_SHOTS.map((s, i) => (
              <Shot key={i} file={s.file} caption={s.caption} ratio="16 / 10" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Download (ดาวน์โหลดตรง ไม่ต้องล็อกอิน) ───────────────────────────────────
function DownloadSection() {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">ดาวน์โหลดฟรี</h2>
          <p className="text-[var(--tx2)]">
            กดดาวน์โหลดได้เลย ไม่ต้องสมัครสมาชิก — โปรแกรมทำงานบนเครื่องคุณ ข้อมูลไม่อัปโหลดขึ้นเว็บ
          </p>
        </div>

        <div className="bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl p-6 sm:p-8 text-center">
          <a
            href={DOWNLOAD_URL}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-lg font-semibold hover:bg-[var(--acc2)] transition-all"
          >
            <Download className="w-5 h-5" />
            ดาวน์โหลด TNR PDF Studio (.exe)
          </a>
          <p className="text-xs text-[var(--txd)] mt-3">Windows 10/11 · ขนาดประมาณ 150 MB · ฟรีไม่มีค่าใช้จ่าย</p>
        </div>
      </div>
    </section>
  );
}

// ── CTA back to marketplace ─────────────────────────────────────────────────
function MarketplaceCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--land)]/10 border border-[var(--land)]/30 mb-4">
          <Map className="w-4 h-4 text-[var(--land)]" />
          <span className="text-sm text-[var(--land)]">TNR MapHub Marketplace</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">มีที่ดินอยากขาย? ลงประกาศฟรีบน TNR MapHub</h2>
        <p className="text-[var(--tx2)] mb-8 max-w-2xl mx-auto">
          แพลตฟอร์มซื้อขายที่ดินพร้อมระบบแผนที่ GIS — ลงประกาศขายที่ดินฟรี ไม่จำกัด เจ้าของขายเอง
          ค้นหาทำเลดี ดูพิกัด ผังเมือง โฉนด และเปรียบเทียบราคาในที่เดียว
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all">
            <Tag className="w-5 h-5" /> ลงประกาศขายที่ดินฟรี <ArrowRight className="w-4 h-4" />
          </a>
          <a href={MAP_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[var(--brd)] text-[var(--tx)] rounded-xl text-base font-medium hover:bg-[var(--bg)] transition-colors">
            <Map className="w-5 h-5" /> เปิดแผนที่ค้นหาที่ดิน
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--brd)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Map className="w-5 h-5 text-[var(--acc)]" />
          <span className="font-semibold">TNR MapHub</span>
          <span className="text-xs text-[var(--tx2)] hidden sm:inline">— PDF Studio</span>
        </Link>
        <p className="text-sm text-[var(--tx2)]">© {new Date().getFullYear()} TNR Geoservice. สงวนลิขสิทธิ์</p>
      </div>
    </footer>
  );
}
