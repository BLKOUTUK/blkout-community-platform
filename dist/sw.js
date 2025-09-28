// BLKOUT Liberation Platform Service Worker
// Community-focused offline capabilities and caching

const CACHE_NAME = 'blkout-liberation-v1.0.0';
const STATIC_CACHE_NAME = 'blkout-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'blkout-dynamic-v1.0.0';

// Essential liberation platform assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  // Core platform styles and scripts will be added by Vite build
];

// Community-prioritized API endpoints for offline support
const LIBERATION_API_ENDPOINTS = [
  '/api/events',
  '/api/stories',
  '/api/news',
  '/api/community/values',
  '/api/ivor/responses'
];

// Install event - cache essential community resources
self.addEventListener('install', (event) => {
  console.log('🏴‍☠️ BLKOUT Liberation SW: Installing...');

  event.waitUntil(
    Promise.all([
      // Cache static liberation platform assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('🏴‍☠️ Caching liberation platform assets');
        return cache.addAll(STATIC_ASSETS);
      }),

      // Pre-cache community values for offline access
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('🏴‍☠️ Pre-caching community liberation values');
        // Community values always available offline
        const liberationValues = {
          creatorSovereignty: '75% minimum revenue share',
          democraticGovernance: 'Community-driven decisions',
          traumaInformed: 'Healing-centered design',
          economicJustice: 'Cooperative ownership'
        };

        const response = new Response(JSON.stringify(liberationValues), {
          headers: { 'Content-Type': 'application/json' }
        });

        return cache.put('/api/community/values', response);
      })
    ]).then(() => {
      console.log('🏴‍☠️ BLKOUT Liberation SW: Installation complete');
      // Take control immediately for liberation platform
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches, claim clients
self.addEventListener('activate', (event) => {
  console.log('🏴‍☠️ BLKOUT Liberation SW: Activating...');

  event.waitUntil(
    Promise.all([
      // Clean up old community caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME &&
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('blkout-')) {
              console.log('🏴‍☠️ Removing old liberation cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Take control of all liberation platform pages
      self.clients.claim()
    ]).then(() => {
      console.log('🏴‍☠️ BLKOUT Liberation SW: Activation complete - Community power activated!');
    })
  );
});

// Fetch event - liberation-focused caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Only handle GET requests for liberation platform
  if (request.method !== 'GET') {
    return;
  }

  // Liberation platform navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Community API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Static liberation platform assets
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // All other liberation platform resources
  event.respondWith(handleDynamicRequest(request));
});

// Handle navigation with liberation platform shell
async function handleNavigationRequest(request) {
  try {
    // Try network first for fresh liberation content
    const networkResponse = await fetch(request);

    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('🏴‍☠️ Navigation offline, serving liberation platform shell');

    // Serve cached liberation platform or fallback
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('/index.html');

    if (cachedResponse) {
      return cachedResponse;
    }

    // Liberation platform offline fallback
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BLKOUT Liberation Platform - Offline</title>
          <style>
            body {
              font-family: system-ui;
              background: #000;
              color: #FFD700;
              text-align: center;
              padding: 2rem;
            }
            .logo { font-size: 2rem; margin-bottom: 1rem; }
            .message { font-size: 1.2rem; margin-bottom: 1rem; }
            .values { color: #C0C0C0; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="logo">🏴‍☠️ BLKOUT Liberation Platform</div>
          <div class="message">Liberation continues offline.</div>
          <div class="values">
            Creator Sovereignty • Democratic Governance<br>
            Trauma-Informed Design • Economic Justice
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle community API requests with liberation-focused caching
async function handleAPIRequest(request) {
  const url = new URL(request.url);

  try {
    // Try network first for fresh community data
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache community API responses for offline access
      const cache = await caches.open(DYNAMIC_CACHE_NAME);

      // Clone response for caching (responses can only be consumed once)
      cache.put(request, networkResponse.clone());

      return networkResponse;
    }

    throw new Error(`API error: ${networkResponse.status}`);
  } catch (error) {
    console.log('🏴‍☠️ API offline, serving cached community data for:', url.pathname);

    // Serve cached community data
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Liberation-focused offline API fallback
    return createOfflineFallback(url.pathname);
  }
}

// Handle static liberation platform assets
async function handleStaticAsset(request) {
  // Safety check: don't cache chrome-extension or other non-http schemes
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) {
    console.log('🚫 Ignoring non-http request:', request.url);
    return fetch(request);
  }

  // Cache-first for static liberation platform assets
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('🏴‍☠️ Static asset unavailable:', request.url);
    throw error;
  }
}

// Handle dynamic liberation platform requests
async function handleDynamicRequest(request) {
  try {
    // Network first for fresh liberation content
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fallback to cached liberation content
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Check if URL is a static liberation platform asset
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname === '/manifest.json' ||
         url.pathname === '/favicon.ico';
}

// Create liberation-focused offline fallbacks
function createOfflineFallback(pathname) {
  const fallbacks = {
    '/api/events': {
      events: [],
      message: 'Community events available when online. Liberation organizing continues.',
      offline: true
    },
    '/api/stories': {
      stories: [],
      message: 'Community stories available when online. Your voice matters.',
      offline: true
    },
    '/api/news': {
      news: [],
      message: 'Liberation news available when online. Stay connected to community.',
      offline: true
    },
    '/api/community/values': {
      creatorSovereignty: '75% minimum revenue share ensures creators maintain economic power',
      democraticGovernance: 'Community members vote on platform decisions and resource allocation',
      traumaInformed: 'Every interaction designed with healing, safety, and community wellbeing',
      economicJustice: 'Cooperative ownership model ensures wealth stays in our communities',
      offline: true
    }
  };

  const fallback = fallbacks[pathname] || {
    message: 'Liberation platform content available when online.',
    offline: true
  };

  return new Response(JSON.stringify(fallback), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Background sync for community actions when back online
self.addEventListener('sync', (event) => {
  console.log('🏴‍☠️ Background sync triggered:', event.tag);

  if (event.tag === 'liberation-sync') {
    event.waitUntil(syncCommunityData());
  }
});

// Sync community data when connection restored
async function syncCommunityData() {
  try {
    console.log('🏴‍☠️ Syncing community liberation data...');

    // Sync community events, stories, and platform updates
    const syncEndpoints = ['/api/events', '/api/stories', '/api/news'];

    await Promise.all(
      syncEndpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(endpoint, response.clone());
          }
        } catch (error) {
          console.log(`🏴‍☠️ Sync failed for ${endpoint}:`, error);
        }
      })
    );

    console.log('🏴‍☠️ Community data sync complete - Liberation platform updated!');
  } catch (error) {
    console.error('🏴‍☠️ Community sync error:', error);
  }
}

// Message handling for liberation platform updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🏴‍☠️ Liberation platform update requested');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      liberation: true,
      communityPowered: true
    });
  }
});