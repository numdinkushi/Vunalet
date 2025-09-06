# PWA Build Checklist

## Before Each Build:

### 1. Update Service Worker Version
- [ ] Update `CACHE_NAME` in `/public/sw.js`
- [ ] Add new routes to `urlsToCache` array
- [ ] Test offline functionality

### 2. Check Manifest File
- [ ] Verify `/public/manifest.json` exists
- [ ] Update app name/description if needed
- [ ] Ensure icons are correct paths

### 3. Environment Variables
- [ ] Verify VAPID keys in `.env`
- [ ] Check Clerk keys are set
- [ ] Test push notifications

### 4. Build Commands
```bash
# Standard build
npm run build

# PWA-specific build (if needed)
npm run build:pwa
```

### 5. Deployment Checklist
- [ ] Deploy to HTTPS (required for PWA)
- [ ] Test install prompt works
- [ ] Verify service worker registers
- [ ] Check offline functionality
- [ ] Test push notifications

### 6. Post-Deployment Tests
- [ ] Open in Chrome DevTools → Application tab
- [ ] Check "Manifest" section
- [ ] Verify "Service Workers" are registered
- [ ] Test "Add to Home Screen" functionality
- [ ] Test offline browsing

## Common Issues:
- Service worker not updating: Clear browser cache
- Install prompt not showing: Check HTTPS and manifest
- Push notifications failing: Verify VAPID keys 