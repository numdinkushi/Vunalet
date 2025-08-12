'use client';

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

export function CategoryInitializer() {
    const initializeCategories = useMutation(api.categories.initializeCategories);

    const handleInitialize = async () => {
        try {
            const result = await initializeCategories({});
            toast.success(`Successfully initialized ${result.length} categories!`);
        } catch (error) {
            toast.error('Failed to initialize categories');
            console.error('Category initialization error:', error);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Initialize Categories</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                    This will create all the predefined categories in the database.
                </p>
                <Button onClick={handleInitialize} className="w-full">
                    Initialize Categories
                </Button>
            </CardContent>
        </Card>
    );
} 