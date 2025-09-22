// BLKOUT Liberation Platform - Optimized PostCSS Configuration
// CSS optimization with PurgeCSS for community accessibility

const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),

    // PurgeCSS for production builds
    process.env.NODE_ENV === 'production' && purgecss({
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{vue,svelte}', // Future framework support
      ],

      // Safelist critical liberation platform classes
      safelist: [
        // Liberation color system
        /^liberation-/, // All liberation color variants

        // Trauma-informed interaction states
        /^hover:/,
        /^focus:/,
        /^active:/,
        /^disabled:/,

        // Accessibility states
        /^sr-only$/,
        /^not-sr-only$/,
        /^focus-visible:/,
        /^focus-within:/,

        // Animation classes for reduced motion compliance
        /^animate-/,
        /^transition-/,
        /^duration-/,
        /^ease-/,

        // Responsive classes for mobile-first design
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,

        // Dark mode support
        /^dark:/,

        // High contrast mode support
        /^high-contrast:/,

        // Dynamic classes that might be added via JavaScript
        'keyboard-navigation',
        'reduce-motion',
        'high-contrast',
        'liberation-theme',
        'trauma-informed',
        'community-mode',

        // ARIA and accessibility attributes
        /^\[aria-/,
        /^\[role=/,
        /^\[data-/,

        // Loading and error states
        /^loading/,
        /^error/,
        /^success/,

        // Interactive elements
        /^touch-friendly/,
        /^interactive/,

        // Cultural and community-specific classes
        /^cultural-/,
        /^community-/,
        /^black-queer-/,
        /^pan-african-/,

        // Performance-related classes
        /^lazy-/,
        /^preload/,
        /^critical/,
      ],

      // Extract dynamic class patterns
      defaultExtractor: (content) => {
        // Standard class extraction
        const standardClasses = content.match(/[A-Za-z0-9_-]+/g) || [];

        // Extract template literal classes
        const templateLiteralClasses = content.match(/(?<=className[=:]\s*`[^`]*)[A-Za-z0-9_-]+(?=[^`]*`)/g) || [];

        // Extract cn() and clsx() function classes
        const utilityClasses = content.match(/(?<=(?:cn|clsx)\([^)]*)[A-Za-z0-9_-]+(?=[^)]*\))/g) || [];

        // Extract conditional classes
        const conditionalClasses = content.match(/(?<=\?\s*')[A-Za-z0-9_-]+(?=')/g) || [];

        // Liberation-specific class patterns
        const liberationClasses = content.match(/liberation-[A-Za-z0-9_-]+/g) || [];

        return [
          ...standardClasses,
          ...templateLiteralClasses,
          ...utilityClasses,
          ...conditionalClasses,
          ...liberationClasses
        ];
      },

      // Blocklist - classes to always remove
      blocklist: [
        // Development-only classes
        'debug',
        'test-only',
        'dev-mode',

        // Unused framework classes
        'unused-component',
        'legacy-style',

        // Performance-heavy effects that aren't trauma-informed
        'animate-bounce',
        'animate-flash',
        'animate-pulse-fast',
      ],

      // Transform selectors for better optimization
      transform: {
        '.vue': (content) => content,
        '.js': (content) => content,
        '.ts': (content) => content,
        '.tsx': (content) => content.replace(/(?:className|class)=["'`]/g, ' '),
      },

      // Optimize font-face and keyframes
      fontFace: true,
      keyframes: true,

      // Variables support for CSS custom properties
      variables: true,

      // Reject larger unused classes first
      rejected: false, // Set to true in development to see what's being removed
    }),

    // CSS nano for additional compression in production
    process.env.NODE_ENV === 'production' && require('cssnano')({
      preset: ['advanced', {
        // Safe optimizations for liberation platform
        discardComments: { removeAll: true },
        discardDuplicates: true,
        discardEmpty: true,
        discardOverridden: true,
        discardUnused: true,

        // Merge rules carefully to preserve trauma-informed cascades
        mergeRules: false, // Disabled to preserve specific interaction states

        // Normalize values while preserving accessibility
        normalizeCharset: true,
        normalizeDisplayValues: true,
        normalizePositions: true,
        normalizeRepeatStyle: true,
        normalizeString: true,
        normalizeTimingFunctions: true,
        normalizeUnicode: true,
        normalizeUrl: true,
        normalizeWhitespace: true,

        // Color optimization with cultural sensitivity
        colormin: {
          // Preserve liberation platform color values exactly
          safe: true,
        },

        // Font optimization
        minifyFontValues: true,
        minifyGradients: true,
        minifyParams: true,
        minifySelectors: true,

        // Preserve calc() expressions for responsive design
        calc: false,

        // Safe transforms for community accessibility
        convertValues: {
          length: false, // Preserve exact accessibility measurements
          angle: true,
          time: true,
        },

        // Preserve important declarations for accessibility
        discardDuplicates: {
          // Don't merge duplicate focus states - they may be intentional
          safe: true,
        },

        // Reduce specificity carefully
        reduceIdents: false, // Preserve CSS custom property names

        // Z-index optimization with layer preservation
        zindex: false, // Preserve layering for trauma-informed UI
      }]
    }),

    // Critical CSS extraction for above-the-fold content
    process.env.NODE_ENV === 'production' && process.env.EXTRACT_CRITICAL === 'true' && require('postcss-critical-split')({
      output: 'critical',
      preserve: false,
      blockSplit: true,
      startTag: '/* critical:start */',
      endTag: '/* critical:end */',
    }),

  ].filter(Boolean), // Remove falsy plugins

  // Source map configuration
  map: process.env.NODE_ENV === 'development' ? {
    inline: true,
    sources: true,
  } : false,
};

// Export configuration for liberation platform builds
module.exports.liberationConfig = {
  // Critical CSS for first paint optimization
  criticalCSS: [
    'base',
    'components.liberation-header',
    'components.liberation-navigation',
    'components.liberation-hero',
    'utilities.accessibility',
    'utilities.trauma-informed',
  ],

  // Performance budget for CSS
  budgets: {
    maxCSSSize: '50kb', // Gzipped
    maxCriticalSize: '14kb', // Inline critical CSS limit
    maxAsyncSize: '200kb', // Non-critical CSS
  },

  // Community accessibility priorities
  accessibilityFirst: true,

  // Trauma-informed design preservation
  preserveInteractionStates: true,

  // Cultural design system preservation
  preserveLiberationColors: true,

  // Mobile-first optimization
  mobileOptimized: true,
};