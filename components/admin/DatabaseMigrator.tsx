'use client';

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { useState } from 'react';

export function DatabaseMigrator() {
    const migrateProductsToCategoryId = useMutation(api.migrations.migrateProductsToCategoryId);
    const ensureAllProductsHaveCategoryId = useMutation(api.migrations.ensureAllProductsHaveCategoryId);
    const initializeCategories = useMutation(api.categories.initializeCategories);
    const migrateDummyProductsToDatabase = useMutation(api.migrations.migrateDummyProductsToDatabase);
    const updateProductPricesForTestTokens = useMutation(api.migrations.updateProductPricesForTestTokens);
    const randomizeFeaturedProducts = useMutation(api.migrations.randomizeFeaturedProducts);

    const [isMigrating, setIsMigrating] = useState(false);

    const handleFullMigration = async () => {
        setIsMigrating(true);
        try {
            // Step 1: Initialize categories
            toast.info('Initializing categories...');
            const categoriesResult = await initializeCategories({});
            toast.success(`Initialized ${categoriesResult.length} categories`);

            // Step 2: Migrate products to use categoryId
            toast.info('Migrating products to use categoryId...');
            const migrationResult = await migrateProductsToCategoryId({});
            toast.success(`Migrated ${migrationResult.migratedCount} products`);

            // Step 3: Ensure all products have categoryId
            toast.info('Ensuring all products have categoryId...');
            const ensureResult = await ensureAllProductsHaveCategoryId({});
            toast.success(`Updated ${ensureResult.updatedCount} products`);

            toast.success('Database migration completed successfully!');
        } catch (error) {
            toast.error('Migration failed');
            console.error('Migration error:', error);
        } finally {
            setIsMigrating(false);
        }
    };

    const handleProductMigration = async () => {
        setIsMigrating(true);
        try {
            toast.info('Migrating dummy products to database...');
            const result = await migrateDummyProductsToDatabase({});
            toast.success(`Migrated ${result.migratedCount} products to ${result.farmersUsed.length} farmers`);

            if (result.farmersUsed.length === 0) {
                toast.error('No farmers found. Please create farmers first.');
            }
        } catch (error) {
            toast.error('Product migration failed');
            console.error('Product migration error:', error);
        } finally {
            setIsMigrating(false);
        }
    };

    const handlePriceUpdate = async () => {
        setIsMigrating(true);
        try {
            toast.info('Updating product prices for test tokens...');
            const result = await updateProductPricesForTestTokens({});
            toast.success(`Updated ${result.updatedCount} products to ${result.priceRange}`);
        } catch (error) {
            toast.error('Price update failed');
            console.error('Price update error:', error);
        } finally {
            setIsMigrating(false);
        }
    };

    const handleFeaturedRandomization = async () => {
        setIsMigrating(true);
        try {
            toast.info('Randomizing featured products across farmers...');
            const result = await randomizeFeaturedProducts({});
            toast.success(`Featured ${result.featuredCount} products from ${result.farmersWithFeatured} farmers`);
        } catch (error) {
            toast.error('Featured products randomization failed');
            console.error('Featured products error:', error);
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Database Migration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                    This will migrate the database to use the new category schema with proper relationships.
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                    <p>• Initialize categories in database</p>
                    <p>• Migrate existing products to use categoryId</p>
                    <p>• Ensure all products have proper category references</p>
                </div>
                <Button
                    onClick={handleFullMigration}
                    className="w-full"
                    disabled={isMigrating}
                >
                    {isMigrating ? 'Migrating...' : 'Run Full Migration'}
                </Button>

                <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Migrate dummy products to database and assign to real farmers
                    </p>
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <p>• Import all dummy products from constants</p>
                        <p>• Assign products to existing farmers</p>
                        <p>• Distribute products evenly among farmers</p>
                    </div>
                    <Button
                        onClick={handleProductMigration}
                        className="w-full"
                        disabled={isMigrating}
                        variant="outline"
                    >
                        {isMigrating ? 'Migrating Products...' : 'Migrate Products'}
                    </Button>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Update product prices for test tokens
                        </p>
                        <div className="space-y-2 text-xs text-gray-500 mb-4">
                            <p>• Set all product prices to 0.1 - 1.0 R</p>
                            <p>• Useful for testing with small token amounts</p>
                            <p>• Randomizes prices within the range</p>
                        </div>
                        <Button
                            onClick={handlePriceUpdate}
                            className="w-full"
                            disabled={isMigrating}
                            variant="outline"
                        >
                            {isMigrating ? 'Updating Prices...' : 'Update Prices for Test'}
                        </Button>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Randomize featured products across farmers
                        </p>
                        <div className="space-y-2 text-xs text-gray-500 mb-4">
                            <p>• Ensures fair distribution among farmers</p>
                            <p>• Randomly selects 1-2 products per farmer</p>
                            <p>• Prevents favoritism in featured section</p>
                        </div>
                        <Button
                            onClick={handleFeaturedRandomization}
                            className="w-full"
                            disabled={isMigrating}
                            variant="outline"
                        >
                            {isMigrating ? 'Randomizing...' : 'Randomize Featured Products'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 