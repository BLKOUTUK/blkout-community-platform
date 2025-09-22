// BLKOUT Liberation Platform - Service Worker
// Intelligent caching for community accessibility and offline support

const CACHE_NAME = 'blkout-liberation-v1.0.0';
const OFFLINE_CACHE = 'blkout-offline-v1.0.0';

// Assets to cache immediately (critical for first paint)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Assets to cache on first use (lazy loading strategy)
const CACHE_ON_REQUEST = [
  '/assets/', // All build assets
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// API endpoints to cache with different strategies
const API_CACHE_STRATEGIES = {
  // Cache first, then network (for relatively static content)
  cacheFirst: [
    '/api/liberation-quotes',
    '/api/platform-stats',
    '/api/community-values'
  ],
  // Network first, fallback to cache (for dynamic content)
  networkFirst: [
    '/api/events',
    '/api/news',
    '/api/stories'
  ],
  // Stale while revalidate (for user-generated content)
  staleWhileRevalidate: [
    '/api/user-profiles',
    '/api/community-updates'
  ]
};

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('🏴‍☠️ BLKOUT Liberation Platform SW installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching critical liberation platform assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🏴‍☠️ BLKOUT Liberation Platform SW activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same-origin requests (app assets)
    event.respondWith(handleAppAssets(request));
  } else if (url.hostname.includes('api') || url.pathname.startsWith('/api')) {
    // API requests
    event.respondWith(handleAPIRequest(request));
  } else if (url.hostname.includes('fonts') || url.hostname.includes('cdn')) {
    // External assets (fonts, CDNs)
    event.respondWith(handleExternalAssets(request));
  } else {
    // Default to network first
    event.respondWith(handleNetworkFirst(request));
  }
});

// Handle app assets (cache first with fallback)
async function handleAppAssets(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    console.error('Asset fetch failed:', error);

    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html') || createOfflinePage();
    }

    throw error;
  }
}

// Handle API requests with different strategies
async function handleAPIRequest(request) {
  const url = request.url;

  // Determine caching strategy based on endpoint
  if (API_CACHE_STRATEGIES.cacheFirst.some(endpoint => url.includes(endpoint))) {
    return handleCacheFirst(request);
  } else if (API_CACHE_STRATEGIES.networkFirst.some(endpoint => url.includes(endpoint))) {
    return handleNetworkFirst(request);
  } else if (API_CACHE_STRATEGIES.staleWhileRevalidate.some(endpoint => url.includes(endpoint))) {
    return handleStaleWhileRevalidate(request);
  } else {
    // Default to network first for unknown API endpoints
    return handleNetworkFirst(request);
  }
}

// Cache first strategy (for static content)
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    console.error('Cache first failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network first strategy (for dynamic content)
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    console.error('Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate strategy (for user content)
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await caches.match(request);

  // Fetch from network in background
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('Background fetch failed:', error);
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    // Don't wait for network update
    networkPromise.catch(() => {}); // Prevent unhandled rejection
    return cachedResponse;
  }

  // If no cache, wait for network
  return networkPromise;
}

// Handle external assets (CDNs, fonts, etc.)
async function handleExternalAssets(request) {
  try {
    // Try cache first for external assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const networkResponse = await fetch(request, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    console.error('External asset fetch failed:', error);

    // Try cache again as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return empty response for failed external assets
    return new Response('', { status: 204 });
  }
}

// Create offline fallback page
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BLKOUT Liberation Platform - Offline</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 20px;
          background: #1a1a1a;
          color: #f0c14b;
          text-align: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .container {
          max-width: 400px;
          padding: 40px 20px;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #f0c14b;
        }
        p {
          line-height: 1.6;
          margin-bottom: 20px;
          color: #cccccc;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }
        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 20px;
        }
        .retry-btn:hover {
          background: #b91c1c;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="offline-icon">🏴‍☠️</div>
        <h1>BLKOUT Liberation Platform</h1>
        <p>You're currently offline, but liberation continues.</p>
        <p>Check your internet connection and try again when ready.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          Reconnect to Liberation
        </button>
      </div>
    </body>
    </html>
  `;

  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background sync for form submissions when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'liberation-form-sync') {
    event.waitUntil(syncOfflineForms());
  }
});

// Sync offline form submissions
async function syncOfflineForms() {
  try {
    // Retrieve offline form data from IndexedDB or Cache API
    // This would sync story submissions, event registrations, etc.
    console.log('Syncing offline liberation forms...');

    // Implementation would depend on specific form handling
    // For now, just log the attempt

  } catch (error) {
    console.error('Failed to sync offline forms:', error);
  }
}

// Push notification handler for community updates
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.url,
      actions: [
        {
          action: 'open',
          title: 'Open Platform'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('🏴‍☠️ BLKOUT Liberation Platform Service Worker loaded successfully');