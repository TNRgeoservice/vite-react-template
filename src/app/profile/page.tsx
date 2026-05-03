// ════════════════════════════════════════
// src/app/profile/page.tsx
// My profile — avatar + displayName + phone + line + my listings + reminders
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref as sref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import type { PlotPoint } from '@/types/plot';
import { ReminderList } from '@/components/reminder/ReminderList';
import { SavedSearchList } from '@/components/search/SavedSearchList';
import { ProximityToggle } from '@/components/proximity/ProximityToggle';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.ready);
  const role = useAuthStore((s) => s.role);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [avatarUrl, setAvatarUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [bio, setBio] = useState('');

  const [myPlots, setMyPlots] = useState<PlotPoint[]>([]);

  // Load profile
  useEffect(() => {
    if (!ready) return;
    if (!user) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const d = snap.exists() ? snap.data() : {};
        setAvatarUrl(d.avatarUrl || user.photoURL || '');
        setDisplayName(d.displayName || user.displayName || '');
        setPhone(d.phone || '');
        setLineId(d.lineId || '');
        setBio(d.bio || '');

        const q = query(
          collection(db, 'fieldsurvey_points'),
          where('ownerUid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20),
        );
        const plotSnap = await getDocs(q);
        setMyPlots(plotSnap.docs.map(d => ({ id: d.id, ...d.data() } as PlotPoint)));
      } catch (e) {
        console.warn('[profile load]', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, ready]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { alert('รูปต้องไม่เกิน 2MB'); return; }
    try {
      setMsg('⏳ กำลังอัปโหลด...');
      const r = sref(storage, `avatars/${user.uid}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      await setDoc(doc(db, 'users', user.uid), { avatarUrl: url }, { merge: true });
      await updateProfile(user, { photoURL: url });
      setAvatarUrl(url);
      setMsg('✅ อัปโหลดสำเร็จ');
      setTimeout(() => setMsg(''), 3000);
    } catch (err: unknown) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ'));
    }
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        phone: phone.trim(),
        lineId: lineId.trim(),
        bio: bio.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      if (displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
      }
      setMsg('✅ บันทึกสำเร็จ');
      setTimeout(() => setMsg(''), 3000);
    } catch (e: unknown) {
      setMsg('❌ ' + (e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ'));
    } finally {
      setSaving(false);
    }
  }

  if (!ready || loading) {
    return <div className="p-10 text-center text-[#7a9ab8]">กำลังโหลด...</div>;
  }
  if (!user) {
    return (
      <div className="p-10 text-center text-[#7a9ab8]">
        กรุณาเข้าสู่ระบบก่อน —{' '}
        <Link href="/" className="text-[#40c4ff] underline">กลับหน้าหลัก</Link>
      </div>
    );
  }

  const initial = (displayName || user.email || '?')[0].toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 text-[#dce8f5]">
      <Link href="/" className="text-xs text-[#7a9ab8]">← กลับหน้าแผนที่</Link>
      <h1 className="mt-2 mb-5 text-xl font-bold">👤 โปรไฟล์ของฉัน</h1>

      {/* Avatar */}
      <div className="mb-5 flex items-center gap-4 rounded-xl border border-[#213045] bg-[#162030] p-4">
        <div className="relative h-20 w-20 shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#213045] text-2xl font-bold">
              {initial}
            </div>
          )}
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#40c4ff] p-1 text-xs text-[#0d1520]">
            📷
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{displayName || '(ยังไม่ระบุชื่อ)'}</div>
          <div className="truncate text-xs text-[#7a9ab8]">{user.email}</div>
          <span className="mt-1 inline-block rounded-full bg-[#213045] px-2 py-0.5 text-[10px]">{role}</span>
        </div>
      </div>

      {/* Form */}
      <div className="mb-5 space-y-3 rounded-xl border border-[#213045] bg-[#162030] p-4">
        <Field label="ชื่อแสดง">
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            placeholder="ชื่อ-นามสกุล / ชื่อบริษัท" className={inpCls} />
        </Field>
        <Field label="เบอร์โทรศัพท์">
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            type="tel" placeholder="0xx-xxx-xxxx" className={inpCls} />
        </Field>
        <Field label="Line ID">
          <input value={lineId} onChange={(e) => setLineId(e.target.value)}
            placeholder="@yourlineid" className={inpCls} />
        </Field>
        <Field label="สายงาน / ตำแหน่ง">
          <input value={bio} onChange={(e) => setBio(e.target.value)}
            placeholder="เช่น นายหน้า, เจ้าของที่ดิน" className={inpCls} />
        </Field>

        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-lg bg-[#00e676] py-2.5 font-semibold text-[#001a0a] disabled:opacity-50">
          {saving ? 'กำลังบันทึก...' : '💾 บันทึกโปรไฟล์'}
        </button>
        {msg && <div className="text-center text-xs">{msg}</div>}
      </div>

      {/* My Listings */}
      <div className="mb-3 text-sm font-semibold">📍 รายการที่ดินของฉัน ({myPlots.length})</div>
      {myPlots.length === 0 ? (
        <div className="rounded-xl border border-[#213045] bg-[#162030] p-6 text-center text-xs text-[#7a9ab8]">
          ยังไม่มีรายการ
        </div>
      ) : (
        <div className="space-y-2">
          {myPlots.map((p) => {
            const area = p.areaSqm != null
              ? (Number(p.areaSqm) >= 1600 ? (Number(p.areaSqm)/1600).toFixed(2)+' ไร่' : Number(p.areaSqm).toFixed(0)+' ตร.ม.')
              : '—';
            const price = p.priceTotal != null
              ? '฿'+Number(p.priceTotal).toLocaleString('th-TH')
              : '—';
            const thumb = p.photoUrls?.[0] || p.photos?.[0];
            return (
              <Link key={p.id} href={`/plot/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-[#213045] bg-[#162030] p-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#213045]">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🏞️</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {p.name || 'ที่ดิน'} {p.isFeatured && <span className="ml-1 text-xs">⭐</span>}
                  </div>
                  <div className="text-xs text-[#7a9ab8]">{area} · {price}</div>
                  <div className="truncate text-xs text-[#7a9ab8]">
                    {[p.tambon, p.amphoe, p.province].filter(Boolean).join(' ')}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Saved searches */}
      <div className="mt-6">
        <div className="mb-3 text-sm font-semibold">🔔 การค้นหาที่บันทึก</div>
        <SavedSearchList />
      </div>

      {/* Proximity GPS toggle */}
      <div className="mt-6">
        <ProximityToggle />
      </div>

      {/* Reminders */}
      <div className="mt-6">
        <ReminderList />
      </div>
    </div>
  );
}

const inpCls = 'w-full rounded-lg border border-[#213045] bg-[#0d1520] px-3 py-2 text-sm text-[#dce8f5] focus:border-[#40c4ff] focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-[#7a9ab8]">{label}</span>
      {children}
    </label>
  );
}
