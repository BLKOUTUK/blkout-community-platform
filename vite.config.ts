import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure accessibility and performance for community access
    target: 'es2015',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Simplified chunking for Vercel compatibility
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', 'lucide-react'],
          'vendor-api': ['@supabase/supabase-js'],
          'vendor-utils': ['clsx', 'tailwind-merge'],
          'vendor-other': ['framer-motion']
        },
        // Content-based hashing ensures browsers fetch new versions when code changes
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable compression
    reportCompressedSize: true
  },
  server: {
    // Development server accessible for community testing
    host: true,
    port: 3000
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      'lucide-react',
      'clsx'
    ]
  }
})