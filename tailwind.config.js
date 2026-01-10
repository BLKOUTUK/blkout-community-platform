/**
 * Community Platform - Tailwind Configuration
 *
 * Uses BLKOUT Liberation Design System preset for unified visual identity.
 * Migration from legacy liberation theme to centralized design system.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Use liberation design system preset (local copy for Coolify deployment)
  presets: [require('./tailwind.preset')],

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // App-specific extensions (keep minimal, prefer design system)
      animation: {
        // Legacy animations (maintained for backward compatibility during migration)
        'gentle-fade': 'fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'soft-slide': 'slideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'scroll-fast': 'scroll 15s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
