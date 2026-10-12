// ════════════════════════════════════════
// src/pages/PdfStudioPage.tsx  — หน้า /tnrpdfstudio
// Landing + lead magnet สำหรับ Bailan (เดิมชื่อ TNR PDF Studio) — โปรแกรมแก้ PDF .exe ฟรี
// ธีม/คลาสใช้ชุดเดียวกับหน้าแรก (.v5 "Daylight Precision") + ธีมสว่าง/มืดจำค่าร่วมกับหน้าแรก
// flow: intro → ที่มาชื่อ → ฟีเจอร์ → วิดีโอ → ปุ่มดาวน์โหลดตรง (ไม่ต้องล็อกอิน) → CTA marketplace
// ════════════════════════════════════════
import { useEffect, useState, createContext, useContext } from 'react';
import {
  FileText, Download, ShieldCheck, ScanLine, Eraser, Camera,
  Layers, Combine, Languages, X, PlayCircle,
} from 'lucide-react';
import { Icon, Sprite } from '../home/Icon';
import { SiteHeader, SiteFooter, LineFab, useSiteTheme, MAP_URL } from '../components/SiteChrome';
import './pdfstudio.css';

// ── ตั้งค่า ────────────────────────────────────────────────────────────────
// GitHub "latest release" — ชี้ไป release ล่าสุดเสมอ ตราบใดที่ชื่อไฟล์ asset = "Bailan.exe" (ไม่ใส่เวอร์ชันในชื่อไฟล์)
// อัปเวอร์ชันใหม่: สร้าง release ใหม่ (tag อะไรก็ได้) แนบไฟล์ชื่อเดิม → ลิงก์นี้ไม่ต้องแก้ ไม่ต้อง redeploy
const DOWNLOAD_URL = 'https://github.com/TNRgeoservice/vite-react-template/releases/latest/download/Bailan.exe';
const GH_REPO = 'TNRgeoservice/vite-react-template';   // ใช้ดึงยอดดาวน์โหลดจาก GitHub API
// ยอดสะสมจาก release ที่ถูกลบไปแล้ว (GitHub ลบ asset = ยอดหายจาก API ถาวร) — บวกฐานนี้กับยอดจริง
// ⚠️ รอบหน้าอัปเวอร์ชัน: สร้าง release ใหม่โดย "ไม่ลบอันเก่า" ยอดจะสะสมเองไม่ต้องมาบวกเพิ่มตรงนี้
const DOWNLOAD_BASELINE = 16;
const ICON_SRC = '/pdfstudio/bailan-icon.png';

const FEATURES = [
  { icon: Eraser,      title: 'ลบ/แก้ข้อความบนสแกน',  desc: 'ครอบเนียน (smart whiteout) แล้วพิมพ์ทับ — กลมกลืนกับงานเอกสารสแกน เอกสารราชการ' },
  { icon: Camera,      title: 'รูปถ่าย → สแกน', isNew: true, desc: 'ถ่ายเอกสารด้วยมือถือ แล้วให้โปรแกรมตัดพื้นหลัง ดัดมุมให้ตรง ลบเงา ให้เหมือนสแกน' },
  { icon: Languages,   title: 'OCR ภาษาไทย',           desc: 'ดึงข้อความจากเอกสารสแกนเป็นข้อความแก้ไขได้ รองรับไทย+อังกฤษ' },
  { icon: ScanLine,    title: 'ตรวจ & แก้กล่องข้อความ', desc: 'จับกล่องข้อความอัตโนมัติ คลิกแก้ทีละจุด พร้อมจับคู่ฟอนต์/ขนาดเดิม' },
  { icon: ShieldCheck, title: 'ปกปิดข้อมูล (Redact)',  desc: 'ลบข้อมูลส่วนตัวออกจริง — เลขบัตร เบอร์โทร ที่อยู่ ตรวจจับอัตโนมัติได้' },
  { icon: Combine,     title: 'รวม · แยก · หมุนหน้า',   desc: 'จัดการหน้า PDF — รวมหลายไฟล์ แยกหน้า หมุน ลบ แทรกหน้าใหม่ เปิดไฟล์รูปเป็น PDF ได้' },
  { icon: Layers,      title: 'เลเยอร์ + เอฟเฟกต์',     desc: 'จัดการทุกอย่างเป็นเลเยอร์ ปรับเส้นขอบ เงา ไล่สี ความทึบ แบบ Photoshop' },
  { icon: FileText,    title: 'ส่งออก Word · รูปภาพ',   desc: 'แปลง PDF เป็น Word แก้ต่อได้ หรือบันทึกเป็น PNG/JPG ความละเอียดสูง' },
];

// ── ภาพหน้าจอ (วางไฟล์ใน public/pdfstudio/ แล้วใส่ชื่อไฟล์ใน file) ───────────────
// file='' = ยังไม่มี → โชว์ placeholder "เร็วๆ นี้". ใส่ชื่อไฟล์เมื่อแคปภาพแล้ว.
const SHOTS_DIR = '/pdfstudio';
const HERO_SHOT = { file: 'hero.png', caption: 'ภาพหน้าจอโปรแกรม Bailan', ratio: '16 / 10' };
const GALLERY_SHOTS = [
  { file: 'whiteout.png', caption: 'ลบ/แก้ข้อความบนเอกสารสแกน — ครอบเนียน' },
  { file: 'compare.png', caption: 'เทียบก่อน/หลังแก้ไข — สไลด์เทียบ' },
  { file: 'redact.png', caption: 'ปกปิดข้อมูล (Redact) เลขบัตร/เบอร์โทร' },
  { file: 'ocr-word.png', caption: 'OCR ไทย + ส่งออกเป็น Word' },
];

// วิดีโอวิธีใช้งาน — คลิปแรก + playlist id (Shorts แนวตั้ง). embed/videoseries เล่น Shorts ไม่ได้ ("Video unavailable") ต้องระบุคลิปแรกด้วย
// ว่าง = โชว์ placeholder "เร็วๆ นี้"
const VIDEO_FIRST_ID = 'RovW8sp8QNw';
const VIDEO_PLAYLIST_ID = 'PLe-0y5veh5K8';

// กดภาพ → เปิดดูเต็มจอ (lightbox) ; ส่ง opener ผ่าน context เลี่ยง prop drilling
const ZoomCtx = createContext<(src: string, caption: string) => void>(() => {});

export function PdfStudioPage() {
  const [zoom, setZoom] = useState<{ src: string; caption: string } | null>(null);
  const { theme, toggleTheme } = useSiteTheme();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Bailan — โปรแกรมแก้ PDF และเอกสาร ฟรี | TNR MapHub';
    // เลขเวอร์ชันล่าสุด (ไฟล์เดียวกับที่โปรแกรมใช้เช็กอัพเดท)
    fetch('/tnrpdfstudio/version.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((v) => setVersion(v.version))
      .catch(() => {});
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
      <div className="v5" data-theme={theme}>
        <Sprite />
        <a className="skip" href="#main">ข้ามไปยังเนื้อหา</a>
        <SiteHeader theme={theme} onToggleTheme={toggleTheme} active="/tnrpdfstudio"
                    cta={<a className="btn btn-primary" href="#download"><Download className="w-4 h-4" /> ดาวน์โหลด</a>} />
        <main id="main">
          <Hero version={version} />
          <NameStory />
          <Features />
          <HowToVideo />
          <DownloadSection version={version} />
          <MarketplaceCTA />
        </main>
        <SiteFooter />
        <LineFab />
      </div>
      {zoom && <Lightbox src={zoom.src} caption={zoom.caption} onClose={() => setZoom(null)} />}
    </ZoomCtx.Provider>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero({ version }: { version: string | null }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />ฟรี 100% · สำหรับ Windows · โดย TNR Geoservice</div>
          <h1 id="hero-title">
            <span className="intro"><span className="latin">Bailan</span> · ใบลาน</span>
            <em>แก้ไข <span className="latin">PDF</span></em>
            <span className="last">และเอกสารได้ครบ<br />จบในโปรแกรมเดียว</span>
          </h1>
          <p className="hero-description">
            โปรแกรมแก้ไขไฟล์ PDF บนเครื่องคุณ ลบ/แก้ข้อความบนสแกน OCR ไทย แปลงรูปถ่ายเป็นสแกน
            ปกปิดข้อมูล รวม-แยกไฟล์ และแปลงเป็น Word ได้ฟรี ไม่ต้องอัปโหลดไฟล์ขึ้นเว็บ
          </p>
          <div className="pdf-hero-actions">
            <a className="btn btn-primary" href="#download"><Download className="w-5 h-5" /> ดาวน์โหลดฟรี</a>
            <a className="btn btn-secondary" href="#features">ดูฟีเจอร์ทั้งหมด</a>
          </div>
          <div className="pdf-hero-meta">
            <img src={ICON_SRC} alt="" width={40} height={40} />
            <span><b>Bailan{version ? ` ${version}` : ''}</b>เดิมชื่อ TNR PDF Studio · อัพเดทในตัวโปรแกรม</span>
          </div>
        </div>
        <Shot file={HERO_SHOT.file} caption={HERO_SHOT.caption} ratio={HERO_SHOT.ratio} />
      </div>
    </section>
  );
}

// ── ที่มาของชื่อ ─────────────────────────────────────────────────────────────
function NameStory() {
  return (
    <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="story-title">
      <div className="wrap">
        <div className="pdf-story">
          <img src={ICON_SRC} alt="โลโก้ Bailan" width={96} height={96} />
          <div>
            <div className="eyebrow">ทำไมชื่อ Bailan</div>
            <h2 id="story-title">จากคัมภีร์ใบลาน สู่เอกสารดิจิทัล</h2>
            <p>
              ใบลานคือ “เอกสาร” ยุคแรกของไทย ที่ใช้จดบันทึกความรู้สำคัญสืบต่อกันมาหลายร้อยปี
              Bailan จึงตั้งใจเป็นเครื่องมือดูแลเอกสารสำคัญของคุณในยุคนี้ — แก้ไขได้ ค้นหาได้ และปลอดภัยบนเครื่องของคุณเอง
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── ช่องภาพ: โชว์ <img> ถ้ามีไฟล์ ไม่งั้นโชว์ placeholder dashed ──────────────────
function Shot({ file, caption, ratio = '16 / 9', withCaption = false }: { file: string; caption: string; ratio?: string; withCaption?: boolean }) {
  const openZoom = useContext(ZoomCtx);
  if (!file) {
    return (
      <div className="pdf-shot-empty" style={{ aspectRatio: ratio }}>
        <FileText className="w-10 h-10" />
        <span>{caption}</span>
        <small>เร็วๆ นี้</small>
      </div>
    );
  }
  const src = `${SHOTS_DIR}/${file}`;
  const img = (
    <img src={src} alt={caption} loading="lazy" onClick={() => openZoom(src, caption)}
         className="pdf-shot" style={{ aspectRatio: ratio }} />
  );
  if (!withCaption) return img;
  return (
    <figure>
      {img}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

// ── Lightbox: ดูภาพเต็มจอ (คลิกพื้นหลัง/ปุ่ม X/Esc เพื่อปิด) ────────────────────
function Lightbox({ src, caption, onClose }: { src: string; caption: string; onClose: () => void }) {
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label={caption} className="pdf-lightbox">
      <button onClick={onClose} aria-label="ปิด"><X className="w-5 h-5" /></button>
      <img src={src} alt={caption} onClick={(e) => e.stopPropagation()} />
      <p>{caption}</p>
    </div>
  );
}

// ── Features ────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ฟีเจอร์</div>
            <h2 id="features-title">เครื่องมือครบสำหรับงานเอกสาร</h2>
          </div>
          <p>ออกแบบมาเพื่อคนทำงานเอกสาร เอกสารสำคัญ และเอกสารราชการ — ทำงานบนเครื่องคุณ ข้อมูลไม่รั่ว</p>
        </div>

        <div className="pdf-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="pdf-card">
              <div className="pdf-card-icon"><f.icon className="w-5 h-5" /></div>
              <h3>{f.title}{'isNew' in f && f.isNew && <span className="new">ใหม่</span>}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="pdf-gallery">
          {GALLERY_SHOTS.map((s) => (
            <Shot key={s.file} file={s.file} caption={s.caption} ratio="16 / 10" withCaption />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── วิธีใช้งาน (วิดีโอ) ───────────────────────────────────────────────────────
function HowToVideo() {
  return (
    <section id="how-to" className="section" style={{ paddingTop: 0 }} aria-labelledby="howto-title">
      <div className="wrap" style={{ maxWidth: 960 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">วิธีใช้งาน</div>
            <h2 id="howto-title">ดูคลิปสั้นๆ แล้วเริ่มใช้ได้เลย</h2>
          </div>
          <p>ตั้งแต่เปิดไฟล์ แก้ไข จนส่งออก</p>
        </div>
        {VIDEO_FIRST_ID ? (
          <div className="pdf-video" style={{ aspectRatio: '9 / 16', width: '100%', maxWidth: 360, marginInline: 'auto' }}>
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_FIRST_ID}?list=${VIDEO_PLAYLIST_ID}`}
              title="วิธีใช้งาน Bailan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="pdf-shot-empty" style={{ aspectRatio: '16 / 9' }}>
            <PlayCircle className="w-12 h-12" />
            <span>วิดีโอวิธีใช้งาน</span>
            <small>เร็วๆ นี้</small>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Download (ดาวน์โหลดตรง ไม่ต้องล็อกอิน) ───────────────────────────────────
function DownloadSection({ version }: { version: string | null }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // ดึงยอดดาวน์โหลดสะสมจาก GitHub (รวมไฟล์ .exe ของทุก release) — public API ไม่ต้องใช้ token
    fetch(`https://api.github.com/repos/${GH_REPO}/releases?per_page=100`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rels: any[]) => {
        const total = rels.reduce(
          (sum: number, rel: any) =>
            sum + (rel.assets || [])
              .filter((a: any) => typeof a.name === 'string' && a.name.endsWith('.exe'))
              .reduce((s: number, a: any) => s + (a.download_count || 0), 0),
          0,
        );
        setCount(DOWNLOAD_BASELINE + total);
      })
      .catch(() => {});   // เงียบถ้าดึงไม่ได้ (rate limit/ออฟไลน์) — ไม่โชว์ตัวเลข
  }, []);

  return (
    <section id="download" className="section" style={{ paddingTop: 0 }} aria-labelledby="download-title">
      <div className="wrap">
        <div className="pdf-download">
          <img src={ICON_SRC} alt="" width={72} height={72} />
          <h2 id="download-title">ดาวน์โหลด Bailan ฟรี</h2>
          <p>กดดาวน์โหลดได้เลย ไม่ต้องสมัครสมาชิก — โปรแกรมทำงานบนเครื่องคุณ ข้อมูลไม่อัปโหลดขึ้นเว็บ</p>
          <a className="btn btn-primary" href={DOWNLOAD_URL}>
            <Download className="w-5 h-5" /> ดาวน์โหลด Bailan{version ? ` ${version}` : ''} (.exe)
          </a>
          {count != null && (
            <div className="pdf-download-count">
              <Download className="w-4 h-4" />
              ดาวน์โหลดไปแล้ว <b>{count.toLocaleString('th-TH')}</b> ครั้ง
            </div>
          )}
          <small>Windows 10/11 · ขนาดประมาณ 190 MB · ฟรีไม่มีค่าใช้จ่าย</small>
        </div>
      </div>
    </section>
  );
}

// ── CTA back to marketplace (สไตล์ final-cta ของหน้าแรก) ─────────────────────
function MarketplaceCTA() {
  return (
    <section className="final-section" aria-labelledby="final-title">
      <div className="wrap">
        <div className="final-cta">
          <div>
            <div className="eyebrow">TNR MAPHUB MARKETPLACE</div>
            <h2 id="final-title">มีที่ดินอยากขาย? ลงประกาศฟรีบน TNR MapHub</h2>
            <p>แพลตฟอร์มซื้อขายที่ดินพร้อมระบบแผนที่ GIS — เจ้าของขายเอง ดูพิกัด ผังเมือง โฉนด และเปรียบเทียบราคาในที่เดียว</p>
          </div>
          <a className="btn" href={MAP_URL}>เปิดแผนที่ TNR MapHub <Icon name="i-arrow" /></a>
        </div>
      </div>
    </section>
  );
}
