// ════════════════════════════════════════
// components/ui/Drawer.tsx
// Side drawer (slide from left, 295/85vw max 340)
// README §Drawer: logo chip (40×40 r=10–11) + wordmark header
// ════════════════════════════════════════
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { AuthBar } from '@/components/auth/AuthBar';
import { ImportExportPanel } from './ImportExportPanel';
import { DocumentsPanel } from './DocumentsPanel';
import { GovLayersPanel } from '@/components/map/GovLayersPanel';
import { InstallButton } from '@/components/pwa/InstallButton';
import { useUnreadDM } from '@/hooks/useUnreadDM';

const TOOLS_OPEN_KEY = 'tnr_drawer_tools_open';

export function Drawer() {
  const open = useUIStore((s) => s.drawerOpen);
  const setOpen = useUIStore((s) => s.setDrawerOpen);
  const user = useAuthStore((s) => s.user);
  const unreadDM = useUnreadDM();

  // จำสถานะ section "เครื่องมือ" ใน localStorage
  const [toolsOpen, setToolsOpen] = useState(false);
  useEffect(() => {
    try { setToolsOpen(localStorage.getItem(TOOLS_OPEN_KEY) === '1'); } catch {}
  }, []);
  const toggleTools = () => {
    setToolsOpen((v) => {
      const nv = !v;
      try { localStorage.setItem(TOOLS_OPEN_KEY, nv ? '1' : '0'); } catch {}
      return nv;
    });
  };

  return (
    <>
      {/* Mask — rgba(0,0,0,.5), slide+fade */}
      <div
        onClick={() => setOpen(false)}
        className={
          'fixed inset-0 z-[900] bg-black/50 ' +
          'transition-opacity duration-tnr-slow ease-tnr-ease ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
      />
      {/* Panel */}
      <aside
        className={
          'fixed left-0 top-0 z-[1000] w-[85vw] max-w-[340px] ' +
          'bg-bg text-tx shadow-modal ' +
          // ใช้ dvh กัน mobile browser bar กิน viewport + overflow scroll (ซ่อน scrollbar)
          'h-[100dvh] overflow-y-auto overscroll-contain scrollbar-hidden ' +
          'transition-transform duration-tnr-slow ease-tnr-ease ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header: logo chip + wordmark */}
        <div className="flex items-center gap-2.5 border-b border-brd px-4 py-3">
          <Image
            src="/icons/icon-192.png"
            alt="TNR"
            width={40}
            height={40}
            className="rounded-[10px]"
          />
          <div className="flex-1">
            <div className="text-md-t font-semibold tracking-[-0.2px]">TNR MapHub</div>
            <div className="font-mono text-xs-t text-txd">beta</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl leading-none text-tx2 active:opacity-[.78]"
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <AuthBar />

        {/* ── ส่วนตัว ── */}
        {user && (
          <nav className="border-t border-brd p-2 text-md-t">
            <SectionHeader>ส่วนตัว</SectionHeader>
            <NavLink href="/profile"   label="👤 โปรไฟล์ของฉัน" onClick={() => setOpen(false)} />
            <NavLink href="/inbox"     label="💬 กล่องข้อความ"  onClick={() => setOpen(false)} badge={unreadDM} />
            <NavLink href="/contacts"  label="👥 รายชื่อเพื่อน"  onClick={() => setOpen(false)} />
            <NavLink href="/favorites" label="❤️ รายการโปรด"    onClick={() => setOpen(false)} />
          </nav>
        )}

        {/* ── ขายที่ดิน ── */}
        <nav className="border-t border-brd p-2 text-md-t">
          <SectionHeader>ขายที่ดิน</SectionHeader>
          <NavLink href="/cards"    label="🗂 รายการที่ดิน"     onClick={() => setOpen(false)} />
          {user && (
            <>
              <NavLink href="/broker"   label="📊 Broker Dashboard" onClick={() => setOpen(false)} />
              <NavLink href="/pipeline" label="🗂 Pipeline ดีล"     onClick={() => setOpen(false)} />
            </>
          )}
          <NavLink href="/compare"  label="🔍 เปรียบเทียบ"        onClick={() => setOpen(false)} />
        </nav>

        {/* ── ซ้อนแผนที่ราชการ (collapse ในตัวเอง) ── */}
        <GovLayersPanel />

        {/* ── เครื่องมือ (collapsible) ── */}
        <div className="border-t border-brd">
          <button
            onClick={toggleTools}
            className="flex w-full items-center justify-between px-4 py-2.5 text-left
                       text-md-t font-semibold text-tx active:opacity-[.78]"
          >
            <span>🛠 เครื่องมือ</span>
            <span className="text-tx2">{toolsOpen ? '▾' : '▸'}</span>
          </button>
          {toolsOpen && (
            <>
              <nav className="border-t border-brd p-2 text-md-t">
                <NavLink href="/tools/depreciation" label="🧮 เครื่องคำนวณ" onClick={() => setOpen(false)} />
              </nav>
              <ImportExportPanel />
              <DocumentsPanel />
            </>
          )}
        </div>

        <div className="border-t border-brd p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <InstallButton />
        </div>
      </aside>
    </>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-txd">
      {children}
    </div>
  );
}

function NavLink({
  href, label, onClick, badge,
}: { href: string; label: string; onClick: () => void; badge?: number }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-md-t px-3 py-2 text-tx hover:bg-bg2
                 active:opacity-[.78] transition-colors duration-tnr-fast"
    >
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#ef4444] px-1.5 text-[10px] font-bold leading-5 text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </Link>
  );
}
