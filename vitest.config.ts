/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Global test setup
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],

    // Include patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      // Exclude pre-existing tests with missing dependencies
      'src/components/ivor/__tests__/*.test.tsx',
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/__tests__/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      // Coverage thresholds for critical paths
      thresholds: {
        // Intelligence queries coverage
        'src/services/**/intelligence*.ts': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        // Newsletter generation coverage
        'src/components/**/newsletter*.tsx': {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
        // Feedback loop coverage
        'src/components/**/feedback*.tsx': {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
        // Overall project minimum
        global: {
          statements: 60,
          branches: 55,
          functions: 60,
          lines: 60,
        },
      },
    },

    // Reporter configuration
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './test-results/results.json',
    },

    // Timeout for async tests
    testTimeout: 10000,

    // Watch mode exclude
    watchExclude: ['node_modules', 'dist'],
  },

  // Resolve aliases matching tsconfig
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
