// BLKOUT Liberation Platform - Optimized Loading Fallback Component
// Trauma-informed loading states with accessibility support

import React from 'react';
import { cn } from '@/lib/liberation-utils';

interface LoadingFallbackProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'liberation';
  showLogo?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Loading liberation platform...",
  size = 'medium',
  theme = 'liberation',
  showLogo = true
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerSizes = {
    small: 'p-4',
    medium: 'p-6 md:p-8',
    large: 'p-8 md:p-12'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base md:text-lg',
    large: 'text-lg md:text-xl'
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          container: 'bg-white text-gray-800',
          spinner: 'border-gray-300 border-t-gray-800',
          text: 'text-gray-600'
        };
      case 'dark':
        return {
          container: 'bg-gray-900 text-white',
          spinner: 'border-gray-600 border-t-white',
          text: 'text-gray-400'
        };
      case 'liberation':
      default:
        return {
          container: 'bg-liberation-black-power text-liberation-gold-divine',
          spinner: 'border-liberation-silver border-opacity-30 border-t-liberation-gold-divine',
          text: 'text-liberation-silver'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[200px]',
        containerSizes[size],
        themeClasses.container
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {showLogo && (
        <div className="mb-4 text-2xl md:text-3xl">
          🏴‍☠️
        </div>
      )}

      {/* Accessible loading spinner */}
      <div
        className={cn(
          'animate-spin rounded-full border-4',
          sizeClasses[size],
          themeClasses.spinner
        )}
        aria-hidden="true"
      />

      {/* Loading message */}
      <p
        className={cn(
          'mt-4 font-medium text-center max-w-md',
          textSizes[size],
          themeClasses.text
        )}
      >
        {message}
      </p>

      {/* Accessible progress indicator */}
      <div className="sr-only">
        Loading content, please wait...
      </div>

      {/* Optional trauma-informed note for longer loads */}
      {size === 'large' && (
        <p className={cn(
          'mt-2 text-xs opacity-75 text-center max-w-sm',
          themeClasses.text
        )}>
          We're preparing a safe space for you. Thank you for your patience.
        </p>
      )}
    </div>
  );
};

// Memoized loading fallback for better performance
export default React.memo(LoadingFallback);

// Predefined loading components for common use cases
export const PageLoadingFallback = () => (
  <LoadingFallback
    message="Loading page content..."
    size="large"
    showLogo={true}
  />
);

export const ComponentLoadingFallback = () => (
  <LoadingFallback
    message="Loading component..."
    size="medium"
    showLogo={false}
  />
);

export const FeatureLoadingFallback = ({ feature }: { feature: string }) => (
  <LoadingFallback
    message={`Loading ${feature}...`}
    size="medium"
    showLogo={true}
  />
);