# Vunalet PWA Setup Guide

## Overview

Vunalet is configured as a Progressive Web App (PWA) that provides a native app-like experience on mobile devices. This setup includes offline functionality, push notifications, and app installation capabilities.

## Features

### ✅ Implemented Features

1. **App Installation**
   - Install prompt for mobile devices
   - Standalone app mode
   - App shortcuts for quick access

2. **Offline Functionality**
   - Service Worker with intelligent caching
   - IndexedDB for offline data storage
   - Background sync for offline orders

3. **Push Notifications**
   - Order status updates
   - Delivery notifications
   - Custom notification actions

4. **Performance Optimizations**
   - Static asset caching
   - API response caching
   - Bundle optimization

## File Structure

```
vunalet/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── assets/logo/logo.png   # App icons
├── components/
│   └── PWAInstaller.tsx       # PWA installation component
├── lib/pwa/
│   ├── notification-service.ts # Push notification service
│   └── offline-storage.ts     # IndexedDB storage service
└── app/layout.tsx             # PWA meta tags and registration
```

## Configuration

### Manifest.json

The PWA manifest includes:
- App name and description
- Multiple icon sizes for different devices
- App shortcuts for quick navigation
- Theme colors and display settings

### Service Worker (sw.js)

Implements multiple caching strategies:
- **Static Assets**: Cache-first strategy
- **API Requests**: Network-first strategy
- **Navigation**: Network-first with fallback

### Caching Strategy

1. **Static Cache**: Images, CSS, JS files
2. **Dynamic Cache**: API responses
3. **Runtime Cache**: User-generated content

## Usage

### Installation

Users can install the PWA by:
1. Visiting the website on a mobile device
2. Tapping the "Install" button in the browser
3. Using the install prompt that appears

### Offline Usage

The app works offline with:
- Cached product listings
- Offline order creation
- Background sync when connection is restored

### Push Notifications

To enable push notifications:
1. Grant notification permission
2. Subscribe to push notifications
3. Receive order updates and delivery notifications

## Development

### Testing PWA Features

1. **Installation**: Use Chrome DevTools > Application > Manifest
2. **Service Worker**: Use Chrome DevTools > Application > Service Workers
3. **Offline Mode**: Use Chrome DevTools > Network > Offline
4. **Push Notifications**: Use Chrome DevTools > Application > Push Messaging

### Debugging

```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});

// Check IndexedDB
indexedDB.databases().then(databases => {
  console.log('IndexedDB databases:', databases);
});
```

## Deployment

### Production Checklist

- [ ] Update service worker version in `sw.js`
- [ ] Ensure all icon sizes are available
- [ ] Test offline functionality
- [ ] Verify push notification setup
- [ ] Check PWA audit scores

### PWA Audit

Run Lighthouse PWA audit to ensure:
- Installable (score: 100)
- PWA Optimized (score: 100)
- Fast and Reliable (score: 90+)

## API Integration

### Push Notifications

To send push notifications:

```javascript
// Subscribe to notifications
const subscription = await notificationService.subscribeToPushNotifications(vapidKey);

// Send notification
await fetch('/api/push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subscription,
    notification: {
      title: 'Order Update',
      body: 'Your order has been confirmed',
      url: '/dashboard'
    }
  })
});
```

### Offline Storage

```javascript
// Save offline order
const orderId = await offlineStorage.saveOfflineOrder(orderData);

// Get unsynced orders
const unsyncedOrders = await offlineStorage.getUnsyncedOrders();

// Mark as synced
await offlineStorage.markOrderAsSynced(orderId);
```

## Browser Support

- ✅ Chrome/Edge (Chromium-based)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Check HTTPS requirement
   - Verify file path in registration
   - Check browser console for errors

2. **Install Prompt Not Showing**
   - Ensure PWA criteria are met
   - Check manifest.json validity
   - Verify service worker is active

3. **Offline Mode Not Working**
   - Check IndexedDB support
   - Verify cache strategies
   - Test with network throttling

### Debug Commands

```javascript
// Force service worker update
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.update());
});

// Clear all caches
caches.keys().then(cacheNames => {
  cacheNames.forEach(cacheName => caches.delete(cacheName));
});

// Clear IndexedDB
indexedDB.deleteDatabase('VunaletOfflineDB');
```

## Future Enhancements

- [ ] Background sync for orders
- [ ] Advanced offline analytics
- [ ] Custom notification sounds
- [ ] App badge updates
- [ ] Share API integration
- [ ] Web Share Target API 