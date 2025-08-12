# Image Upload Setup Guide

This guide explains how to set up Cloudinary image upload functionality for the Vunalet application.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Cloudinary Setup

1. **Create a Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Get Your Credentials**: 
   - Go to your Dashboard
   - Copy your Cloud Name, API Key, and API Secret
   - Add them to your environment variables

## Features Implemented

### 1. Image Upload API (`/api/upload-image`)
- Handles multiple image uploads (up to 5 images)
- File validation (JPEG, PNG, WebP, max 5MB each)
- Automatic image optimization and resizing
- Returns Cloudinary URLs for storage

### 2. Image Upload Component (`components/ui/image-upload.tsx`)
- Drag and drop functionality
- Multiple file selection
- Progress tracking
- Image preview with remove capability
- Responsive design

### 3. Farmer Dashboard Integration
- Add Product modal now includes image upload
- Product cards display uploaded images
- Images are stored in Convex database as URLs

## Usage

### In the Add Product Modal
1. Click "Add Product" in the farmer dashboard
2. Fill in product details
3. Use the image upload area to add product photos
4. Drag and drop or click to select images
5. Preview uploaded images
6. Submit the form to save product with images

### Image Storage
- Images are uploaded to Cloudinary in the `vunalet/products` folder
- URLs are stored in the Convex `products` table
- Images are automatically optimized for web display

## File Structure

```
vunalet/
├── lib/
│   └── cloudinary.ts          # Cloudinary configuration and helpers
├── pages/api/
│   └── upload-image.ts        # Image upload API endpoint
├── hooks/
│   └── use-image-upload.ts    # Custom hook for image uploads
├── components/ui/
│   └── image-upload.tsx       # Reusable image upload component
└── components/dashboard/farmer/
    └── FarmerDashboard.tsx    # Updated with image upload
```

## Security Features

- File type validation
- File size limits (5MB per image)
- Maximum image count (5 images per product)
- Secure Cloudinary upload with API key authentication
- Image optimization and transformation

## Performance Optimizations

- Automatic image resizing to 800x600
- Quality optimization
- Format conversion to WebP when supported
- Lazy loading of images in product cards
- Progress tracking for better UX 