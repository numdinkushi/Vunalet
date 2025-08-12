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
            </CardContent>
        </Card>
    );
} 