#!/usr/bin/env tsx

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function migrateProducts() {
    try {
        console.log('Starting product migration...');

        const result = await client.mutation(api.migrations.migrateDummyProductsToDatabase, {});

        console.log('Migration completed successfully!');
        console.log(`Migrated ${result.migratedCount} products`);
        console.log(`Used ${result.farmersUsed.length} farmers`);
        console.log(`Average products per farmer: ${result.productsPerFarmer}`);

        if (result.farmersUsed.length === 0) {
            console.log('⚠️  No farmers found in database. Please create farmers first.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateProducts(); 