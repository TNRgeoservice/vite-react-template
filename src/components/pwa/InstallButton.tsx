'use client';

// ════════════════════════════════════════
// PWA install button — โผล่ใน Drawer
// - Android/Chrome: capture beforeinstallprompt → ปุ่ม "📲 ติดตั้งแอป"
// - iOS Safari: แสดงคำแนะนำ "Share → Add to Home Screen" (ไม่มี API)
// - Already installed (display-mode: standalone): ซ่อน
// ════════════════════════════════════════
import { useEffect, useState } from 'react';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    // ตรวจ standalone
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) { setInstalled(true); return; }

    // ตรวจ iOS
    const ua = navigator.userAgent || '';
    const ios = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window);
    setIsIOS(ios);

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };

    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  // Android/desktop Chrome — มี deferred event
  if (deferred) {
    return (
      <button
        onClick={async () => {
          await deferred.prompt();
          const { outcome } = await deferred.userChoice;
          if (outcome === 'accepted') setDeferred(null);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-md-t border border-acc bg-[#0d2a1f] px-3 py-2 text-md-t font-semibold text-acc active:opacity-[.78]"
      >
        📲 ติดตั้งแอปลงเครื่อง
      </button>
    );
  }

  // iOS — manual instruction
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSHelp(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md-t border border-brd bg-bg2 px-3 py-2 text-md-t text-tx active:opacity-[.78]"
        >
          📲 ติดตั้งแอปลงเครื่อง
        </button>
        {showIOSHelp && (
          <div
            onClick={() => setShowIOSHelp(false)}
            className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl border border-brd bg-bg1 p-5 text-tx shadow-xl"
            >
              <div className="mb-3 text-lg font-semibold">ติดตั้งบน iPhone / iPad</div>
              <ol className="ml-5 list-decimal space-y-2 text-md-t leading-6">
                <li>กดปุ่ม <b>Share</b> (สี่เหลี่ยมลูกศรขึ้น) ที่ด้านล่างของ Safari</li>
                <li>เลื่อนหา <b>“Add to Home Screen”</b> หรือ <b>“เพิ่มที่หน้าจอโฮม”</b></li>
                <li>กด <b>Add</b> มุมขวาบน → ไอคอน TNR MapHub จะอยู่ที่หน้าโฮม</li>
              </ol>
              <button
                onClick={() => setShowIOSHelp(false)}
                className="mt-4 w-full rounded-md-t bg-acc px-3 py-2 font-semibold text-[#001a0a]"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
