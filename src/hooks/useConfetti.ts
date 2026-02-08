import { useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

// BLKOUT brand colors for confetti
const BLKOUT_COLORS = ['#D4AF37', '#FFD700', '#FFFFFF', '#9333ea', '#c026d3'];

function burst(origin: { x: number; y: number }) {
  confetti({
    particleCount: 80,
    spread: 70,
    origin,
    colors: BLKOUT_COLORS,
    ticks: 200,
    gravity: 1.2,
    scalar: 1.1,
  });
}

function doubleBurst() {
  burst({ x: 0.15, y: 0.6 });
  burst({ x: 0.85, y: 0.6 });
}

export function useConfetti(fireOnMount = true) {
  useEffect(() => {
    if (fireOnMount) {
      const timer = setTimeout(doubleBurst, 600);
      return () => clearTimeout(timer);
    }
  }, [fireOnMount]);

  return {
    burst: useCallback(burst, []),
    doubleBurst: useCallback(doubleBurst, []),
  };
}
