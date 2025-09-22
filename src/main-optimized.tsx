// BLKOUT Liberation Platform - Optimized Application Entry Point
// Layer 1: Community Frontend Presentation Layer with Performance Optimizations
// STRICT SEPARATION: Application bootstrap only - NO business logic

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-optimized.tsx';
import './index.css';

// Import performance monitoring
import './lib/performance-monitor';

/**
 * QI COMPLIANCE: Optimized Application Entry Point
 * BOUNDARY ENFORCEMENT: Presentation layer bootstrap only
 * LIBERATION VALUES: Platform initialization with community values
 * ACCESSIBILITY: React 18 with concurrent features for better UX
 * PERFORMANCE: Service worker registration and Core Web Vitals monitoring
 */

// Service Worker Registration for Offline Support
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw-liberation.js', {
        scope: '/'
      });

      console.log('🏴‍☠️ Liberation Platform Service Worker registered:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('🔄 New Liberation Platform version available');

              // Optionally show update notification to user
              if (window.confirm('A new version of the Liberation Platform is available. Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('🔄 Liberation Platform cache updated');
        }
      });

    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
}

// Progressive Web App Features
async function initializePWAFeatures() {
  // Register service worker
  await registerServiceWorker();

  // Setup push notifications if supported
  if ('Notification' in window && 'PushManager' in window) {
    // Request notification permission for community updates
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('🔔 Liberation Platform notifications enabled');
      }
    }
  }

  // Setup background sync for offline form submissions
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    console.log('🔄 Background sync available for liberation forms');
  }
}

// Performance Optimizations
function setupPerformanceOptimizations() {
  // Preload critical resources
  const criticalResources = [
    '/assets/vendor-react.js',
    '/assets/vendor-ui.js',
    '/assets/components-ui.js'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = resource;
    document.head.appendChild(link);
  });

  // Setup font display optimization
  const fontLinks = document.querySelectorAll('link[href*="fonts"]');
  fontLinks.forEach(link => {
    link.setAttribute('rel', 'preload');
    link.setAttribute('as', 'font');
    link.setAttribute('crossorigin', '');
  });

  // Optimize images with loading strategies
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      // Set lazy loading for non-critical images
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.setAttribute('loading', 'lazy');
      }
    }
  });
}

// Accessibility Enhancements
function setupAccessibilityEnhancements() {
  // Enhanced focus management
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Screen reader announcements for dynamic content
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.id = 'liberation-announcer';
  document.body.appendChild(announcer);

  // Global escape key handler for trauma-informed design
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Close any open modals or overlays
      const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
      openModals.forEach(modal => {
        const closeButton = modal.querySelector('[aria-label*="close"], [data-close]');
        if (closeButton && closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      });
    }
  });

  // Reduced motion compliance
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add('reduce-motion');
  }

  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  });
}

// Liberation Platform Metadata and Values
function setupLiberationMetadata() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found - Liberation platform cannot initialize');
  }

  // Set liberation platform metadata
  rootElement.setAttribute('data-liberation-platform', 'true');
  rootElement.setAttribute('data-creator-sovereignty', '75-percent');
  rootElement.setAttribute('data-community-governance', 'democratic');
  rootElement.setAttribute('data-trauma-informed', 'true');
  rootElement.setAttribute('data-performance-optimized', 'true');

  // Set up theme and color scheme
  document.documentElement.setAttribute('data-theme', 'liberation');

  // Support for high contrast mode
  const highContrastMedia = window.matchMedia('(prefers-contrast: high)');
  if (highContrastMedia.matches) {
    document.documentElement.classList.add('high-contrast');
  }

  highContrastMedia.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  });
}

// Error Boundary for Application Bootstrap
class BootstrapErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Liberation Platform Bootstrap Error:', error, errorInfo);

    // Send error to monitoring if available
    if (window.liberationPerformanceMonitor) {
      window.liberationPerformanceMonitor.recordMetric?.('Bootstrap-Error', 1, 'poor');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">🏴‍☠️</div>
            <h1 className="text-2xl font-bold mb-4 text-yellow-400">BLKOUT Liberation Platform</h1>
            <p className="text-gray-300 mb-4">Platform initialization failed. Liberation continues.</p>
            <p className="text-sm text-gray-500 mb-4">
              Error: {this.state.error?.message || 'Unknown bootstrap error'}
            </p>
            <button
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Restart Liberation Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Initialize Application
async function initializeApp() {
  try {
    // Setup platform metadata and accessibility
    setupLiberationMetadata();
    setupAccessibilityEnhancements();
    setupPerformanceOptimizations();

    // Initialize PWA features
    await initializePWAFeatures();

    // Get root element
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    // Initialize React root with concurrent features
    const root = ReactDOM.createRoot(rootElement);

    // Render liberation platform with error boundary
    root.render(
      <React.StrictMode>
        <BootstrapErrorBoundary>
          <App />
        </BootstrapErrorBoundary>
      </React.StrictMode>
    );

    // Performance monitoring
    if (window.liberationPerformanceMonitor) {
      // Track successful initialization
      window.liberationPerformanceMonitor.recordMetric?.('App-Initialization', performance.now(), 'good');
    }

    console.log('🏴‍☠️ BLKOUT Liberation Platform initialized successfully');

  } catch (error) {
    console.error('Liberation Platform initialization failed:', error);

    // Fallback rendering
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          min-height: 100vh;
          background: #1a1a1a;
          color: #f0c14b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: system-ui, sans-serif;
        ">
          <div style="text-align: center; max-width: 400px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">🏴‍☠️</div>
            <h1 style="margin-bottom: 20px;">BLKOUT Liberation Platform</h1>
            <p style="margin-bottom: 20px; color: #ccc;">
              Platform initialization failed. Please refresh to try again.
            </p>
            <button
              onclick="window.location.reload()"
              style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
              "
            >
              Refresh Platform
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}