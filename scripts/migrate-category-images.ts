import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CategoryImage {
    categoryId: string;
    name: string;
    localImages: string[];
    cloudinaryImages: string[];
}

const categories: CategoryImage[] = [
    {
        categoryId: '1',
        name: 'Vegetables',
        localImages: [
            '/assets/categories/vegetables/image.jpg',
            '/assets/categories/vegetables/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '2',
        name: 'Fruits',
        localImages: [
            '/assets/categories/fruits/image.jpg',
            '/assets/categories/fruits/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '3',
        name: 'Grains & Cereals',
        localImages: [
            '/assets/categories/grains_and_cereal/image.jpg',
            '/assets/categories/grains_and_cereal/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '4',
        name: 'Tubers & Starchy Vegetables',
        localImages: [
            '/assets/categories/tubers/image.jpg',
            '/assets/categories/tubers/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '5',
        name: 'Legumes (Pulses)',
        localImages: [
            '/assets/categories/legumes/image.jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '6',
        name: 'Nuts & Seeds',
        localImages: [
            '/assets/categories/nuts_and_seed/image (1).jpg',
            '/assets/categories/nuts_and_seed/image (2).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '7',
        name: 'Dairy & Dairy Alternatives',
        localImages: [
            '/assets/categories/dairy/image.jpg',
            '/assets/categories/dairy/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '8',
        name: 'Meat & Poultry',
        localImages: [
            '/assets/categories/meat/image.jpg',
            '/assets/categories/meat/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '9',
        name: 'Fish & Seafood',
        localImages: [
            '/assets/categories/fish/image.jpg',
            '/assets/categories/fish/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '10',
        name: 'Eggs',
        localImages: [
            '/assets/categories/eggs/image.jpg',
            '/assets/categories/eggs/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '11',
        name: 'Oils & Fats',
        localImages: [
            '/assets/categories/oils/image.jpg',
            '/assets/categories/oils/image (1).jpg'
        ],
        cloudinaryImages: []
    },
    {
        categoryId: '12',
        name: 'Herbs & Spices',
        localImages: [
            '/assets/categories/herbs_and_spices/image.jpg',
            '/assets/categories/herbs_and_spices/image (1).jpg'
        ],
        cloudinaryImages: []
    }
];

async function uploadImageToCloudinary(imagePath: string, categoryName: string): Promise<string> {
    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`Image not found: ${fullPath}`);
            return '';
        }

        const result = await cloudinary.uploader.upload(fullPath, {
            folder: `vunalet/categories/${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        console.log(`Uploaded: ${imagePath} -> ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${imagePath}:`, error);
        return '';
    }
}

async function migrateCategoryImages() {
    console.log('Starting category image migration to Cloudinary...');

    for (const category of categories) {
        console.log(`\nProcessing category: ${category.name}`);

        for (const localImage of category.localImages) {
            const cloudinaryUrl = await uploadImageToCloudinary(localImage, category.name);
            if (cloudinaryUrl) {
                category.cloudinaryImages.push(cloudinaryUrl);
            }
        }
    }

    console.log('\n=== Migration Results ===');
    for (const category of categories) {
        console.log(`\n${category.name} (ID: ${category.categoryId}):`);
        console.log(`  Local images: ${category.localImages.length}`);
        console.log(`  Cloudinary images: ${category.cloudinaryImages.length}`);
        console.log(`  URLs:`, category.cloudinaryImages);
    }

    // Generate updated categories data for Convex
    console.log('\n=== Updated Categories for Convex ===');
    console.log('Copy this to your categories.ts file:');

    const updatedCategories = categories.map(cat => ({
        id: cat.categoryId,
        name: cat.name,
        description: `${cat.name} - Fresh and quality products`,
        images: cat.cloudinaryImages.filter(url => url !== ''),
        productCount: 0,
    }));

    console.log(JSON.stringify(updatedCategories, null, 2));
}

// Run the migration
migrateCategoryImages().catch(console.error); 