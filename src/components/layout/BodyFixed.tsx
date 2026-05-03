// ════════════════════════════════════════
// components/layout/BodyFixed.tsx
// Lock body viewport — ใช้กับหน้าแผนที่ (/) ที่ map ใช้ทั้งหน้าจอ
// Mount ใน page.tsx ของหน้าที่ต้องการ
// ════════════════════════════════════════
'use client';

import { useEffect } from 'react';

export function BodyFixed() {
  useEffect(() => {
    document.body.classList.add('body-fixed');
    return () => {
      document.body.classList.remove('body-fixed');
    };
  }, []);
  return null;
}
