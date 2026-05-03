// ════════════════════════════════════════
// src/app/inbox/page.tsx
// Inbox — list of all user's conversations
// ════════════════════════════════════════
'use client';

import Link from 'next/link';
import { InboxList } from '@/components/dm/InboxList';

export default function InboxPage() {
  return (
    <main className="min-h-screen bg-[#0d1520] text-[#dce8f5]">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#213045] bg-[#0d1520]/95 px-3 py-3 backdrop-blur">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#213045] text-base">
          ←
        </Link>
        <h1 className="text-base font-bold text-[#00e676]">กล่องข้อความ</h1>
      </header>
      <InboxList />
    </main>
  );
}
