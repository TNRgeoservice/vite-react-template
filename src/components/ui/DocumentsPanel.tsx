// ════════════════════════════════════════
// components/ui/DocumentsPanel.tsx
// 📄 เอกสาร & แบบฟอร์ม — port from legacy index.html
// - Contract PDF download (in /public)
// - External links: dol.go.th forms, ค่าโอนที่ดิน, พ.ร.บ.จัดสรร
// ════════════════════════════════════════
'use client';

interface DocItem {
  href: string;
  icon: string;
  name: string;
  sub: string;
  /** download = same-origin file, external = open new tab */
  kind: 'download' | 'external';
  highlight?: boolean;
}

const DOCS: DocItem[] = [
  {
    href: '/สัญญาจะซื้อจะขาย.pdf',
    icon: '📝',
    name: 'สัญญาจะซื้อจะขาย',
    sub: 'ดาวน์โหลดแบบฟอร์ม PDF',
    kind: 'download',
    highlight: true,
  },
  {
    href: 'https://www.dol.go.th/cmi-maerim/documents-download/',
    icon: '🏛️',
    name: 'แบบฟอร์มกรมที่ดิน',
    sub: '54 แบบฟอร์ม · dol.go.th',
    kind: 'external',
  },
  {
    href: 'https://blog.ghbank.co.th/land-transfer-fees/',
    icon: '💰',
    name: 'คู่มือค่าโอนที่ดิน',
    sub: 'ค่าธรรมเนียม ภาษี คำนวณค่าใช้จ่าย',
    kind: 'external',
  },
  {
    href: 'https://www.dol.go.th/knowledge-land-department/law/act/act-822003885530124288/',
    icon: '⚖️',
    name: 'พ.ร.บ. จัดสรรที่ดิน',
    sub: 'พระราชบัญญัติจัดสรรที่ดิน พ.ศ. 2543',
    kind: 'external',
  },
];

export function DocumentsPanel() {
  return (
    <div className="border-t border-brd p-3">
      <div className="mb-2 text-xs font-semibold text-[#7a9ab8]">📄 เอกสาร &amp; แบบฟอร์ม</div>
      <div className="flex flex-col gap-1.5">
        {DOCS.map((d) => {
          const isExt = d.kind === 'external';
          return (
            <a
              key={d.href}
              href={d.href}
              {...(isExt
                ? { target: '_blank', rel: 'noopener' }
                : { download: d.name + '.pdf' })}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition
                ${d.highlight
                  ? 'bg-[#1a3a2a] border border-[#00e676]/40 hover:bg-[#1f4a35]'
                  : 'bg-[#1e2d42] border border-[#213045] hover:bg-[#243349]'}`}
            >
              <span className="text-lg leading-none">{d.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-[#dce8f5]">{d.name}</div>
                <div className="truncate text-[10px] text-[#7a9ab8]">{d.sub}</div>
              </div>
              <span className="text-sm text-[#7a9ab8]">{isExt ? '↗' : '⬇'}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
