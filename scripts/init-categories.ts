import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is required');
}
const convex = new ConvexHttpClient(convexUrl);

async function initializeCategories() {
    console.log('Initializing categories in Convex database...');

    try {
        // Call the initializeCategories mutation
        const result = await convex.mutation(api.categories.initializeCategories, {});

        console.log('✅ Categories initialized successfully!');
        console.log(`Created ${result.length} categories`);

        // Fetch and display the categories
        const categories = await convex.query(api.categories.getActiveCategories);
        console.log('\n📋 Categories in database:');
        categories.forEach(cat => {
            console.log(`- ${cat.name} (ID: ${cat.categoryId}) - ${cat.images.length} images`);
        });

    } catch (error) {
        console.error('❌ Failed to initialize categories:', error);
    }
}

// Run the initialization
initializeCategories(); 