// BLKOUT Liberation Platform - Optimized Image Component
// Lazy loading, compression, and accessibility-first image handling

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/liberation-utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty' | React.ReactNode;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fallbackSrc?: string;
  liberationMode?: boolean; // Community-specific optimizations
  culturalContext?: string; // For cultural sensitivity
}

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  isIntersecting: boolean;
  hasLoaded: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  srcSet,
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
  liberationMode = true,
  culturalContext,
  className,
  style,
  ...props
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    isIntersecting: !priority, // Priority images start as intersecting
    hasLoaded: false
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || imageState.hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setImageState(prev => ({ ...prev, isIntersecting: true }));
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, imageState.hasLoaded]);

  // Generate optimized src based on requirements
  const getOptimizedSrc = useCallback((originalSrc: string): string => {
    if (!liberationMode || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return originalSrc;
    }

    // Community image optimization service (if available)
    const params = new URLSearchParams();

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());

    // Cultural sensitivity parameters
    if (culturalContext) {
      params.set('context', culturalContext);
    }

    // If we have an optimization service, use it
    if (originalSrc.includes('liberation-cdn') || originalSrc.includes('blkout-assets')) {
      return `${originalSrc}?${params.toString()}`;
    }

    return originalSrc;
  }, [width, height, quality, liberationMode, culturalContext]);

  // Generate srcSet for responsive images
  const getResponsiveSrcSet = useCallback((originalSrc: string): string => {
    if (srcSet) return srcSet;
    if (!liberationMode || !width) return '';

    const breakpoints = [480, 768, 1024, 1280, 1920];
    const srcSetEntries = breakpoints.map(bp => {
      const scaledWidth = Math.min(bp, width);
      const optimizedSrc = getOptimizedSrc(originalSrc);
      return `${optimizedSrc}&w=${scaledWidth} ${scaledWidth}w`;
    });

    return srcSetEntries.join(', ');
  }, [srcSet, liberationMode, width, getOptimizedSrc]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      hasLoaded: true,
      hasError: false
    }));

    // Performance tracking
    if (window.liberationPerformanceMonitor) {
      window.liberationPerformanceMonitor.recordMetric?.('Image-Load-Success', performance.now(), 'good');
    }

    onLoad?.();
  }, [onLoad]);

  // Handle image load error
  const handleError = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      hasError: true
    }));

    // Performance tracking
    if (window.liberationPerformanceMonitor) {
      window.liberationPerformanceMonitor.recordMetric?.('Image-Load-Error', 1, 'poor');
    }

    onError?.();
  }, [onError]);

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      if (getResponsiveSrcSet(src)) {
        link.imageSrcset = getResponsiveSrcSet(src);
      }
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, getOptimizedSrc, getResponsiveSrcSet]);

  // Generate blur placeholder
  const getBlurDataURL = (): string => {
    if (blurDataURL) return blurDataURL;

    // Generate simple blur placeholder for liberation platform
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="liberation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f0c14b;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#liberation-gradient)" />
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#f0c14b" fill-opacity="0.5" font-family="system-ui" font-size="14">
          🏴‍☠️
        </text>
      </svg>
    `)}`;
  };

  // Render placeholder
  const renderPlaceholder = () => {
    if (placeholder === 'empty') return null;

    if (React.isValidElement(placeholder)) {
      return placeholder;
    }

    if (placeholder === 'blur') {
      return (
        <img
          src={getBlurDataURL()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          style={{ objectFit, objectPosition }}
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-liberation-black-power bg-opacity-50">
      <div className="flex flex-col items-center gap-2 text-liberation-gold-divine">
        <div className="w-6 h-6 border-2 border-liberation-gold-divine border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Loading...</span>
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-liberation-black-power text-liberation-silver">
      <div className="text-center p-4">
        <div className="text-2xl mb-2">🏴‍☠️</div>
        <p className="text-sm">Image unavailable</p>
        {culturalContext && (
          <p className="text-xs opacity-75 mt-1">Context: {culturalContext}</p>
        )}
      </div>
    </div>
  );

  // Calculate responsive sizes if not provided
  const responsiveSizes = sizes || (width ? `(max-width: 768px) 100vw, ${width}px` : '100vw');

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        liberationMode && 'liberation-image-container',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
        ...style
      }}
    >
      {/* Placeholder */}
      {!imageState.hasLoaded && renderPlaceholder()}

      {/* Main Image */}
      {(imageState.isIntersecting || priority) && !imageState.hasError && (
        <img
          ref={imgRef}
          src={getOptimizedSrc(src)}
          srcSet={getResponsiveSrcSet(src)}
          sizes={responsiveSizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            imageState.hasLoaded ? 'opacity-100' : 'opacity-0',
            liberationMode && 'liberation-optimized-image'
          )}
          style={{
            objectFit,
            objectPosition
          }}
          {...props}
        />
      )}

      {/* Fallback Image */}
      {imageState.hasError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="w-full h-full"
          style={{
            objectFit,
            objectPosition
          }}
          onError={() => setImageState(prev => ({ ...prev, hasError: true }))}
        />
      )}

      {/* Loading State */}
      {imageState.isLoading && imageState.isIntersecting && renderLoadingState()}

      {/* Error State */}
      {imageState.hasError && !fallbackSrc && renderErrorState()}

      {/* Screen reader description for cultural context */}
      {culturalContext && (
        <span className="sr-only">
          Image in {culturalContext} context
        </span>
      )}
    </div>
  );
};

// Memoized export for performance
export default React.memo(OptimizedImage);

// Specialized image components for liberation platform

// Liberation Hero Image
export const LiberationHeroImage: React.FC<{
  src: string;
  alt: string;
  overlayContent?: React.ReactNode;
}> = ({ src, alt, overlayContent }) => (
  <div className="relative">
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority={true}
      quality={85}
      objectFit="cover"
      culturalContext="liberation-hero"
      className="w-full h-64 md:h-96 lg:h-[500px]"
    />
    {overlayContent && (
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        {overlayContent}
      </div>
    )}
  </div>
);

// Community Avatar Image
export const CommunityAvatar: React.FC<{
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
}> = ({ src, alt, size = 'md', fallbackInitials }) => {
  const sizes = {
    sm: { width: 32, height: 32, className: 'w-8 h-8' },
    md: { width: 48, height: 48, className: 'w-12 h-12' },
    lg: { width: 64, height: 64, className: 'w-16 h-16' },
    xl: { width: 96, height: 96, className: 'w-24 h-24' }
  };

  const { width, height, className } = sizes[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      objectFit="cover"
      culturalContext="community-avatar"
      className={cn(className, 'rounded-full border-2 border-liberation-gold-divine')}
      fallbackSrc={
        fallbackInitials
          ? `data:image/svg+xml;base64,${btoa(`
              <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${width/2}" cy="${height/2}" r="${width/2}" fill="#1a1a1a" />
                <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#f0c14b" font-family="system-ui" font-size="${width/3}" font-weight="bold">
                  ${fallbackInitials}
                </text>
              </svg>
            `)}`
          : undefined
      }
    />
  );
};

// Story Archive Image
export const StoryArchiveImage: React.FC<{
  src: string;
  alt: string;
  caption?: string;
}> = ({ src, alt, caption }) => (
  <figure className="liberation-story-image">
    <OptimizedImage
      src={src}
      alt={alt}
      width={800}
      height={600}
      quality={80}
      objectFit="cover"
      culturalContext="story-archive"
      className="w-full h-48 md:h-64 rounded-lg"
    />
    {caption && (
      <figcaption className="mt-2 text-sm text-liberation-silver italic">
        {caption}
      </figcaption>
    )}
  </figure>
);

// Event Thumbnail Image
export const EventThumbnail: React.FC<{
  src: string;
  alt: string;
  isUpcoming?: boolean;
}> = ({ src, alt, isUpcoming = true }) => (
  <div className="relative">
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      quality={75}
      objectFit="cover"
      culturalContext="community-event"
      className="w-full h-32 rounded-lg"
    />
    {!isUpcoming && (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
        <span className="text-liberation-silver text-sm font-medium">Past Event</span>
      </div>
    )}
  </div>
);