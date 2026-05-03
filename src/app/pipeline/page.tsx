// ════════════════════════════════════════
// src/app/pipeline/page.tsx
// Phase 3 #8 — Pipeline Dashboard (Kanban)
// แสดง convo ของแปลงที่ user เป็นเจ้าของ
// ════════════════════════════════════════
import type { Metadata } from 'next';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';

export const metadata: Metadata = {
  title: 'Pipeline · TNR MapHub',
  description: 'จัดการดีลซื้อขายแบบ Kanban',
};

export default function PipelinePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0d1520',
      color: '#dce8f5',
      paddingTop: 64,
    }}>
      <PipelineBoard />
    </main>
  );
}
