const CACHE_NAME = 'vunalet-v1.0.2'
const STATIC_CACHE = 'vunalet-static-v1.0.2'
const DYNAMIC_CACHE = 'vunalet-dynamic-v1.0.2'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/products',
  '/categories',
  '/farmers',
  '/dashboard',
  '/assets/logo/logo.png',
  '/assets/video/falling_leaves.mp4',
  '/manifest.json',
  '/favicon.ico'
]

// API endpoints to cache
const API_CACHE = [
  '/api/products',
  '/api/categories',
  '/api/farmers'
]

// Install event - cache static assets
self.addEventListener('install', function (event) {
  console.log('Service Worker installing...')
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Caching API endpoints')
        return cache.addAll(API_CACHE)
      })
    ])
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function (event) {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/_next/')) {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Default: try cache first, then network
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request)
    })
  )
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response(JSON.stringify({ error: 'Offline - No cached data available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    return new Response('Offline - Asset not available', { status: 503 })
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    // Return offline page
    return caches.match('/')
  }
}

// Push notification event
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/assets/logo/logo.png',
      badge: '/assets/logo/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1',
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/assets/logo/logo.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/logo/logo.png'
        }
      ],
      requireInteraction: true,
      tag: data.tag || 'vunalet-notification'
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Notification click event
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync for offline orders
self.addEventListener('sync', function (event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Get offline data from IndexedDB
    const offlineData = await getOfflineData()
    
    if (offlineData && offlineData.length > 0) {
      // Sync each offline item
      for (const item of offlineData) {
        await syncOfflineItem(item)
      }
      
      // Show success notification
      await self.registration.showNotification('Sync Complete', {
        body: 'Your offline data has been synced',
        icon: '/assets/logo/logo.png'
      })
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Helper function to get offline data (placeholder)
async function getOfflineData() {
  // This would typically interact with IndexedDB
  // For now, return empty array
  return []
}

// Helper function to sync offline item (placeholder)
async function syncOfflineItem(item) {
  // This would typically make API calls to sync data
  console.log('Syncing offline item:', item)
} 