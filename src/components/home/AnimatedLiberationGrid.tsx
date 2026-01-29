/**
 * Animated Liberation Grid
 *
 * A 9-square progressive reveal grid embodying BLKOUT's values:
 * - "Don't judge a book by its cover" - squares look identical initially
 * - Progressive revelation - tap to discover content
 * - Collective reward - each card reveals its section of a shared image/video
 *
 * Accessibility: WCAG 2.1 AA compliant
 * - Keyboard navigable
 * - Reduced motion support
 * - Screen reader friendly
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/liberation-utils';
import { gridItems, collectiveVideoUrl, collectiveFallbackImage } from './gridContent';
import { ExternalLink } from 'lucide-react';

type SquareState = 'initial' | 'revealed' | 'visited';

const STORAGE_KEY = 'blkout-grid-visited';

interface AnimatedLiberationGridProps {
  onNavigate: (tab: string) => void;
}

export default function AnimatedLiberationGrid({ onNavigate }: AnimatedLiberationGridProps) {
  const [loadedSquares, setLoadedSquares] = useState<number[]>([]);
  const [squareStates, setSquareStates] = useState<Record<number, SquareState>>(
    gridItems.reduce((acc, item) => ({ ...acc, [item.id]: 'initial' }), {})
  );
  const [visitedLinks, setVisitedLinks] = useState<Record<number, boolean>>({});
  const [collectiveImageRevealed, setCollectiveImageRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restore visited state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const visitedIds: number[] = JSON.parse(saved);
        const restoredVisited: Record<number, boolean> = {};
        const restoredStates: Record<number, SquareState> = {};

        gridItems.forEach(item => {
          if (visitedIds.includes(item.id)) {
            restoredVisited[item.id] = true;
            restoredStates[item.id] = 'visited';
          } else {
            restoredStates[item.id] = 'initial';
          }
        });

        setVisitedLinks(restoredVisited);
        setSquareStates(restoredStates);

        if (visitedIds.length === gridItems.length) {
          setCollectiveImageRevealed(true);
        }
      }
    } catch (e) {
      // localStorage not available or corrupted, start fresh
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Progressive loading of squares one by one
  useEffect(() => {
    if (prefersReducedMotion) {
      setLoadedSquares(gridItems.map(item => item.id));
      return;
    }

    const timer = setInterval(() => {
      setLoadedSquares(prev => {
        if (prev.length >= gridItems.length) {
          clearInterval(timer);
          return prev;
        }
        return [...prev, prev.length + 1];
      });
    }, 150);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const handleSquareClick = useCallback((id: number) => {
    setSquareStates(prev => {
      const current = prev[id];
      if (current === 'initial') return { ...prev, [id]: 'revealed' };
      return prev;
    });
  }, []);

  const handleNavigate = useCallback((id: number, item: typeof gridItems[0]) => {
    setVisitedLinks(prev => {
      const newVisited = { ...prev, [id]: true };

      try {
        const visitedIds = Object.keys(newVisited)
          .filter(key => newVisited[Number(key)])
          .map(Number);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedIds));
      } catch (e) {
        // localStorage not available
      }

      const allVisited = gridItems.every(gridItem => newVisited[gridItem.id]);
      if (allVisited) {
        setCollectiveImageRevealed(true);
      }
      return newVisited;
    });
    setSquareStates(prev => ({ ...prev, [id]: 'visited' }));

    if (item.isExternal) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    } else if (item.tabName) {
      onNavigate(item.tabName);
    }
  }, [onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: number, item: typeof gridItems[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const state = squareStates[id];
      if (state === 'initial') {
        handleSquareClick(id);
      } else {
        handleNavigate(id, item);
      }
    }
  }, [squareStates, handleSquareClick, handleNavigate]);

  const revealedCount = Object.values(squareStates).filter(s => s !== 'initial').length;

  return (
    <section className="py-8" aria-label="Explore BLKOUT - Interactive Grid">
      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-liberation-gold-divine mb-3">
          Explore BLKOUT
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-4">
          Each square holds a piece of our story. Tap to reveal, tap again to explore.
        </p>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <span>{revealedCount}/{gridItems.length} revealed</span>
          {revealedCount > 0 && !collectiveImageRevealed && (
            <span className="text-liberation-gold-divine">
              {revealedCount < gridItems.length ? 'Keep going!' : 'Now explore each one!'}
            </span>
          )}
          {collectiveImageRevealed && (
            <span className="text-green-400">Full picture unlocked!</span>
          )}
        </div>
      </div>

      {/* Grid with video/image background */}
      <div className="relative max-w-5xl mx-auto">
        {/* Background video/image that shows through revealed cards */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" aria-hidden="true">
          {videoError ? (
            <img
              src={collectiveFallbackImage}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={collectiveVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              onError={() => setVideoError(true)}
            >
              <track kind="captions" />
            </video>
          )}
        </div>

        {/* The 3x3 grid of cards */}
        <div
          className="relative grid grid-cols-3 gap-1 md:gap-1.5"
          role="grid"
          aria-label="Liberation gateway grid"
        >
          {gridItems.map((item) => {
            const isLoaded = loadedSquares.includes(item.id);
            const state = squareStates[item.id];
            const isRevealed = state === 'revealed' || state === 'visited';

            return (
              <div
                key={item.id}
                role="gridcell"
                tabIndex={0}
                aria-label={
                  state === 'initial'
                    ? `Square ${item.id} of 9. Tap to reveal.`
                    : `${item.heading}. ${item.linkLabel}.`
                }
                className={cn(
                  "relative aspect-square cursor-pointer overflow-hidden",
                  "focus:outline-none focus:ring-2 focus:ring-liberation-gold-divine focus:ring-offset-1 focus:ring-offset-black",
                  "transition-all",
                  !prefersReducedMotion && "duration-500",
                  !isLoaded && "opacity-0 scale-95",
                  isLoaded && "opacity-100 scale-100",
                  // First row corners
                  item.id === 1 && "rounded-tl-2xl",
                  item.id === 3 && "rounded-tr-2xl",
                  item.id === 7 && "rounded-bl-2xl",
                  item.id === 9 && "rounded-br-2xl",
                )}
                style={{
                  animationDelay: prefersReducedMotion ? '0s' : `${item.id * 0.1}s`,
                }}
                onClick={() => {
                  if (state === 'initial') {
                    handleSquareClick(item.id);
                  } else {
                    handleNavigate(item.id, item);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, item.id, item)}
              >
                {/* Opaque cover — hides the video section until revealed */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity z-10",
                    !prefersReducedMotion && "duration-700",
                    isRevealed ? "opacity-0" : "opacity-100"
                  )}
                  style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                  }}
                >
                  {/* Initial state: mystery square */}
                  {state === 'initial' && (
                    <div className="absolute inset-0 flex items-center justify-center border border-amber-400/20 hover:border-amber-400/50 transition-colors">
                      <div className="text-gray-500 text-sm font-medium text-center px-4">
                        <div className="text-3xl mb-2 opacity-40">?</div>
                        Tap to reveal
                      </div>
                    </div>
                  )}
                </div>

                {/* Content overlay — text sits on top of the revealed image */}
                {isRevealed && (
                  <div className={cn(
                    "absolute inset-0 z-20 p-3 md:p-4 flex flex-col justify-end",
                    "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                    !prefersReducedMotion && "animate-fade-in"
                  )}>
                    <h3 className="text-sm md:text-lg font-bold text-white leading-tight mb-1">
                      {item.heading}
                    </h3>
                    <p className="text-xs text-white/70 leading-snug line-clamp-2 hidden md:block mb-2">
                      {item.description}
                    </p>
                    <span className={cn(
                      "self-start px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1",
                      state === 'visited'
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-white/20 text-white backdrop-blur-sm"
                    )}>
                      {item.linkLabel}
                      {item.isExternal && <ExternalLink className="h-3 w-3" />}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar below grid */}
      <div className="mt-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full",
                !prefersReducedMotion && "transition-all duration-700"
              )}
              style={{ width: `${(revealedCount / gridItems.length) * 100}%` }}
              role="progressbar"
              aria-valuenow={revealedCount}
              aria-valuemin={0}
              aria-valuemax={gridItems.length}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {revealedCount}/{gridItems.length}
          </span>
        </div>
      </div>
    </section>
  );
}
