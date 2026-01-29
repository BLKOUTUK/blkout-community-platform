/**
 * Animated Liberation Grid
 *
 * A 9-square progressive reveal grid embodying BLKOUT's values:
 * - "Don't judge a book by its cover" - squares look identical initially
 * - Progressive revelation - click to discover content
 * - Collective reward - visiting all reveals complete image
 *
 * Accessibility: WCAG 2.1 AA compliant
 * - Keyboard navigable
 * - Reduced motion support
 * - Screen reader friendly
 */

import { useState, useEffect, useCallback } from 'react';
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

        // Check if all were already visited
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
      // Load all immediately if reduced motion preferred
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
    }, 150); // Load each square every 150ms

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
    // Mark as visited
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

    // Navigate
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

  // Calculate collective image reveal progress
  const visitedCount = Object.values(visitedLinks).filter(Boolean).length;
  const progressPercentage = (visitedCount / gridItems.length) * 100;

  return (
    <section className="py-8" aria-label="Explore BLKOUT - Interactive Grid">
      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-liberation-gold-divine mb-3">
          Explore BLKOUT
        </h2>
        <p className="text-liberation-silver/80 max-w-2xl mx-auto mb-4">
          Each square holds a piece of our story. Click to reveal, click again to explore.
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 text-sm text-liberation-silver/60">
          <span>{visitedCount}/{gridItems.length} discovered</span>
          {visitedCount > 0 && visitedCount < gridItems.length && (
            <span className="text-liberation-gold-divine">Keep exploring!</span>
          )}
          {collectiveImageRevealed && (
            <span className="text-liberation-green-africa">Complete picture revealed!</span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
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
                "relative aspect-square rounded-xl cursor-pointer overflow-hidden",
                "border-2 focus:outline-none focus:ring-2 focus:ring-liberation-gold-divine focus:ring-offset-2 focus:ring-offset-liberation-black-power",
                "transition-all",
                !prefersReducedMotion && "duration-500",
                !isLoaded && "opacity-0 scale-90",
                isLoaded && !prefersReducedMotion && "opacity-100 scale-100 animate-grid-load",
                isLoaded && prefersReducedMotion && "opacity-100 scale-100",
                state === 'initial' && "border-liberation-gold-divine/30 bg-liberation-black-power hover:border-liberation-gold-divine hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]",
                state === 'revealed' && "border-liberation-gold-divine bg-liberation-black-power/80",
                state === 'visited' && "border-liberation-gold-divine/40 bg-gradient-to-br from-liberation-black-power to-black hover:border-liberation-gold-divine/70"
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
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                {/* Revealed content: heading + description + link */}
                {isRevealed && (
                  <>
                    <div>
                      <h3 className={cn(
                        "text-xl md:text-2xl font-bold mb-2",
                        !prefersReducedMotion && "transition-all duration-500",
                        state === 'visited' ? "text-white/80" : "text-white"
                      )}>
                        {item.heading}
                      </h3>
                      <p className={cn(
                        "text-sm md:text-base leading-relaxed",
                        !prefersReducedMotion && "animate-slide-up",
                        state === 'visited' ? "text-liberation-silver/60" : "text-liberation-silver"
                      )}>
                        {item.description}
                      </p>
                    </div>

                    <div className={cn(
                      "mt-auto flex items-center justify-between",
                      !prefersReducedMotion && "animate-fade-in"
                    )}>
                      <span className={cn(
                        "px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2",
                        state === 'visited'
                          ? "bg-liberation-gold-divine/20 text-liberation-gold-divine"
                          : "bg-liberation-pink-power text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                      )}>
                        {item.linkLabel}
                        {item.isExternal && <ExternalLink className="h-4 w-4" />}
                      </span>
                      {state === 'visited' && (
                        <span className="text-xs text-liberation-gold-divine/60">✓</span>
                      )}
                    </div>
                  </>
                )}

                {/* Initial state hint */}
                {state === 'initial' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-liberation-silver/50 text-sm font-medium text-center px-4">
                      <div className="text-3xl mb-2 opacity-30">?</div>
                      Tap to reveal
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collective Image Progress Section */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="bg-liberation-black-power/50 rounded-xl p-6 border border-liberation-gold-divine/20">
          <h3 className="text-xl font-bold text-liberation-gold-divine mb-3 text-center">
            The Collective Picture
          </h3>
          <p className="text-liberation-silver/70 text-sm mb-4 text-center">
            Visit all nine squares to reveal the complete image of our collective liberation.
          </p>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-2 text-xs text-liberation-silver/60">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-2 bg-liberation-black-power rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-liberation-gold-divine to-liberation-pink-power",
                !prefersReducedMotion && "transition-all duration-700"
              )}
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Complete image reveal */}
          {collectiveImageRevealed && (
            <div className={cn(
              "mt-6",
              !prefersReducedMotion && "animate-fade-in"
            )}>
              <div className="text-center mb-4">
                <div className="inline-block p-3 rounded-full bg-gradient-to-r from-liberation-gold-divine to-liberation-pink-power mb-3">
                  <span className="text-2xl">🎉</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Complete Picture Revealed!</h4>
                <p className="text-liberation-silver/70 text-sm">
                  All nine squares explored. Together, we form the complete vision of liberation.
                </p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-liberation-gold-divine">
                {videoError ? (
                  <img
                    src={collectiveFallbackImage}
                    alt="Collective vision of Black queer liberation - community members together"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={collectiveVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onError={() => setVideoError(true)}
                  >
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
