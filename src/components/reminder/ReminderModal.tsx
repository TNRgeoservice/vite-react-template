// ════════════════════════════════════════
// src/components/reminder/ReminderModal.tsx
// Modal เลือกเวลาเตือน follow-up (Phase 2 #7)
// ════════════════════════════════════════
'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { presetToDate, type ReminderPreset } from '@/types/reminder';

interface Props {
  convoId: string;
  plotDocId: string;
  plotName: string;
  peerUid: string;
  peerName: string;
  onClose: () => void;
}

const presets: { id: ReminderPreset; label: string }[] = [
  { id: '1d', label: '1 วัน' },
  { id: '3d', label: '3 วัน' },
  { id: '7d', label: '1 สัปดาห์' },
  { id: 'custom', label: 'กำหนดเอง' },
];

export function ReminderModal({ convoId, plotDocId, plotName, peerUid, peerName, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const [preset, setPreset] = useState<ReminderPreset>('1d');
  const [customIso, setCustomIso] = useState<string>(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // format: yyyy-MM-ddThh:mm (local)
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    if (!user) { setErr('กรุณาเข้าสู่ระบบ'); return; }
    const when = presetToDate(preset, customIso);
    if (!when || !Number.isFinite(when.getTime())) {
      setErr('กรุณาเลือกเวลาให้ถูกต้อง');
      return;
    }
    if (when.getTime() <= Date.now()) {
      setErr('เวลาต้องเป็นอนาคต');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'reminders'), {
        ownerUid: user.uid,
        convoId,
        plotDocId,
        plotName,
        peerUid,
        peerName: peerName || '',
        scheduledAt: Timestamp.fromDate(when),
        note: note.trim(),
        sent: false,
        sentAt: null,
        cancelled: false,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1500,
        background: 'rgba(0,0,0,.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          background: '#111c2b', border: '1px solid #213045',
          borderRadius: 14, padding: 18, color: '#dce8f5',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
          ⏰ ตั้งเตือนคุยต่อ
        </div>
        <div style={{ fontSize: 11, color: '#7a9ab8', marginBottom: 14 }}>
          เตือนกลับมาคุยกับ {peerName || 'อีกฝ่าย'} เรื่อง {plotName}
        </div>

        {/* Preset chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
          {presets.map((p) => (
            <button key={p.id}
              onClick={() => setPreset(p.id)}
              style={{
                padding: '8px 4px', borderRadius: 8, fontSize: 12,
                border: '1px solid ' + (preset === p.id ? '#40c4ff' : '#213045'),
                background: preset === p.id ? '#0f2332' : '#0d1520',
                color: preset === p.id ? '#40c4ff' : '#dce8f5',
                cursor: 'pointer',
              }}
            >{p.label}</button>
          ))}
        </div>

        {preset === 'custom' && (
          <input
            type="datetime-local"
            value={customIso}
            onChange={(e) => setCustomIso(e.target.value)}
            style={{
              width: '100%', padding: '8px 10px', marginBottom: 12,
              borderRadius: 8, border: '1px solid #213045',
              background: '#0d1520', color: '#dce8f5', fontSize: 13,
              fontFamily: 'inherit',
            }}
          />
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="โน้ต (ไม่บังคับ) — เช่น 'ถามเรื่องราคาต่อรอง'"
          rows={2}
          maxLength={200}
          style={{
            width: '100%', padding: '8px 10px', marginBottom: 10,
            borderRadius: 8, border: '1px solid #213045',
            background: '#0d1520', color: '#dce8f5', fontSize: 13,
            fontFamily: 'inherit', resize: 'vertical',
          }}
        />

        {err && (
          <div style={{ color: '#ff5252', fontSize: 11, marginBottom: 8 }}>{err}</div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              border: '1px solid #213045', background: '#0d1520',
              color: '#7a9ab8', fontSize: 13, cursor: 'pointer',
            }}
          >ยกเลิก</button>
          <button
            onClick={save}
            disabled={saving}
            style={{
              flex: 1, padding: '10px', borderRadius: 8,
              border: 'none', background: '#40c4ff',
              color: '#0d1520', fontSize: 13, fontWeight: 700,
              cursor: saving ? 'default' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >{saving ? 'กำลังบันทึก...' : '✓ ตั้งเตือน'}</button>
        </div>
      </div>
    </div>
  );
}
