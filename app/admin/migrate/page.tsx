'use client';

import { DatabaseMigrator } from '../../../components/admin/DatabaseMigrator';
import { CategoryInitializer } from '../../../components/admin/CategoryInitializer';

export default function MigrationPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Migration</h1>
                    <p className="text-gray-600">Run database migrations to update the schema</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatabaseMigrator />
                    <CategoryInitializer />
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
                    <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. First run the "Database Migration" to update existing data</li>
                        <li>2. Then run "Initialize Categories" if categories aren't created yet</li>
                        <li>3. Run "Migrate Products" to import dummy products and assign to farmers</li>
                        <li>4. Check the products page to see real data from the database</li>
                        <li>5. Check the farmer dashboard to ensure everything works</li>
                    </ol>
                </div>
            </div>
        </div>
    );
} 