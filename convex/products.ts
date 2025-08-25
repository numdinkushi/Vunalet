import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Create a new product
export const createProduct = mutation({
    args: {
        farmerId: v.string(),
        categoryId: v.string(),
        name: v.string(),
        price: v.number(),
        unit: v.string(),
        quantity: v.number(),
        description: v.optional(v.string()),
        images: v.array(v.string()),
        harvestDate: v.string(),
        expiryDate: v.optional(v.string()),
        storageMethod: v.optional(v.union(v.literal("room_temp"), v.literal("refrigerated"), v.literal("frozen"))),
        isOrganic: v.optional(v.boolean()),
        isFeatured: v.boolean(),
        location: v.string(),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        status: v.union(v.literal("active"), v.literal("inactive"), v.literal("out_of_stock")),
    },
    handler: async (ctx, args) => {
        const productId = await ctx.db.insert("products", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Update category product count
        await ctx.scheduler.runAfter(0, api.categories.updateCategoryProductCount, { categoryId: args.categoryId });

        return productId;
    },
});

// Get products by farmer (excluding expired)
export const getProductsByFarmer = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        const now = new Date().toISOString().split('T')[0];
        return await ctx.db
            .query("products")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .filter((q) =>
                q.or(
                    q.eq(q.field("expiryDate"), undefined),
                    q.gt(q.field("expiryDate"), now)
                )
            )
            .order("desc")
            .collect();
    },
});

// Get all active products (excluding expired)
export const getActiveProducts = query({
    handler: async (ctx) => {
        try {
            const now = new Date().toISOString().split('T')[0];

            return await ctx.db
                .query("products")
                .withIndex("by_status", (q) => q.eq("status", "active"))
                .filter((q) =>
                    q.or(
                        q.eq(q.field("expiryDate"), undefined),
                        q.gt(q.field("expiryDate"), now)
                    )
                )
                .order("desc")
                .collect();
        } catch (error) {
            console.error('Error in getActiveProducts:', error);
            // Return empty array instead of throwing
            return [];
        }
    },
});

// Get products by category (excluding expired)
export const getProductsByCategory = query({
    args: { categoryId: v.string() },
    handler: async (ctx, args) => {
        const now = new Date().toISOString().split('T')[0];
        return await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
            .filter((q) =>
                q.and(
                    q.eq(q.field("status"), "active"),
                    q.or(
                        q.eq(q.field("expiryDate"), undefined),
                        q.gt(q.field("expiryDate"), now)
                    )
                )
            )
            .order("desc")
            .collect();
    },
});

// Get featured products (excluding expired)
export const getFeaturedProducts = query({
    handler: async (ctx) => {
        const now = new Date().toISOString().split('T')[0];
        return await ctx.db
            .query("products")
            .withIndex("by_featured", (q) => q.eq("isFeatured", true))
            .filter((q) =>
                q.and(
                    q.eq(q.field("status"), "active"),
                    q.or(
                        q.eq(q.field("expiryDate"), undefined),
                        q.gt(q.field("expiryDate"), now)
                    )
                )
            )
            .order("desc")
            .collect();
    },
});

// Get product by ID
export const getProductById = query({
    args: { productId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.productId as Id<"products">);
    },
});

// Update product
export const updateProduct = mutation({
    args: {
        productId: v.string(),
        name: v.optional(v.string()),
        categoryId: v.optional(v.string()),
        price: v.optional(v.number()),
        unit: v.optional(v.string()),
        quantity: v.optional(v.number()),
        description: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        harvestDate: v.optional(v.string()),
        expiryDate: v.optional(v.string()),
        storageMethod: v.optional(v.union(v.literal("room_temp"), v.literal("refrigerated"), v.literal("frozen"))),
        isOrganic: v.optional(v.boolean()),
        isFeatured: v.optional(v.boolean()),
        location: v.optional(v.string()),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("out_of_stock"))),
    },
    handler: async (ctx, args) => {
        const { productId, categoryId, ...updateData } = args;

        // If category is being updated, we need to update product counts for both old and new categories
        if (categoryId) {
            const product = await ctx.db.get(productId as Id<"products">);
            if (product && product.categoryId !== categoryId) {
                // Update old category count
                await ctx.scheduler.runAfter(0, api.categories.updateCategoryProductCount, { categoryId: product.categoryId });
                // Update new category count
                await ctx.scheduler.runAfter(0, api.categories.updateCategoryProductCount, { categoryId });
            }
        }

        return await ctx.db.patch(productId as Id<"products">, {
            ...updateData,
            updatedAt: Date.now(),
        });
    },
});

// Delete product
export const deleteProduct = mutation({
    args: { productId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.productId as Id<"products">);
    },
});

// Search products (excluding expired)
export const searchProducts = query({
    args: {
        searchTerm: v.string(),
        categoryId: v.optional(v.string()),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString().split('T')[0];
        let products = await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .filter((q) =>
                q.or(
                    q.eq(q.field("expiryDate"), undefined),
                    q.gt(q.field("expiryDate"), now)
                )
            )
            .collect();

        // Filter by search term
        if (args.searchTerm) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(args.searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (args.categoryId) {
            products = products.filter(product => product.categoryId === args.categoryId);
        }

        // Filter by price range
        if (args.minPrice !== undefined) {
            products = products.filter(product => product.price >= args.minPrice!);
        }
        if (args.maxPrice !== undefined) {
            products = products.filter(product => product.price <= args.maxPrice!);
        }

        return products.sort((a, b) => b.createdAt - a.createdAt);
    },
});

// Update product quantity after order
export const updateProductQuantity = mutation({
    args: {
        productId: v.string(),
        quantityReduced: v.number(),
    },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.productId as Id<"products">);

        if (!product) {
            throw new Error("Product not found");
        }

        const newQuantity = Math.max(0, product.quantity - args.quantityReduced);

        await ctx.db.patch(args.productId as Id<"products">, {
            quantity: newQuantity,
            updatedAt: Date.now(),
        });

        return { success: true, newQuantity };
    },
});

// Get all products (for migration)
export const getAllProducts = query({
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

// Delete product (for migration)
export const deleteProductById = mutation({
    args: { productId: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.productId);
    },
});

// Update product farmer (for migration)
export const updateProductFarmer = mutation({
    args: {
        productId: v.id("products"),
        farmerId: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.productId, {
            farmerId: args.farmerId,
            updatedAt: Date.now(),
        });
    },
}); 