/**
 * FoundationLayer — the "people at heart" background layer.
 *
 * Renders one of 33 curated photographs (11 × {joy, power, vulnerability}) as a
 * decorative bg layer behind hero sections. Defaults to 20% opacity per the
 * community-web-design skill's three-layer structure (Foundation → Shell →
 * Disruption). Accepts a category to bias selection or a fixed image to pin.
 *
 * Use:
 *   <section className="relative">
 *     <FoundationLayer category="power" />
 *     <div className="relative z-10">…hero content…</div>
 *   </section>
 */

import React, { useMemo } from 'react';

const POOL: Record<'joy' | 'power' | 'vulnerability', readonly string[]> = {
  joy: Array.from({ length: 11 }, (_, i) => `/images/foundation/joy-${String(i + 1).padStart(2, '0')}.jpg`),
  power: Array.from({ length: 11 }, (_, i) => `/images/foundation/power-${String(i + 1).padStart(2, '0')}.jpg`),
  vulnerability: Array.from({ length: 11 }, (_, i) => `/images/foundation/vulnerability-${String(i + 1).padStart(2, '0')}.jpg`),
} as const;

interface FoundationLayerProps {
  /** Bias selection. Omit for random across all 33. */
  category?: 'joy' | 'power' | 'vulnerability';
  /** Pin a specific image path. Overrides category + seed. */
  src?: string;
  /** Stable string → deterministic image (e.g. page slug). Otherwise random per render. */
  seed?: string;
  /** 0–1, default 0.2 per skill's "20–30% opacity" guidance. */
  opacity?: number;
  /** CSS object-position. Default 'center' (preserves figure for most foundation photos). */
  anchor?: string;
  className?: string;
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const FoundationLayer: React.FC<FoundationLayerProps> = ({
  category,
  src,
  seed,
  opacity = 0.2,
  anchor = 'center',
  className = '',
}) => {
  const chosen = useMemo(() => {
    if (src) return src;
    const pool = category ? POOL[category] : [...POOL.joy, ...POOL.power, ...POOL.vulnerability];
    const idx = seed ? hashSeed(seed) % pool.length : Math.floor(Math.random() * pool.length);
    return pool[idx];
  }, [src, category, seed]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url('${chosen}')`,
        backgroundSize: 'cover',
        backgroundPosition: anchor,
        opacity,
      }}
    />
  );
};

export default FoundationLayer;
