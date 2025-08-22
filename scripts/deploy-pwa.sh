#!/bin/bash

echo "🚀 Deploying Vunalet PWA..."

# Generate PWA icons
echo "📱 Generating PWA icons..."
node scripts/generate-pwa-icons.mjs

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ PWA deployment complete!"
echo "🌐 Visit: https://vunalet.vercel.app/"
echo ""
echo "📱 PWA Testing Checklist:"
echo "1. Open site on mobile Chrome/Safari"
echo "2. Look for 'Add to Home Screen' prompt"
echo "3. Test offline functionality"
echo "4. Check push notifications"
echo ""
echo "🔍 PWA Audit:"
echo "Visit: https://www.pwabuilder.com/"
echo "Enter: https://vunalet.vercel.app/" 