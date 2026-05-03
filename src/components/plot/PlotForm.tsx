// ════════════════════════════════════════
// components/plot/PlotForm.tsx
// Add/Edit plot modal — port ของ legacy savePoint() + populateForm() + deletePoint()
// ════════════════════════════════════════
'use client';

import { useEffect, useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { fsSet, fsDelete, TS, COL } from '@/lib/firestore';
import { useUIStore, type EditingPlot } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { applyWatermark } from '@/lib/watermark';
import { PhotoGallery } from './PhotoGallery';
import type { PlotPoint } from '@/types/plot';
import type { BuildingInfo } from '@/types/building';
import { Button } from '@/components/ui/Button';
import { rnwToSqm, sqmToRNW, sqmToWa } from '@/lib/rai';
import { getLocCode, listProvinces, listAmphoes, listTambons } from '@/lib/loc-codes';
import { BuildingsSection } from '@/components/building/BuildingsSection';
import { buildRevisionsUpdate } from '@/lib/revisions';
import { reverseGeocode } from '@/lib/geocode';
import { LocationAutocomplete } from './LocationAutocomplete';

/** #19 fields ที่ track ใน revisions — ทุก field ที่แก้ใน PlotForm (ยกเว้น status — track ที่ปุ่ม cycle) */
const TRACKED_FIELDS = [
  'name', 'lat', 'lng', 'areaSqm', 'priceTotal',
  'province', 'amphoe', 'tambon', 'locCode',
  'titleType', 'zoning', 'roadAcc', 'landmark',
  'notes', 'hasWater', 'hasElectricity',
];

interface FormFields {
  name:       string;
  lat:        string;
  lng:        string;
  // Area: user enters ไร่/งาน/วา. For polygon, computed ตร.วา is shown (derived, not stored directly).
  rai:        string;
  ngan:       string;
  wa:         string;
  priceTotal: string;
  province:   string;
  amphoe:     string;
  tambon:     string;
  locCode:    string;
  titleType:  string;
  zoning:     string;
  roadAcc:    string;
  landmark:   string;
  notes:      string;
  hasWater:        boolean;
  hasElectricity:  boolean;
}

const EMPTY: FormFields = {
  name: '', lat: '', lng: '',
  rai: '', ngan: '', wa: '',
  priceTotal: '',
  province: '', amphoe: '', tambon: '', locCode: '',
  titleType: '', zoning: '', roadAcc: '', landmark: '',
  notes: '',
  hasWater: true,        // default มีน้ำ
  hasElectricity: true,  // default มีไฟ
};

/** Format a number for an input: '' when falsy, else trimmed */
const numStr = (n: number | null | undefined, fixed?: number) => {
  if (n == null || !Number.isFinite(n) || n === 0) return n === 0 ? '0' : '';
  return fixed != null ? n.toFixed(fixed) : String(n);
};

function fromTarget(t: EditingPlot): { fields: FormFields; existingPhotos: string[]; buildings: BuildingInfo[] } {
  if (t.mode === 'edit') {
    const p = t.plot;
    const sqm = typeof p.areaSqm === 'string' ? parseFloat(p.areaSqm) : p.areaSqm;
    const rnw = sqm != null && Number.isFinite(sqm) ? sqmToRNW(sqm) : { rai: 0, ngan: 0, wa: 0 };
    return {
      fields: {
        name:       p.name || '',
        lat:        p.lat != null ? String(p.lat) : '',
        lng:        p.lng != null ? String(p.lng) : '',
        rai:        rnw.rai  ? String(rnw.rai)  : '',
        ngan:       rnw.ngan ? String(rnw.ngan) : '',
        wa:         rnw.wa   ? String(rnw.wa)   : '',
        priceTotal: p.priceTotal != null ? String(p.priceTotal) : '',
        province:   p.province || '',
        amphoe:     p.amphoe || '',
        tambon:     p.tambon || '',
        locCode:    p.locCode || '',
        titleType:  p.titleType || '',
        zoning:     p.zoning || '',
        roadAcc:    p.roadAcc || '',
        landmark:   p.landmark || '',
        notes:      p.notes || '',
        hasWater:        p.hasWater       !== false, // undefined → true (legacy)
        hasElectricity:  p.hasElectricity !== false,
      },
      existingPhotos: [...(p.photos || []), ...(p.photoUrls || [])],
      buildings: p.buildings || [],
    };
  }
  // create — prefill ไร่/งาน/วา from computed polygon area if present
  const sqm = t.areaSqm;
  const rnw = sqm != null && Number.isFinite(sqm) ? sqmToRNW(sqm) : { rai: 0, ngan: 0, wa: 0 };
  return {
    fields: {
      ...EMPTY,
      lat:  t.lat.toFixed(6),
      lng:  t.lng.toFixed(6),
      rai:  numStr(rnw.rai),
      ngan: numStr(rnw.ngan),
      wa:   numStr(rnw.wa, 2),
    },
    existingPhotos: [],
    buildings: [],
  };
}

export function PlotForm() {
  const target = useUIStore((s) => s.editingPlot);
  const setTarget = useUIStore((s) => s.setEditingPlot);
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);

  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [buildings, setBuildings] = useState<BuildingInfo[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [geoMsg, setGeoMsg] = useState('');

  // Populate when target opens
  useEffect(() => {
    if (!target) return;
    const { fields, existingPhotos, buildings } = fromTarget(target);
    setFields(fields);
    setExistingPhotos(existingPhotos);
    setBuildings(buildings);
    setPendingFiles([]);
    setErr('');
    setGeoMsg('');

    // Auto reverse-geocode ทันทีเมื่อเปิดฟอร์ม ถ้า:
    //  - มี lat/lng
    //  - ยังไม่มี จ./อ./ต. (ไม่ทับของเดิมตอน edit)
    const lat = parseFloat(fields.lat);
    const lng = parseFloat(fields.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng) && !fields.province && !fields.amphoe && !fields.tambon) {
      setGeocoding(true);
      reverseGeocode(lat, lng)
        .then((r) => {
          if (!r.province && !r.amphoe && !r.tambon) {
            setGeoMsg('ไม่พบที่ตั้งอัตโนมัติ — กรุณากรอกเอง');
            return;
          }
          setFields((f) => {
            const next = {
              ...f,
              province: r.province || f.province,
              amphoe:   r.amphoe   || f.amphoe,
              tambon:   r.tambon   || f.tambon,
            };
            const code = getLocCode(next.province, next.amphoe, next.tambon);
            if (code) next.locCode = code;
            return next;
          });
          setGeoMsg(`✓ ดึงจาก ${r.source === 'longdo' ? 'LongDo' : 'OSM'}`);
        })
        .finally(() => setGeocoding(false));
    }
  }, [target]);

  if (!target) return null;
  const isEdit = target.mode === 'edit';
  const isPolygon =
    (target.mode === 'create' && target.type === 'polygon') ||
    (target.mode === 'edit' && target.plot.type === 'polygon');

  // Resolve computed area for polygon mode (ตร.ว. readonly)
  const polyAreaSqm =
    target.mode === 'create' && target.type === 'polygon' ? target.areaSqm ?? null :
    target.mode === 'edit'   && target.plot.type === 'polygon'
      ? (typeof target.plot.areaSqm === 'string' ? parseFloat(target.plot.areaSqm) : target.plot.areaSqm) ?? null
      : null;
  const polyAreaWa = polyAreaSqm != null ? sqmToWa(polyAreaSqm) : null;

  // Permission check for edit/delete
  const canModify =
    !isEdit ||
    (target.mode === 'edit' &&
      (target.plot.ownerUid === user?.uid || role === 'admin' || role === 'editor'));

  const update = <K extends keyof FormFields>(k: K, v: FormFields[K]) =>
    setFields((f) => {
      const next = { ...f, [k]: v };
      // ถ้าเปลี่ยน province → reset อำเภอ/ตำบล (ไม่ valid อีกแล้ว)
      if (k === 'province' && v !== f.province) {
        next.amphoe = ''; next.tambon = '';
      }
      // ถ้าเปลี่ยน amphoe → reset ตำบล
      if (k === 'amphoe' && v !== f.amphoe) {
        next.tambon = '';
      }
      // Auto-fill locCode เมื่อ province/amphoe/tambon เปลี่ยน
      if (k === 'province' || k === 'amphoe' || k === 'tambon') {
        const code = getLocCode(next.province, next.amphoe, next.tambon);
        if (code) next.locCode = code;
      }
      return next;
    });

  async function handleSave() {
    if (!user) { setLoginOpen(true); return; }
    if (!target) return;
    const t = target;
    setBusy(true);
    setErr('');
    try {
      const id = t.mode === 'edit' ? t.plot.id : String(Date.now());

      const uploadedUrls: string[] = [];
      for (const f of pendingFiles) {
        try {
          const wm = await applyWatermark(f);
          const path = `plots/${id}/${Date.now()}_${f.name}`;
          const r = storageRef(storage, path);
          await uploadBytes(r, wm, { contentType: 'image/jpeg' });
          uploadedUrls.push(await getDownloadURL(r));
        } catch (e) {
          console.warn('[PlotForm] upload error:', e);
        }
      }

      const lat = parseFloat(fields.lat);
      const lng = parseFloat(fields.lng);

      // Polygon → use computed polyAreaSqm (authoritative, comes from map)
      // Point    → derive from ไร่/งาน/วา inputs
      const entryType = t.mode === 'edit' ? t.plot.type : t.type;
      let finalAreaSqm: number | null = null;
      if (entryType === 'polygon') {
        finalAreaSqm = polyAreaSqm ?? null;
      } else {
        const derived = rnwToSqm({
          rai:  parseFloat(fields.rai)  || 0,
          ngan: parseFloat(fields.ngan) || 0,
          wa:   parseFloat(fields.wa)   || 0,
        });
        finalAreaSqm = derived > 0 ? derived : null;
      }

      // คำนวณ derived values สำหรับสิ่งปลูกสร้าง + ราคาที่ดินสุทธิต่อ ตร.วา
      const priceTotalNum = fields.priceTotal ? parseFloat(fields.priceTotal) : null;
      const buildingValueTotal = buildings.length > 0
        ? buildings.reduce((sum, b) => sum + (b.netValue || 0), 0)
        : null;
      let landPricePerSqWa: number | null = null;
      if (priceTotalNum != null && finalAreaSqm != null && finalAreaSqm > 0) {
        const landValue = priceTotalNum - (buildingValueTotal ?? 0);
        const areaWa = finalAreaSqm / 4; // 1 ตร.วา = 4 ตร.ม.
        landPricePerSqWa = areaWa > 0 ? Math.round((landValue / areaWa) * 100) / 100 : null;
      }

      // #19: status ไม่ได้แก้ผ่านฟอร์มแล้ว
      //  - create: fix 'available'
      //  - edit:   คงค่าเดิม (closeType ก็คงเดิม — แก้ผ่านปุ่ม cycle เท่านั้น)
      const finalStatus = t.mode === 'edit' ? (t.plot.status || 'available') : 'available';

      const newCore = {
        name:       fields.name.trim(),
        lat:        Number.isFinite(lat) ? lat : null,
        lng:        Number.isFinite(lng) ? lng : null,
        areaSqm:    finalAreaSqm,
        priceTotal: priceTotalNum,
        province:   fields.province.trim() || null,
        amphoe:     fields.amphoe.trim()   || null,
        tambon:     fields.tambon.trim()   || null,
        locCode:    fields.locCode.trim()  || null,
        titleType:  fields.titleType       || null,
        zoning:     fields.zoning          || null,
        roadAcc:    fields.roadAcc         || null,
        landmark:   fields.landmark.trim() || null,
        notes:      fields.notes.trim()    || null,
        hasWater:        fields.hasWater,
        hasElectricity:  fields.hasElectricity,
      };

      // #19 Diff revisions (เฉพาะ edit mode — create ไม่มีของเดิมให้เทียบ)
      let revisionsUpdate: Record<string, any> | undefined;
      if (t.mode === 'edit') {
        const oldCore: Record<string, any> = {
          name:       t.plot.name ?? null,
          lat:        t.plot.lat ?? null,
          lng:        t.plot.lng ?? null,
          areaSqm:    typeof t.plot.areaSqm === 'string' ? parseFloat(t.plot.areaSqm) : (t.plot.areaSqm ?? null),
          priceTotal: typeof t.plot.priceTotal === 'string' ? parseFloat(t.plot.priceTotal) : (t.plot.priceTotal ?? null),
          province:   t.plot.province ?? null,
          amphoe:     t.plot.amphoe ?? null,
          tambon:     t.plot.tambon ?? null,
          locCode:    t.plot.locCode ?? null,
          titleType:  t.plot.titleType ?? null,
          zoning:     t.plot.zoning ?? null,
          roadAcc:    t.plot.roadAcc ?? null,
          landmark:   t.plot.landmark ?? null,
          notes:      t.plot.notes ?? null,
          hasWater:        t.plot.hasWater       !== false,
          hasElectricity:  t.plot.hasElectricity !== false,
        };
        revisionsUpdate = buildRevisionsUpdate(
          oldCore,
          newCore,
          t.plot.revisions ?? null,
          TRACKED_FIELDS,
        );
      }

      const data: Partial<PlotPoint> & Record<string, unknown> = {
        id,
        type:       entryType,
        ...newCore,
        status:     finalStatus,
        photos:     [...existingPhotos, ...uploadedUrls],
        ownerUid:   t.mode === 'edit' ? t.plot.ownerUid : user.uid,
        buildings:  buildings.length > 0 ? buildings : null,
        buildingValueTotal,
        landPricePerSqWa,
        updatedAt:  TS(),
      };
      if (revisionsUpdate) data.revisions = revisionsUpdate;
      if (t.mode === 'create') data.createdAt = TS();

      if (t.mode === 'create' && t.polygon) {
        data.polygon = t.polygon;
      } else if (t.mode === 'edit' && t.plot.polygon) {
        data.polygon = t.plot.polygon;
      }

      await fsSet(COL, id, data, true);
      setTarget(null);
    } catch (e) {
      setErr((e as Error).message || 'บันทึกไม่สำเร็จ');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!target || target.mode !== 'edit') return;
    const plot = target.plot;
    if (!confirm(`ลบ "${plot.name || 'ที่ดินนี้'}" ?`)) return;
    setBusy(true);
    try {
      await fsDelete(COL, plot.id);
      setTarget(null);
    } catch (e) {
      setErr((e as Error).message || 'ลบไม่สำเร็จ');
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-3"
      onClick={() => !busy && setTarget(null)}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto scrollbar-hidden
                   rounded-2xl-t bg-bg2 p-4 text-tx
                   border-[1.5px] border-brd shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-md-t font-semibold tracking-[-0.2px]">
            {isEdit ? '✏️ แก้ไขที่ดิน' : '➕ เพิ่มที่ดินใหม่'}
          </h2>
          <button
            onClick={() => !busy && setTarget(null)}
            className="text-xl text-tx2 active:opacity-[.78]"
          >
            ×
          </button>
        </div>

        {!canModify && (
          <div className="mb-3 rounded-md-t border-[1.5px] border-[rgba(255,82,82,.3)]
                          bg-[rgba(255,82,82,.1)] p-2 text-xs-t text-red">
            คุณไม่มีสิทธิ์แก้ไขรายการนี้ (เป็นของผู้ใช้อื่น)
          </div>
        )}

        <div className="space-y-2">
          {/* 1. ชื่อ */}
          <PlotField label="ชื่อ" value={fields.name} onChange={(v) => update('name', v)} />

          {/* 2. ราคาขาย */}
          <PlotField
            label="ราคาขายรวม (฿)"
            value={fields.priceTotal}
            onChange={(v) => update('priceTotal', v)}
            type="number"
          />

          {/* 3. เนื้อที่ — ไร่ / งาน / วา */}
          <div>
            <div className="mb-[5px] flex items-baseline justify-between">
              <span className="text-[12px] font-medium text-tx2">
                เนื้อที่ตามโฉนด (ไร่ · งาน · วา)
              </span>
              {isPolygon && polyAreaWa != null && (
                <span className="font-mono text-xs-t text-txd">
                  polygon ≈ {polyAreaWa.toLocaleString('th-TH')} ตร.วา
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <PlotField label="ไร่"   value={fields.rai}  onChange={(v) => update('rai', v)}  type="number" />
              <PlotField label="งาน"   value={fields.ngan} onChange={(v) => update('ngan', v)} type="number" />
              <PlotField label="ตร.วา" value={fields.wa}   onChange={(v) => update('wa', v)}   type="number" />
            </div>
          </div>

          {isPolygon && (
            <div>
              <label className="mb-[5px] block text-[12px] font-medium text-tx2">
                พื้นที่ (ตร.วา) — จากการวัด polygon
              </label>
              <input
                readOnly
                value={polyAreaWa != null ? polyAreaWa.toLocaleString('th-TH') : '—'}
                className="w-full rounded-md-t border-[1.5px] border-brd bg-bg
                           px-3 py-[10px] font-mono text-body-t text-tx2 outline-none
                           cursor-default"
              />
            </div>
          )}

          {/* สิ่งปลูกสร้างบนที่ดิน */}
          <BuildingsSection buildings={buildings} onChange={setBuildings} />

          {/* แสดงราคาที่ดินสุทธิ/ตร.วา (preview) */}
          <LandPricePreview
            priceTotal={fields.priceTotal}
            buildings={buildings}
            areaSqm={
              isPolygon
                ? polyAreaSqm ?? null
                : rnwToSqm({
                    rai: parseFloat(fields.rai) || 0,
                    ngan: parseFloat(fields.ngan) || 0,
                    wa: parseFloat(fields.wa) || 0,
                  })
            }
          />

          {/* 4. จังหวัด / อำเภอ / ตำบล */}
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-medium text-tx2">ที่ตั้ง (อัตโนมัติจากพิกัด)</span>
            {(geocoding || geoMsg) && (
              <span className="text-[11px] text-tx2">
                {geocoding ? '⏳ กำลังดึง...' : geoMsg}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <LocationAutocomplete
              label="จังหวัด"
              value={fields.province}
              onChange={(v) => update('province', v)}
              options={listProvinces()}
            />
            <LocationAutocomplete
              label="อำเภอ"
              value={fields.amphoe}
              onChange={(v) => update('amphoe', v)}
              options={listAmphoes(fields.province)}
              disabled={!fields.province}
            />
            <LocationAutocomplete
              label="ตำบล"
              value={fields.tambon}
              onChange={(v) => update('tambon', v)}
              options={listTambons(fields.province, fields.amphoe)}
              disabled={!fields.amphoe}
            />
          </div>

          {/* 5. ถนน */}
          <PlotField label="ถนนเข้า" value={fields.roadAcc} onChange={(v) => update('roadAcc', v)} />

          {/* ระบบสาธารณูปโภค */}
          <div>
            <span className="mb-[5px] block text-[12px] font-medium text-tx2">ระบบสาธารณูปโภค</span>
            <div className="grid grid-cols-2 gap-2">
              <UtilityCheck
                label="💧 น้ำประปา"
                checked={fields.hasWater}
                onChange={(v) => update('hasWater', v)}
              />
              <UtilityCheck
                label="⚡ ไฟฟ้า"
                checked={fields.hasElectricity}
                onChange={(v) => update('hasElectricity', v)}
              />
            </div>
          </div>

          {/* 6. ประเภทโฉนด + สีผังเมือง */}
          <div className="grid grid-cols-2 gap-2">
            <PlotField label="ประเภทโฉนด" value={fields.titleType} onChange={(v) => update('titleType', v)} />
            <PlotField label="สีผังเมือง"  value={fields.zoning}    onChange={(v) => update('zoning', v)} />
          </div>

          {/* 7. ใกล้ / แลนด์มาร์ค */}
          <div>
            <label className="mb-[5px] block text-[12px] font-medium text-tx2">ใกล้/แลนด์มาร์ค</label>
            <textarea
              value={fields.landmark}
              onChange={(e) => update('landmark', e.target.value)}
              rows={2}
              placeholder="แยกแต่ละที่ด้วยการขึ้นบรรทัดใหม่ (Enter)"
              className="w-full rounded-md-t border-[1.5px] border-brd bg-bg
                         px-3 py-[10px] text-md-t text-tx outline-none
                         placeholder:text-txd"
            />
          </div>

          {/* 8. หมายเหตุ */}
          <div>
            <label className="mb-[5px] block text-[12px] font-medium text-tx2">หมายเหตุ</label>
            <textarea
              value={fields.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="w-full rounded-md-t border-[1.5px] border-brd bg-bg
                         px-3 py-[10px] text-md-t text-tx outline-none
                         placeholder:text-txd"
            />
          </div>

          {/* รูปภาพ */}
          <div>
            <label className="mb-[5px] block text-[12px] font-medium text-tx2">รูปภาพ</label>
            <PhotoGallery
              existingUrls={existingPhotos}
              pendingFiles={pendingFiles}
              onChangeExisting={setExistingPhotos}
              onChangePending={setPendingFiles}
            />
          </div>
        </div>

        {err && <div className="mt-3 text-xs-t text-red">{err}</div>}

        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleSave}
            disabled={busy || !canModify}
            className="flex-1"
          >
            {busy ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
          </Button>
          {isEdit && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={busy || !canModify}
              className="px-3"
              aria-label="ลบ"
            >
              🗑
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => !busy && setTarget(null)}
            disabled={busy}
            className="px-3"
          >
            ยกเลิก
          </Button>
        </div>
      </div>
    </div>
  );
}

function UtilityCheck({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      className={
        'flex cursor-pointer items-center gap-2 rounded-md-t border-[1.5px] px-3 py-[10px] ' +
        'text-md-t text-tx active:opacity-[.78] ' +
        (checked
          ? 'border-[#00e676]/50 bg-[#00e676]/10'
          : 'border-brd bg-bg')
      }
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#00e676]"
      />
      <span>{label}</span>
    </label>
  );
}

function PlotField({
  label, value, onChange, type = 'text', mono = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean }) {
  return (
    <label className="block">
      <span className="mb-[5px] block text-[12px] font-medium text-tx2">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          'w-full rounded-md-t border-[1.5px] border-brd bg-bg ' +
          'px-3 py-[10px] outline-none text-tx ' +
          'placeholder:text-txd ' +
          (mono ? 'font-mono text-body-t' : 'text-md-t')
        }
      />
    </label>
  );
}

function LandPricePreview({
  priceTotal, buildings, areaSqm,
}: {
  priceTotal: string;
  buildings: BuildingInfo[];
  areaSqm: number | null;
}) {
  const priceNum = parseFloat(priceTotal);
  if (!Number.isFinite(priceNum) || priceNum <= 0) return null;
  if (!areaSqm || areaSqm <= 0) return null;

  const buildingTotal = buildings.reduce((s, b) => s + (b.netValue || 0), 0);
  const landValue = priceNum - buildingTotal;
  const areaWa = areaSqm / 4;
  const pricePerWa = landValue / areaWa;

  return (
    <div className="rounded-md border border-[#00e676]/30 bg-[#00e676]/5 p-2.5 text-xs">
      <div className="mb-1 text-tx2">ราคาที่ดินสุทธิ/ตร.วา (คำนวณอัตโนมัติ)</div>
      <div className="font-mono">
        <span className="text-tx2">
          ({priceNum.toLocaleString('th-TH')}
          {buildingTotal > 0 && ` - ${buildingTotal.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`}
          ) ÷ {areaWa.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ตร.วา =
        </span>
        <span className="ml-1 font-semibold text-[#00e676]">
          {pricePerWa.toLocaleString('th-TH', { maximumFractionDigits: 0 })} ฿/ตร.วา
        </span>
      </div>
    </div>
  );
}
