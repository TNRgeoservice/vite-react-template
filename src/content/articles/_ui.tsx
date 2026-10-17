// ════════════════════════════════════════
// src/content/articles/_ui.tsx
// ชิ้นส่วน UI ร่วมของบทความ (palette + Section/Steps/Table/FAQ/Sources/CTA)
// inline style + plain <a> เท่านั้น (ไม่มี hook/browser API) → renderToStaticMarkup ได้
// ════════════════════════════════════════

export const MAP_URL = 'https://map.tnrmaphub.com';

export const C = {
  card:   '#162030',
  border: '#213045',
  text:   '#dce8f5',
  muted:  '#7a9ab8',
  cyan:   '#40c4ff',
  green:  '#00e676',
};

export const p: React.CSSProperties = { fontSize: 15, lineHeight: 1.65, color: C.text, margin: '0 0 10px' };
export const note: React.CSSProperties = { ...p, fontSize: 13.5, color: C.muted };
const td: React.CSSProperties = { padding: '10px 12px', borderBottom: `1px solid ${C.border}`, lineHeight: 1.55, verticalAlign: 'top' };

export function Header({ title, sub, en }: { title: string; sub: string; en: string }) {
  return (
    <header style={{ marginBottom: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.25, margin: '0 0 10px', color: '#fff' }}>{title}</h1>
      <p style={{ fontSize: 17, color: C.cyan, fontWeight: 600, margin: '0 0 6px' }}>{sub}</p>
      <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{en}</p>
    </header>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

export function Figure({ slug, n, alt, caption }: { slug: string; n: number; alt: string; caption: string }) {
  return (
    <figure style={{ margin: '0 0 16px' }}>
      <img src={`/article-images/${slug}-fig${n}.webp`} alt={alt}
        style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover',
          borderRadius: 10, border: `1px solid ${C.border}`, display: 'block' }} />
      <figcaption style={{ fontSize: 12.5, color: C.muted, marginTop: 6, textAlign: 'center' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Steps({ items, color = C.cyan }: { items: { t: string; d: string }[]; color?: string }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 10 }}>
      {items.map((s, i) => (
        <li key={s.t} style={{
          display: 'flex', gap: 14, alignItems: 'flex-start',
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px',
        }}>
          <span style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
            background: color, color: '#0d1520', fontWeight: 900, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{i + 1}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>{s.d}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Cards({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
      {items.map(r => (
        <div key={r.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{r.t}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>{r.d}</div>
        </div>
      ))}
    </div>
  );
}

export function Checks({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '0 0 12px', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
      {items.map(t => (
        <li key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.55, color: C.text }}>
          <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Table({ head, rows, minWidth = 520 }: { head: string[]; rows: string[][]; minWidth?: number }) {
  return (
    <div style={{ overflowX: 'auto', margin: '12px 0 14px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth }}>
        <thead>
          <tr>
            {head.map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '10px 12px', color: C.cyan, fontWeight: 700,
                borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i} style={{ ...td, ...(i === 0 ? { fontWeight: 700, color: '#fff' } : { color: C.text }) }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      margin: '0 0 32px', padding: '14px 16px', borderRadius: 10,
      background: 'rgba(255,82,82,0.07)', border: '1px solid rgba(255,82,82,0.35)',
      fontSize: 14, lineHeight: 1.65, color: C.text,
    }}>
      {children}
    </div>
  );
}

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      margin: '4px 0 14px', padding: '14px 16px', borderRadius: 10,
      background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.3)',
      fontSize: 14, lineHeight: 1.65, color: C.text,
    }}>
      {children}
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Section title="คำถามที่พบบ่อย (FAQ)">
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((f, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>Q: {f.q}</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55 }}>A: {f.a}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Sources({ items }: { items: { name: string; url: string }[] }) {
  return (
    <Section title="แหล่งข้อมูลที่เกี่ยวข้อง">
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {items.map(s => (
          <li key={s.url} style={{ fontSize: 14.5, lineHeight: 1.6, color: C.text }}>
            {s.name} —{' '}
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: C.cyan, wordBreak: 'break-all' }}>
              {s.url.replace('https://', '')}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginTop: 28,
      padding: '14px 16px', background: 'rgba(255,179,0,0.06)',
      border: '1px solid rgba(255,179,0,0.25)', borderRadius: 10,
    }}>
      ⚠ <strong>ข้อควรระวัง:</strong> {children}
    </p>
  );
}

export function Cta({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 28, textAlign: 'center' }}>
      <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
        background: C.cyan, color: '#0d1520', borderRadius: 10, fontWeight: 700, textDecoration: 'none',
      }}>
        🗺 {label}
      </a>
    </div>
  );
}

export function L({ to, children }: { to: string; children: React.ReactNode }) {
  return <a href={`/articles/${to}`} style={{ color: C.cyan }}>{children}</a>;
}
