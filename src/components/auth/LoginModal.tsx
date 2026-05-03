// ════════════════════════════════════════
// components/auth/LoginModal.tsx
// Login / Signup bottom-style modal (README §Bottom sheets/Modals)
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { fsSet } from '@/lib/firestore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';

const ERR_MAP: Record<string, string> = {
  'auth/user-not-found':      'ไม่พบบัญชีนี้',
  'auth/wrong-password':      'รหัสผ่านไม่ถูกต้อง',
  'auth/invalid-credential':  'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/email-already-in-use':'อีเมลนี้ถูกใช้แล้ว',
  'auth/weak-password':       'รหัสผ่านต้องมีอย่างน้อย 6 ตัว',
  'auth/invalid-email':       'รูปแบบอีเมลไม่ถูกต้อง',
};

export function LoginModal() {
  const open = useUIStore((s) => s.loginOpen);
  const setOpen = useUIStore((s) => s.setLoginOpen);
  const [tab, setTab]     = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  if (!open) return null;

  const isReg = tab === 'register';

  async function submit() {
    if (!email || !pw) {
      setErr('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      if (isReg) {
        const cred = await createUserWithEmailAndPassword(auth, email, pw);
        await fsSet('users', cred.user.uid, {
          email,
          role: 'user',
          createdAt: Date.now(),
          displayName: '',
          phone: '',
          lineId: '',
          bio: '',
        });
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
      setOpen(false);
      setEmail('');
      setPw('');
    } catch (e) {
      const code = e instanceof FirebaseError ? e.code : '';
      setErr(ERR_MAP[code] || (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/60 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl-t bg-bg2 p-5 text-tx shadow-modal
                   border-[1.5px] border-brd"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Segmented tabs — chip-style, active = acc border + tint */}
        <div className="mb-4 flex gap-2">
          <TabButton active={!isReg} onClick={() => setTab('login')}>
            เข้าสู่ระบบ
          </TabButton>
          <TabButton active={isReg} onClick={() => setTab('register')}>
            สมัครสมาชิก
          </TabButton>
        </div>

        <div className="space-y-3">
          <Field
            label="อีเมล"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="รหัสผ่าน"
            type="password"
            placeholder="••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>

        {err && <div className="mt-3 text-body-t text-red">{err}</div>}

        <div className="mt-4 space-y-2">
          <Button
            onClick={submit}
            disabled={busy}
            className="w-full"
          >
            {busy ? '⏳ กำลังดำเนินการ...' : isReg ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'flex-1 rounded-md-t py-2 text-md-t font-medium ' +
        'transition-colors duration-tnr-fast ease-tnr-ease ' +
        'active:opacity-[.78] ' +
        (active
          ? 'bg-acc text-[#001a0a]'
          : 'bg-bg3 text-tx2 border-[1.5px] border-brd')
      }
    >
      {children}
    </button>
  );
}
