// ════════════════════════════════════════
// src/components/favorites/FavButton.tsx
// Heart button for plot popup / card
// ════════════════════════════════════════
'use client';

import { useFavorites } from '@/hooks/useFavorites';
import type { PlotPoint } from '@/types/plot';

export function FavButton({ plot, size = 24 }: { plot: PlotPoint; size?: number }) {
  const { isFavorited, toggle } = useFavorites();
  const on = isFavorited(plot.id);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(plot); }}
      title={on ? 'ลบจากรายการโปรด' : 'บันทึกรายการโปรด'}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontSize: size, padding: 4, lineHeight: 1,
      }}
    >
      {on ? '❤️' : '🤍'}
    </button>
  );
}
