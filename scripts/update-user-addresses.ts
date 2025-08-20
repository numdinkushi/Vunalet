#!/usr/bin/env tsx

import 'dotenv/config';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function updateUserAddresses() {
    try {
        console.log('Updating user profiles with random South African addresses...');

        const result = await client.mutation(api.migrations.updateUserProfilesWithSouthAfricanAddresses, {});

        console.log('Address update completed successfully!');
        console.log(`Updated ${result.updatedCount} user profiles`);
        console.log(`Total profiles processed: ${result.totalProfiles}`);
        console.log(`Provinces used: ${result.uniqueProvinces}`);
        console.log(`Cities used: ${result.uniqueCities}`);
        console.log('\nProvinces:', result.provincesUsed.join(', '));
        console.log('\nCities:', result.citiesUsed.join(', '));

    } catch (error) {
        console.error('Address update failed:', error);
        process.exit(1);
    }
}

updateUserAddresses(); 