#!/usr/bin/env tsx

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function updatePrices() {
    try {
        console.log('Updating product prices for test tokens...');

        const result = await client.mutation(api.migrations.updateProductPricesForTestTokens, {});

        console.log('Price update completed successfully!');
        console.log(`Updated ${result.updatedCount} products`);
        console.log(`Price range: ${result.priceRange}`);
        console.log(`Total products processed: ${result.totalProducts}`);

    } catch (error) {
        console.error('Price update failed:', error);
        process.exit(1);
    }
}

updatePrices(); 