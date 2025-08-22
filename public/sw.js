const CACHE_VERSION = 'v1.0.3';
const STATIC_CACHE = `vunalet-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `vunalet-dynamic-${CACHE_VERSION}`;
const API_CACHE = `vunalet-api-${CACHE_VERSION}`;

// Essential static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo/logo-192x192.png',
  '/assets/logo/logo-512x512.png',
  '/assets/logo/logo.png'
];

// Routes to cache for offline navigation
const ROUTES_TO_CACHE = [
  '/',
  '/products',
  '/categories', 
  '/farmers',
  '/dashboard'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        const staticCache = await caches.open(STATIC_CACHE);
        console.log('[SW] Caching static assets');
        
        // Cache essential assets one by one to handle failures gracefully
        const cachePromises = STATIC_ASSETS.map(async (asset) => {
          try {
            const response = await fetch(asset);
            if (response.ok) {
              await staticCache.put(asset, response);
              console.log(`[SW] Cached: ${asset}`);
            } else {
              console.warn(`[SW] Failed to cache ${asset}: ${response.status}`);
            }
          } catch (error) {
            console.warn(`[SW] Error caching ${asset}:`, error.message);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('[SW] Service worker installed successfully');
        
      } catch (error) {
        console.error('[SW] Install failed:', error);
        throw error;
      }
    })()
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
        
        // Delete old caches
        const deletePromises = cacheNames
          .filter(cacheName => !validCaches.includes(cacheName))
          .map(cacheName => {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          });
        
        await Promise.all(deletePromises);
        console.log('[SW] Service worker activated');
        
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - handle requests with appropriate strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests: Network first, cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (request.destination === 'image' || url.pathname.startsWith('/assets/')) {
    // Static assets: Cache first, network fallback
    event.respondWith(handleStaticRequest(request));
  } else if (request.mode === 'navigate') {
    // Navigation requests: Network first with offline fallback
    event.respondWith(handleNavigationRequest(request));
  } else {
    // Other requests: Try cache first, then network
    event.respondWith(handleGenericRequest(request));
  }
});

// Handle API requests - Network first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  
  try {
    console.log(`[SW] Fetching API: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log(`[SW] API request failed, checking cache: ${request.url}`);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`[SW] Serving API from cache: ${request.url}`);
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline - No cached data available',
        offline: true 
      }), 
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Handle static assets - Cache first strategy  
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log(`[SW] Serving from cache: ${request.url}`);
    return cachedResponse;
  }
  
  try {
    console.log(`[SW] Fetching static asset: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the response for future use
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error(`[SW] Failed to fetch static asset: ${request.url}`, error);
    
    // Return a placeholder response for failed static assets
    return new Response('Asset not available offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle navigation requests - Network first with offline fallback
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  try {
    console.log(`[SW] Fetching navigation: ${request.url}`);
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful navigation responses
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log(`[SW] Navigation failed, trying cache: ${request.url}`);
    
    // Try to find cached version of the specific route
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to cached root page
    const rootResponse = await cache.match('/');
    if (rootResponse) {
      console.log('[SW] Serving root page as fallback');
      return rootResponse;
    }
    
    // Last resort offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Vunalet - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: #f3f4f6;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .emoji { font-size: 3rem; margin-bottom: 1rem; }
            h1 { color: #22c55e; margin-bottom: 1rem; }
            p { color: #6b7280; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="emoji">🌱</div>
            <h1>You're Offline</h1>
            <p>Vunalet is currently unavailable. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()" style="
              background: #22c55e; 
              color: white; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 6px; 
              cursor: pointer;
              margin-top: 1rem;
            ">
              Try Again
            </button>
          </div>
        </body>
      </html>`,
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return a generic offline response
    return new Response('Content not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (!event.data) {
    console.log('[SW] Push event has no data');
    return;
  }
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update available',
      icon: data.icon || '/assets/logo/logo-192x192.png',
      badge: '/assets/logo/logo-96x96.png',
      image: data.image,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.id || '1',
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'close', 
          title: 'Close'
        }
      ],
      requireInteraction: false,
      tag: data.tag || 'vunalet-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Vunalet', options)
    );
  } catch (error) {
    console.error('[SW] Error handling push notification:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.action === 'view' 
    ? event.notification.data?.url || '/'
    : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is already open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync handler
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    console.log('[SW] Performing background sync...');
    
    // Here you would typically:
    // 1. Get offline data from IndexedDB
    // 2. Sync with your API
    // 3. Show success notification
    
    // For now, just log that sync completed
    console.log('[SW] Background sync completed');
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

console.log(`[SW] Service worker loaded - Cache version: ${CACHE_VERSION}`); 