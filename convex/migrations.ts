/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation } from "./_generated/server";
import { allProducts } from "../constants/products";
import { SOUTH_AFRICAN_PROVINCES } from "../constants/south-africa-addresses";

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
                const oldCategory = (product as { category: string; }).category;

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
                await ctx.db.patch((product as any)._id, {
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
                await ctx.db.patch((product as any)._id, {
                    categoryId: '1', // Default to vegetables
                });
                updatedCount++;
            }
        }

        return { updatedCount, totalProducts: products.length };
    },
});

// Migration to migrate dummy products to database and assign to real farmers
export const migrateDummyProductsToDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        // First, get all existing farmers
        const farmers = await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "farmer"))
            .collect();

        if (farmers.length === 0) {
            throw new Error("No farmers found in database. Please create farmers first.");
        }

        // Get existing products to avoid duplicates
        const existingProducts = await ctx.db.query("products").collect();
        const existingProductNames = new Set(existingProducts.map(p => p.name));

        let migratedCount = 0;
        const farmerIds = farmers.map(f => f.clerkUserId);

        // Flatten all products from all categories
        const allProductsArray = Object.values(allProducts).flat();

        for (const product of allProductsArray) {
            // Skip if product already exists
            if (existingProductNames.has(product.name)) {
                continue;
            }

            // Assign product to a farmer (round-robin distribution)
            const farmerId = farmerIds[migratedCount % farmerIds.length];

            // Convert dummy product to database format
            const dbProduct = {
                farmerId,
                categoryId: product.category,
                name: product.name,
                price: product.price,
                unit: product.unit,
                quantity: product.quantity,
                description: `${product.name} - Fresh from ${product.farmer}`,
                images: product.images,
                harvestDate: product.harvestDate,
                expiryDate: undefined, // Not provided in dummy data
                isOrganic: product.name.toLowerCase().includes('organic'),
                isFeatured: product.featured,
                location: product.location,
                coordinates: undefined, // Not provided in dummy data
                status: "active" as const,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };

            // Insert product into database
            await ctx.db.insert("products", dbProduct);
            migratedCount++;
        }

        return {
            migratedCount,
            totalProducts: allProductsArray.length,
            farmersUsed: farmerIds,
            productsPerFarmer: Math.ceil(migratedCount / farmerIds.length)
        };
    },
});

// Migration to update product prices for test tokens (0.1 to 1.0 R)
export const updateProductPricesForTestTokens = mutation({
    args: {},
    handler: async (ctx) => {
        // Get all active products
        const products = await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        let updatedCount = 0;

        for (const product of products) {
            // Generate a random price between 0.1 and 1.0
            const newPrice = Math.round((Math.random() * 0.9 + 0.1) * 10) / 10; // Rounds to 1 decimal place

            // Update the product price
            await ctx.db.patch(product._id, {
                price: newPrice,
                updatedAt: Date.now(),
            });

            updatedCount++;
        }

        return {
            updatedCount,
            totalProducts: products.length,
            priceRange: "0.1 to 1.0 R"
        };
    },
});

// Migration to randomly select featured products from different farmers
export const randomizeFeaturedProducts = mutation({
    args: {},
    handler: async (ctx) => {
        // Get all active products
        const products = await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        // First, unfeature all products
        for (const product of products) {
            await ctx.db.patch(product._id, {
                isFeatured: false,
                updatedAt: Date.now(),
            });
        }

        // Get unique farmers
        const farmerIds = [...new Set(products.map(p => p.farmerId))];

        // Select 1-2 products per farmer to feature (ensuring fair distribution)
        const featuredProducts: typeof products = [];
        const maxFeaturedPerFarmer = Math.min(2, Math.floor(6 / farmerIds.length)); // Max 6 total featured products

        for (const farmerId of farmerIds) {
            const farmerProducts = products.filter(p => p.farmerId === farmerId);

            // Randomly select 1-2 products from this farmer
            const numToFeature = Math.min(maxFeaturedPerFarmer, farmerProducts.length);
            const shuffled = farmerProducts.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, numToFeature);

            featuredProducts.push(...selected);
        }

        // Feature the selected products
        for (const product of featuredProducts) {
            await ctx.db.patch(product._id, {
                isFeatured: true,
                updatedAt: Date.now(),
            });
        }

        return {
            totalProducts: products.length,
            featuredCount: featuredProducts.length,
            farmersWithFeatured: farmerIds.length,
            featuredPerFarmer: maxFeaturedPerFarmer
        };
    },
});

// Migration to update user profiles with random South African addresses and coordinates
export const updateUserProfilesWithSouthAfricanAddresses = mutation({
    args: {},
    handler: async (ctx) => {
        // Get all user profiles
        const userProfiles = await ctx.db.query("userProfiles").collect();

        let updatedCount = 0;
        const addressStats = {
            provinces: new Set<string>(),
            cities: new Set<string>(),
        };

        for (const profile of userProfiles) {
            // Randomly select a province
            const randomProvince = SOUTH_AFRICAN_PROVINCES[Math.floor(Math.random() * SOUTH_AFRICAN_PROVINCES.length)];

            // Randomly select a city from that province
            const randomCity = randomProvince.cities[Math.floor(Math.random() * randomProvince.cities.length)];

            // Generate random street address components
            const streetNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
            const streetNames = [
                "Main Street", "Oak Avenue", "Pine Road", "Cedar Lane", "Maple Drive",
                "Elm Street", "Willow Way", "Birch Boulevard", "Spruce Street", "Cypress Court",
                "Acacia Avenue", "Jacaranda Drive", "Protea Road", "Strelitzia Street", "Aloe Lane",
                "King Street", "Queen Avenue", "Victoria Road", "Nelson Drive", "Mandela Street",
                "Freedom Avenue", "Liberty Road", "Peace Street", "Hope Lane", "Unity Drive",
                "Shaka Street", "Zulu Avenue", "Xhosa Road", "Ndebele Drive", "Sotho Lane",
                "Venda Boulevard", "Tsonga Court", "Swazi Way", "Tswana Street", "Pedi Avenue"
            ];
            const streetTypes = ["Street", "Avenue", "Road", "Drive", "Lane", "Boulevard", "Court", "Way"];

            const randomStreetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
            const randomStreetName = streetNames[Math.floor(Math.random() * streetNames.length)];
            const randomStreetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];

            // Generate postal code (South African format: 4 digits)
            const postalCode = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

            // Create full address
            const streetAddress = `${randomStreetNumber} ${randomStreetName} ${randomStreetType}`;
            const fullAddress = `${streetAddress}, ${randomCity.name}, ${randomProvince.name} ${postalCode}, South Africa`;

            // Add small random offset to coordinates for variety (within ~5km radius)
            const latOffset = (Math.random() - 0.5) * 0.05; // ±0.025 degrees ≈ ±2.5km
            const lngOffset = (Math.random() - 0.5) * 0.05;

            const coordinates = {
                lat: randomCity.coordinates.lat + latOffset,
                lng: randomCity.coordinates.lng + lngOffset
            };

            // Update the user profile - ensuring ALL address fields are properly set
            await ctx.db.patch(profile._id, {
                address: fullAddress, // Legacy address field - now properly formatted
                addressProvince: randomProvince.name,
                addressCity: randomCity.name,
                addressStreet: streetAddress,
                addressPostalCode: postalCode.toString(),
                addressFull: fullAddress,
                location: `${randomCity.name}, ${randomProvince.name}`,
                coordinates: coordinates,
                updatedAt: Date.now(),
            });

            updatedCount++;
            addressStats.provinces.add(randomProvince.name);
            addressStats.cities.add(randomCity.name);
        }

        return {
            updatedCount,
            totalProfiles: userProfiles.length,
            provincesUsed: Array.from(addressStats.provinces),
            citiesUsed: Array.from(addressStats.cities),
            uniqueProvinces: addressStats.provinces.size,
            uniqueCities: addressStats.cities.size
        };
    },
});

export const clearTestData = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear notifications
        const notifications = await ctx.db.query("notifications").collect();
        for (const notification of notifications) {
            await ctx.db.delete(notification._id);
        }

        // Clear orders
        const orders = await ctx.db.query("orders").collect();
        for (const order of orders) {
            await ctx.db.delete(order._id);
        }

        // Clear deliveries
        const deliveries = await ctx.db.query("deliveries").collect();
        for (const delivery of deliveries) {
            await ctx.db.delete(delivery._id);
        }

        return {
            deletedNotifications: notifications.length,
            deletedOrders: orders.length,
            deletedDeliveries: deliveries.length,
        };
    },
});

// Migration to update existing ratings to new schema - REMOVED
// This migration is no longer needed as the schema has been updated to the new format

// Delete all ratings to fix schema validation issues
export const deleteAllRatings = mutation({
    args: {},
    handler: async (ctx) => {
        console.log("Deleting all ratings to fix schema validation...");

        // Get all ratings
        const allRatings = await ctx.db
            .query("ratings")
            .collect();

        console.log(`Found ${allRatings.length} ratings to delete`);

        // Delete all ratings
        for (const rating of allRatings) {
            await ctx.db.delete(rating._id);
        }

        console.log(`Successfully deleted ${allRatings.length} ratings`);

        return {
            success: true,
            deletedCount: allRatings.length,
        };
    },
}); 