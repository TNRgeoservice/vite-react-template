// ════════════════════════════════════════
// src/app/contacts/page.tsx
// Phase 2 #11a — Contacts (Friend list + Requests + Add by email)
// ════════════════════════════════════════
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ContactsView = dynamic(() => import('@/components/contacts/ContactsView').then((m) => m.ContactsView), {
  ssr: false,
  loading: () => <div className="p-6 text-center text-sm text-[#7a9ab8]">กำลังโหลด...</div>,
});

export default function ContactsPage() {
  return (
    <Suspense fallback={null}>
      <ContactsView />
    </Suspense>
  );
}
