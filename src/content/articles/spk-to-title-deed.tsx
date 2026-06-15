// ════════════════════════════════════════
// src/content/articles/spk-to-title-deed.tsx
// บทความ: เปลี่ยน ส.ป.ก. เป็นโฉนดได้ไหม — โฉนดเพื่อการเกษตร
// Body = inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════
import type { ArticleMeta } from './index';

const MAP_URL = 'https://map.tnrmaphub.com';

export const meta: ArticleMeta = {
  slug:        'spk-to-title-deed',
  title:       'เปลี่ยน ส.ป.ก. เป็นโฉนดได้ไหม — เงื่อนไขโฉนดเพื่อการเกษตร ขาย/โอนได้แค่ไหน',
  description: 'ที่ดิน ส.ป.ก. 4-01 เปลี่ยนเป็นโฉนดเพื่อการเกษตรได้จริงไหม ใครมีสิทธิ ขายหรือโอนได้แค่ไหน ต่างจากโฉนดครุฑแดงอย่างไร พร้อมขั้นตอนยื่นและข้อควรระวังก่อนซื้อ',
  excerpt:     'มีที่ ส.ป.ก. อยากเปลี่ยนเป็นโฉนดแล้วขายต่อ — ช้าก่อน "โฉนดเพื่อการเกษตร" ไม่ใช่โฉนดที่ขายได้อิสระ บทความนี้สรุปเงื่อนไข สิทธิ และกับดักที่ต้องรู้ก่อนซื้อ-ขาย',
  date:        '2026-06-16',
  tags:        ['ส.ป.ก.', 'โฉนดเพื่อการเกษตร', 'เอกสารสิทธิ์ที่ดิน', 'ซื้อที่ดิน'],
  readMin:     7,
  cover:       'https://tnrmaphub.com/article-images/spk-to-title-deed.webp',
};

const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

const COMPARE = [
  {
    type: 'ส.ป.ก. 4-01',
    own: 'สิทธิทำกิน (ไม่ใช่กรรมสิทธิ์)',
    sell: 'ขายไม่ได้ โอนได้เฉพาะทายาทที่เป็นเกษตรกร',
    use: 'ต้องใช้ทำเกษตรเท่านั้น',
  },
  {
    type: 'โฉนดเพื่อการเกษตร',
    own: 'ยังอยู่ในเขตปฏิรูปที่ดิน (ส.ป.ก. กำกับ)',
    sell: 'ห้ามโอน 2 ปีแรก หลังจากนั้นโอนได้เฉพาะเกษตรกรที่มีคุณสมบัติ — ขายให้คนทั่วไป/นายทุนไม่ได้',
    use: 'ยังต้องใช้ทำเกษตร',
  },
  {
    type: 'โฉนดครุฑแดง (น.ส.4จ)',
    own: 'กรรมสิทธิ์เต็มของเจ้าของ',
    sell: 'ซื้อขาย โอน จำนองได้อิสระตามกฎหมาย',
    use: 'ใช้ประโยชน์ได้ตามผังเมือง',
  },
];

const STEPS = [
  { n: 1, t: 'ตรวจคุณสมบัติ', d: 'ต้องเป็นผู้ได้รับสิทธิ ส.ป.ก. 4-01 และเข้าทำประโยชน์ในที่ดินมาแล้วไม่น้อยกว่า 5 ปี' },
  { n: 2, t: 'เตรียมเอกสาร', d: 'ส.ป.ก. 4-01 ตัวจริง, บัตรประชาชน, ทะเบียนบ้าน, ใบเปลี่ยนชื่อ-สกุล (ถ้ามี)' },
  { n: 3, t: 'ยื่นคำขอ', d: 'ยื่นที่สำนักงาน ส.ป.ก. จังหวัด หรือผ่านระบบออนไลน์ที่ alro.go.th' },
  { n: 4, t: 'เจ้าหน้าที่ตรวจสอบ', d: 'ส.ป.ก. ตรวจสอบสิทธิ รังวัด และการใช้ประโยชน์ที่ดินจริง' },
  { n: 5, t: 'รับโฉนดเพื่อการเกษตร', d: 'เมื่อผ่านการตรวจสอบ จะได้รับเอกสาร "โฉนดเพื่อการเกษตร" ซึ่งยังมีเงื่อนไขจำกัดการโอน' },
];

export const FAQ = [
  { q: 'ที่ดิน ส.ป.ก. เปลี่ยนเป็นโฉนดขายได้เลยไหม?', a: 'ไม่ได้ โฉนดที่เปลี่ยนมาคือ "โฉนดเพื่อการเกษตร" ซึ่งไม่ใช่โฉนดครุฑแดงที่ซื้อขายอิสระ ยังห้ามโอนใน 2 ปีแรก (ยกเว้นตกทอดทางมรดก) และหลังจากนั้นโอนได้เฉพาะให้เกษตรกรที่มีคุณสมบัติตามที่กฎหมายกำหนด ขายให้บุคคลทั่วไปหรือนายทุนไม่ได้' },
  { q: 'ใครมีสิทธิขอเปลี่ยน ส.ป.ก. เป็นโฉนดเพื่อการเกษตร?', a: 'ผู้ที่ได้รับสิทธิ ส.ป.ก. 4-01 และเข้าทำประโยชน์ในที่ดินมาแล้วไม่น้อยกว่า 5 ปี ทั้งนี้หลักเกณฑ์อาจปรับเปลี่ยนตามนโยบาย ควรตรวจสอบเงื่อนไขล่าสุดกับสำนักงาน ส.ป.ก.' },
  { q: 'โฉนดเพื่อการเกษตรเอาไปจำนองกับธนาคารได้ไหม?', a: 'ใช้เป็นหลักประกันได้กับสถาบันการเงินของรัฐหรือกองทุนที่กฎหมายกำหนด เช่น ธ.ก.ส. แต่ไม่สามารถนำไปจำนองกับธนาคารพาณิชย์ทั่วไปได้เหมือนโฉนดครุฑแดง ควรสอบถามเงื่อนไขกับสถาบันการเงินโดยตรง' },
  { q: 'ซื้อที่ดิน ส.ป.ก. หรือโฉนดเพื่อการเกษตรต่อจากคนอื่นได้ไหม?', a: 'มีความเสี่ยงสูงมาก ที่ดินกลุ่มนี้โอนนอกเงื่อนไขไม่ได้ การซื้อขายกันเองอาจเป็นโมฆะและถูกเพิกถอนสิทธิได้ ผู้ซื้ออาจเสียเงินโดยไม่ได้ที่ดิน ควรปรึกษาสำนักงาน ส.ป.ก. และนักกฎหมายก่อนทำธุรกรรมเสมอ' },
];

const SOURCES = [
  { name: 'สำนักงานการปฏิรูปที่ดินเพื่อเกษตรกรรม (ส.ป.ก. / ALRO)', url: 'https://www.alro.go.th' },
  { name: 'พ.ร.บ.การปฏิรูปที่ดินเพื่อเกษตรกรรม พ.ศ.2518 (สำนักงานคณะกรรมการกฤษฎีกา)', url: 'https://www.krisdika.go.th' },
  { name: 'กรมที่ดิน (เอกสารสิทธิ์ที่ดิน)', url: 'https://www.dol.go.th' },
];

const p: React.CSSProperties = { fontSize: 15, lineHeight: 1.65, color: C.text, margin: '0 0 10px' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 14px',
        paddingBottom: 8, borderBottom: `1px solid ${C.border}`,
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function SpkToTitleDeed() {
  return (
    <article style={{ color: C.text }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>
          เปลี่ยน ส.ป.ก. เป็นโฉนดได้ไหม
        </h1>
        <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>
          เงื่อนไข “โฉนดเพื่อการเกษตร” ขาย/โอนได้แค่ไหน และกับดักก่อนซื้อ
        </p>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Can You Convert ALRO Land (ส.ป.ก.) to a Title Deed?
        </p>
      </header>

      <p style={p}>
        มีที่ดิน ส.ป.ก. อยู่ในมือ อยากเปลี่ยนเป็นโฉนดแล้วขายต่อให้ได้ราคา —
        ความเข้าใจนี้ทำให้หลายคนพลาด เพราะ <strong>“โฉนดเพื่อการเกษตร”</strong> ที่เปลี่ยนมาจาก ส.ป.ก.
        <strong> ไม่ใช่โฉนดที่ซื้อขายได้อย่างอิสระ</strong> บทความนี้สรุปให้ชัดว่าเปลี่ยนได้จริงแค่ไหน
        ทำอะไรได้-ไม่ได้ และทำไมการซื้อที่ดินกลุ่มนี้ต่อจากคนอื่นถึงเสี่ยงเสียเงินฟรี
      </p>

      <Section title="ส.ป.ก. 4-01 คืออะไร ทำไมขายไม่ได้">
        <p style={p}>
          <strong>ส.ป.ก. 4-01</strong> คือหนังสืออนุญาตให้เกษตรกรเข้า <strong>ทำกิน</strong> ในที่ดินของรัฐ
          ที่จัดสรรให้ตาม พ.ร.บ.การปฏิรูปที่ดินเพื่อเกษตรกรรม พ.ศ.2518 —
          จุดสำคัญคือมันเป็น <strong>สิทธิทำกิน ไม่ใช่กรรมสิทธิ์</strong> ที่ดินยังเป็นของรัฐ
        </p>
        <p style={p}>
          เพราะแบบนี้ ที่ดิน ส.ป.ก. จึง <strong>ซื้อขายไม่ได้</strong> โอนได้เฉพาะตกทอดให้ทายาท
          ที่เป็นเกษตรกรเท่านั้น ใครซื้อขายกันเองถือว่าผิดเงื่อนไขและอาจถูกเพิกถอนสิทธิ
        </p>
      </Section>

      <Section title="“โฉนดเพื่อการเกษตร” คืออะไร — ใช่โฉนดจริงไหม?">
        <p style={p}>
          ปี 2566 มีระเบียบให้เปลี่ยน ส.ป.ก. 4-01 เป็น <strong>“โฉนดเพื่อการเกษตร”</strong> และเริ่มทยอยมอบ
          ให้เกษตรกรตั้งแต่ต้นปี 2567 — ฟังดูเหมือนได้อัปเกรดเป็นโฉนดเต็มตัว แต่ความจริงไม่ใช่อย่างนั้น
        </p>
        <figure style={{ margin: '4px 0 16px' }}>
          <img src="/article-images/spk-to-title-deed-fig1.webp" alt="ภาพมุมสูงทุ่งเกษตรในเขตปฏิรูปที่ดิน แบ่งเป็นแปลงชัดเจน ช่วงเช้าหมอกบาง"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ที่ดินโฉนดเพื่อการเกษตรยังอยู่ในเขตปฏิรูปที่ดิน และยังต้องใช้ทำเกษตร
          </figcaption>
        </figure>
        <div style={{
          background: 'rgba(64,196,255,0.06)', border: `1px solid ${C.cyan}40`,
          borderRadius: 10, padding: '14px 16px', margin: '4px 0 0',
        }}>
          <p style={{ ...p, margin: 0 }}>
            โฉนดเพื่อการเกษตร <strong style={{ color: C.cyan }}>ไม่ใช่โฉนดครุฑแดง (น.ส.4จ)</strong> ที่ขายได้อิสระ —
            ที่ดินยังอยู่ในเขตปฏิรูปที่ดินภายใต้การกำกับของ ส.ป.ก. ยังต้องใช้ทำเกษตร
            และยังมีเงื่อนไขจำกัดการโอนอยู่
          </p>
        </div>
      </Section>

      <Section title="ขาย/โอนได้แค่ไหน — สรุปเงื่อนไข">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'ห้ามโอน 2 ปีแรกหลังได้รับโฉนดเพื่อการเกษตร — ยกเว้นการตกทอดทางมรดก',
            'โอนให้คู่สมรส บุตร ทายาท หรือเครือญาติได้ โดยผู้รับต้องมีคุณสมบัติเป็นเกษตรกรตามกฎหมาย',
            'พ้นกำหนดแล้ว โอนได้เฉพาะให้เกษตรกรที่มีคุณสมบัติ หรือคืนสิทธิให้ ส.ป.ก. — ขายให้บุคคลทั่วไป/นายทุนไม่ได้',
            'ใช้เป็นหลักประกันกู้เงินได้กับสถาบันการเงินของรัฐ/กองทุนที่กฎหมายกำหนด (เช่น ธ.ก.ส.) ไม่ใช่ธนาคารพาณิชย์ทั่วไป',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.cyan, fontWeight: 700, flexShrink: 0 }}>•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <figure style={{ margin: '16px 0 0' }}>
          <img src="/article-images/spk-to-title-deed-fig2.webp" alt="มือเกษตรกรถือเอกสารที่ดินม้วนอยู่กลางทุ่งนาช่วงแสงเย็น"
            style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
              borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
          <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            ระวัง: ที่ดิน ส.ป.ก. และโฉนดเพื่อการเกษตรโอนนอกเงื่อนไขไม่ได้ — ซื้อต่อจากคนอื่นเสี่ยงโมฆะ
          </figcaption>
        </figure>
      </Section>

      <Section title="เทียบให้เห็นชัด: ส.ป.ก. vs โฉนดเพื่อการเกษตร vs โฉนดครุฑแดง">
        <div style={{ display: 'grid', gap: 10 }}>
          {COMPARE.map(c => (
            <div key={c.type} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14,
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: C.cyan, marginBottom: 8 }}>{c.type}</div>
              <div style={{ display: 'grid', gap: 5, fontSize: 14, lineHeight: 1.5 }}>
                <div><span style={{ color: C.muted }}>กรรมสิทธิ์: </span><span style={{ color: C.text }}>{c.own}</span></div>
                <div><span style={{ color: C.muted }}>ซื้อขาย/โอน: </span><span style={{ color: C.text }}>{c.sell}</span></div>
                <div><span style={{ color: C.muted }}>การใช้ที่ดิน: </span><span style={{ color: C.text }}>{c.use}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...p, fontSize: 13.5, color: C.muted, marginTop: 12 }}>
          ก่อนซื้อที่ดินทุกแปลง ควรตรวจชนิดเอกสารสิทธิ์ให้แน่ใจก่อน —{' '}
          <a href="/articles/check-land-before-buying" style={{ color: C.cyan }}>
            ดูเช็กลิสต์ตรวจที่ดินก่อนซื้อ
          </a>{' '}เพื่อเลี่ยงการซื้อที่ดินที่โอนกรรมสิทธิ์ไม่ได้
        </p>
      </Section>

      <Section title="ขั้นตอนยื่นเปลี่ยน ส.ป.ก. เป็นโฉนดเพื่อการเกษตร">
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {STEPS.map(s => (
            <li key={s.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
            }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
                background: C.cyan, color: '#0d1520', fontWeight: 900, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.n}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="คำถามที่พบบ่อย (FAQ)">
        <div style={{ display: 'grid', gap: 10 }}>
          {FAQ.map((f, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>Q: {f.q}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>A: {f.a}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="สรุป: ก่อนยุ่งกับที่ดิน ส.ป.ก. จำ 3 ข้อนี้">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {[
            'โฉนดเพื่อการเกษตร ≠ โฉนดครุฑแดง — ยังขายอิสระไม่ได้ ยังต้องทำเกษตร',
            'จะเปลี่ยนได้ต้องเป็นเกษตรกรผู้ทำประโยชน์จริงมาแล้วไม่น้อยกว่า 5 ปี',
            'อย่าซื้อที่ดิน ส.ป.ก./โฉนดเพื่อการเกษตรต่อจากคนอื่น — เสี่ยงโมฆะและเสียเงินฟรี ปรึกษา ส.ป.ก. ก่อนเสมอ',
          ].map(t => (
            <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
              <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="แหล่งข้อมูลที่เกี่ยวข้อง">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {SOURCES.map(s => (
            <li key={s.url} style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text }}>
              {s.name} —{' '}
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: C.cyan, wordBreak: 'break-all' }}>
                {s.url.replace('https://', '')}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <p style={{
        fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginTop: 28,
        padding: '14px 16px', background: 'rgba(255,179,0,0.06)',
        border: '1px solid rgba(255,179,0,0.25)', borderRadius: 10,
      }}>
        ⚠ <strong>ข้อควรระวัง:</strong> หลักเกณฑ์การเปลี่ยน ส.ป.ก. เป็นโฉนดเพื่อการเกษตร
        รวมถึงเงื่อนไขการโอนและระยะเวลา เป็นเรื่องกฎหมาย/นโยบายที่อาจปรับเปลี่ยนได้
        ข้อมูลในบทความใช้อ้างอิงเบื้องต้นเท่านั้น ก่อนดำเนินการหรือทำธุรกรรมใด ๆ
        ควรตรวจสอบเงื่อนไขล่าสุดกับสำนักงาน ส.ป.ก. และปรึกษานักกฎหมาย
      </p>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
          background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
        }}>
          🗺 เปิดแผนที่ TNR MapHub ตรวจแปลงที่ดินจริง
        </a>
      </div>
    </article>
  );
}
