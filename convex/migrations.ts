import { mutation } from "./_generated/server";

// Migration to update existing products from category to categoryId
export const migrateProductsToCategoryId = mutation({
    args: {},
    handler: async (ctx) => {
        // Get all products that still have the old category field
        const products = await ctx.db.query("products").collect();

        let migratedCount = 0;

        for (const product of products) {
            // Check if product has old category field and no categoryId
            if ('category' in product && !('categoryId' in product)) {
                const oldCategory = (product as any).category;

                // Map old category strings to new category IDs
                const categoryMapping: { [key: string]: string; } = {
                    'vegetables': '1',
                    'fruits': '2',
                    'grains': '3',
                    'dairy': '7',
                    'meat': '8',
                    'fish': '9',
                    'eggs': '10',
                    'oils': '11',
                    'herbs': '12',
                    'tubers': '4',
                    'legumes': '5',
                    'nuts': '6'
                };

                const categoryId = categoryMapping[oldCategory.toLowerCase()] || '1'; // Default to vegetables

                // Update the product with categoryId and remove old category field
                await ctx.db.patch(product._id, {
                    categoryId,
                    // Remove the old category field by not including it
                });

                migratedCount++;
            }
        }

        return { migratedCount, totalProducts: products.length };
    },
});

// Migration to ensure all products have categoryId
export const ensureAllProductsHaveCategoryId = mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();

        let updatedCount = 0;

        for (const product of products) {
            if (!('categoryId' in product)) {
                // Set default categoryId for products without it
                await ctx.db.patch(product._id, {
                    categoryId: '1', // Default to vegetables
                });
                updatedCount++;
            }
        }

        return { updatedCount, totalProducts: products.length };
    },
}); 