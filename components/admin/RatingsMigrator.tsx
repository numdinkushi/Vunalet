'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

export function RatingsMigrator() {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteAllRatings = useMutation(api.migrations.deleteAllRatings);

    const handleDeleteRatings = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAllRatings({});

            if (result.success) {
                toast.success(`Successfully deleted ${result.deletedCount} ratings. Schema validation errors should now be fixed.`);
            } else {
                toast.error('Deletion failed');
            }
        } catch (error) {
            console.error('Deletion error:', error);
            toast.error('Deletion failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Delete All Ratings</CardTitle>
                <CardDescription>
                    Delete all ratings to fix schema validation errors
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>This will:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Delete all existing ratings from the database</li>
                            <li>Fix schema validation errors</li>
                            <li>Allow new ratings to be created with the correct schema</li>
                        </ul>
                    </div>

                    <Button
                        onClick={handleDeleteRatings}
                        disabled={isDeleting}
                        className="w-full bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting Ratings...
                            </>
                        ) : (
                            'Delete All Ratings'
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 