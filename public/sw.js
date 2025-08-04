const CACHE_NAME = 'vunalet-v1.0.1' // Update this version for each build
const urlsToCache = [
  '/',
  '/products',
  '/categories',
  '/assets/logo/logo.png',
  '/assets/video/falling_leaves.mp4',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      }
    )
  )
})

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
      },
      actions: [
        {
          action: 'view',
          title: 'View Order',
          icon: '/assets/logo/logo.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/logo/logo.png'
        }
      ]
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
      clients.openWindow('/orders')
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

function doBackgroundSync() {
  // Sync offline orders when connection is restored
  return fetch('/api/sync-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Sync data from IndexedDB
    })
  })
} 