import sizes from '../data/image-sizes.json';

// width/height attributes for an image under public/images/{ten-years,apparel,drops}, from
// src/data/image-sizes.json (regenerate with scripts/image-sizes.py). Unknown paths get none.
export function imageSize(src: string | undefined): { width?: number; height?: number } {
  const s = src ? (sizes as Record<string, number[]>)[src] : undefined;
  return s ? { width: s[0], height: s[1] } : {};
}
