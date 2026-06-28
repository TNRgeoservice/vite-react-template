// ════════════════════════════════════════
// src/pages/PdfStudioPage.tsx  — หน้า /tnrpdfstudio
// Landing + lead magnet สำหรับ TNR PDF Studio (.exe ฟรี)
// flow: intro/ฟีเจอร์ → login (เก็บ lead ลง Firestore) → ปุ่มโหลด → CTA marketplace
// SSR-safe: อ้าง firebase เฉพาะใน useEffect / event handler (auth/db = undefined ตอน prerender)
// ════════════════════════════════════════
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Download, ShieldCheck, ScanLine, Stamp, Eraser,
  Layers, Combine, Languages, LogIn, ArrowRight, Map, Tag, Check, LogOut,
} from 'lucide-react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/fb';

// ── ตั้งค่า ────────────────────────────────────────────────────────────────
// TODO: ใส่ลิงก์ไฟล์ .exe เมื่อ host แล้ว (R2 / GitHub Releases) — ดู memory pdfeditor
const DOWNLOAD_URL = '';            // ว่าง = ยังไม่ host → ปุ่มจะเก็บ lead ไว้ + ขึ้น "เร็วๆ นี้"
const LEAD_COL = 'pdfstudio_leads'; // ⚠️ ต้องตั้ง Firestore rules ให้ผู้ใช้ที่ล็อกอินเขียน doc ของตัวเองได้
const MAP_URL = 'https://map.tnrmaphub.com';

const ERR_MAP: Record<string, string> = {
  'auth/user-not-found':       'ไม่พบบัญชีนี้',
  'auth/wrong-password':       'รหัสผ่านไม่ถูกต้อง',
  'auth/invalid-credential':   'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/email-already-in-use': 'อีเมลนี้ถูกใช้แล้ว ลองเข้าสู่ระบบ',
  'auth/weak-password':        'รหัสผ่านต้องมีอย่างน้อย 6 ตัว',
  'auth/invalid-email':        'รูปแบบอีเมลไม่ถูกต้อง',
};

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

export function PdfStudioPage() {
  const [user, setUser]   = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = 'TNR PDF Studio — โปรแกรมแก้ PDF โฉนด/เอกสารที่ดิน ฟรี | TNR MapHub';
    if (!auth) { setReady(true); return; }
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      <Header />
      <Hero />
      <Features />
      <DownloadSection user={user} ready={ready} />
      <MarketplaceCTA />
      <Footer />
    </div>
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

        {/* ภาพหน้าจอโปรแกรม (placeholder — ผู้ใช้จะแคปภาพมาใส่ทีหลัง) */}
        <ScreenshotSlot label="ภาพหน้าจอโปรแกรม TNR PDF Studio" ratio="16 / 10" />
      </div>
    </section>
  );
}

// ── กล่อง placeholder สำหรับภาพ (ผู้ใช้จะแทนด้วยภาพจริง) ──────────────────────
function ScreenshotSlot({ label, ratio = '16 / 9' }: { label: string; ratio?: string }) {
  return (
    <div
      className="w-full rounded-2xl border border-dashed border-[var(--brd)] bg-[var(--bg2)] flex flex-col items-center justify-center text-center p-6"
      style={{ aspectRatio: ratio }}
    >
      <FileText className="w-10 h-10 text-[var(--txd)] mb-3" />
      <span className="text-sm text-[var(--tx2)]">{label}</span>
      <span className="text-xs text-[var(--txd)] mt-1">เร็วๆ นี้</span>
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

        {/* แถวภาพตัวอย่างการใช้งาน (placeholder) */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <ScreenshotSlot label="ตัวอย่าง: ลบ/แก้ข้อความบนโฉนดสแกน" />
          <ScreenshotSlot label="ตัวอย่าง: ใส่ลายน้ำ + ปกปิดข้อมูล" />
        </div>
      </div>
    </section>
  );
}

// ── Download (login gate + lead capture) ────────────────────────────────────
function DownloadSection({ user, ready }: { user: User | null; ready: boolean }) {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">ดาวน์โหลดฟรี</h2>
          <p className="text-[var(--tx2)]">
            เข้าสู่ระบบด้วยอีเมลเพื่อรับลิงก์ดาวน์โหลด — บัญชีเดียวใช้ได้ทั้งโปรแกรมและแผนที่ TNR MapHub
          </p>
        </div>

        <div className="bg-[var(--bg2)] border border-[var(--brd)] rounded-2xl p-6 sm:p-8">
          {!ready ? (
            <div className="text-center text-[var(--tx2)] py-6">กำลังโหลด…</div>
          ) : user ? (
            <DownloadReady user={user} />
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
    </section>
  );
}

function DownloadReady({ user }: { user: User }) {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function logLead() {
    if (!db) return;
    try {
      await setDoc(doc(db, LEAD_COL, user.uid), {
        uid: user.uid,
        email: user.email ?? '',
        source: 'tnrpdfstudio',
        downloadAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      // เก็บ lead ไม่ได้ (เช่น rules ยังไม่เปิด) — ไม่บล็อกการโหลด
      console.warn('lead log failed', e);
    }
  }

  async function handleDownload() {
    setBusy(true);
    await logLead();
    setBusy(false);
    if (DOWNLOAD_URL) {
      window.location.href = DOWNLOAD_URL;
    } else {
      setMsg('บันทึกอีเมลของคุณไว้แล้ว ✓ ไฟล์ดาวน์โหลดกำลังเตรียมพร้อม — เราจะแจ้งทางอีเมลเมื่อพร้อมให้โหลด');
    }
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--acc)]/10 border border-[var(--acc)]/30 mb-5">
        <Check className="w-4 h-4 text-[var(--acc)]" />
        <span className="text-sm text-[var(--acc)]">เข้าสู่ระบบแล้ว · {user.email}</span>
      </div>
      <button
        onClick={handleDownload}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-lg font-semibold hover:bg-[var(--acc2)] transition-all disabled:opacity-60"
      >
        <Download className="w-5 h-5" />
        {busy ? 'กำลังเตรียม…' : 'ดาวน์โหลด TNR PDF Studio (.exe)'}
      </button>
      <p className="text-xs text-[var(--txd)] mt-3">Windows 10/11 · ขนาดประมาณ 150 MB · ฟรีไม่มีค่าใช้จ่าย</p>
      {msg && <p className="mt-4 text-sm text-[var(--land)]">{msg}</p>}
      <button onClick={() => auth && signOut(auth)} className="mt-5 inline-flex items-center gap-1.5 text-xs text-[var(--tx2)] hover:text-[var(--tx)]">
        <LogOut className="w-3.5 h-3.5" /> ออกจากระบบ
      </button>
    </div>
  );
}

function AuthForm() {
  const [tab, setTab]     = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const isReg = tab === 'register';

  async function submit() {
    if (!auth || !db) { setErr('ระบบยังไม่พร้อม ลองรีเฟรชหน้า'); return; }
    if (!email || !pw) { setErr('กรุณากรอกอีเมลและรหัสผ่าน'); return; }
    setBusy(true); setErr('');
    try {
      if (isReg) {
        const cred = await createUserWithEmailAndPassword(auth, email, pw);
        // สร้าง user doc (เหมือน flow สมัครของ map.tnrmaphub.com)
        await setDoc(doc(db, 'users', cred.user.uid), {
          email, role: 'user', createdAt: Date.now(),
          displayName: '', phone: '', lineId: '', bio: '',
        }, { merge: true });
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
      // onAuthStateChanged ใน parent จะสลับไปหน้าโหลดเอง
    } catch (e) {
      const code = e instanceof FirebaseError ? e.code : '';
      setErr(ERR_MAP[code] || (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex gap-2">
        <TabBtn active={!isReg} onClick={() => { setTab('login'); setErr(''); }}>เข้าสู่ระบบ</TabBtn>
        <TabBtn active={isReg} onClick={() => { setTab('register'); setErr(''); }}>สมัครสมาชิก</TabBtn>
      </div>

      <label className="block text-sm text-[var(--tx2)] mb-1">อีเมล</label>
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        className="w-full mb-3 px-3 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--brd)] text-[var(--tx)] outline-none focus:border-[var(--acc)] transition-colors"
      />
      <label className="block text-sm text-[var(--tx2)] mb-1">รหัสผ่าน</label>
      <input
        type="password" value={pw} onChange={(e) => setPw(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="••••••"
        className="w-full mb-2 px-3 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--brd)] text-[var(--tx)] outline-none focus:border-[var(--acc)] transition-colors"
      />

      {err && <div className="mt-2 mb-1 text-sm text-[var(--red)]">{err}</div>}

      <button
        onClick={submit} disabled={busy}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all disabled:opacity-60"
      >
        <LogIn className="w-5 h-5" />
        {busy ? 'กำลังดำเนินการ…' : isReg ? 'สมัครแล้วรับลิงก์โหลด' : 'เข้าสู่ระบบรับลิงก์โหลด'}
      </button>
      <p className="text-xs text-[var(--txd)] mt-3 text-center">
        การเข้าสู่ระบบถือว่ายอมรับให้เราติดต่อกลับเรื่องบริการที่ดินของ TNR MapHub
      </p>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={'flex-1 rounded-lg py-2 text-sm font-medium transition-colors ' +
        (active ? 'bg-[var(--acc)] text-[var(--bg)]' : 'bg-[var(--bg)] text-[var(--tx2)] border border-[var(--brd)]')}
    >
      {children}
    </button>
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
