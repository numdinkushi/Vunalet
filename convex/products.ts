import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new product
export const createProduct = mutation({
    args: {
        farmerId: v.string(),
        name: v.string(),
        category: v.string(),
        price: v.number(),
        unit: v.string(),
        quantity: v.number(),
        description: v.optional(v.string()),
        images: v.array(v.string()),
        harvestDate: v.string(),
        expiryDate: v.optional(v.string()),
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
        return await ctx.db.insert("products", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Get products by farmer
export const getProductsByFarmer = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .order("desc")
            .collect();
    },
});

// Get all active products
export const getActiveProducts = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .order("desc")
            .collect();
    },
});

// Get products by category
export const getProductsByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .filter((q) => q.eq(q.field("status"), "active"))
            .order("desc")
            .collect();
    },
});

// Get featured products
export const getFeaturedProducts = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("products")
            .withIndex("by_featured", (q) => q.eq("isFeatured", true))
            .filter((q) => q.eq(q.field("status"), "active"))
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
        category: v.optional(v.string()),
        price: v.optional(v.number()),
        unit: v.optional(v.string()),
        quantity: v.optional(v.number()),
        description: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        harvestDate: v.optional(v.string()),
        expiryDate: v.optional(v.string()),
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
        const { productId, ...updateData } = args;
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

// Search products
export const searchProducts = query({
    args: {
        searchTerm: v.string(),
        category: v.optional(v.string()),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let products = await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        // Filter by search term
        if (args.searchTerm) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(args.searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (args.category) {
            products = products.filter(product => product.category === args.category);
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

// Update product quantity (for order processing)
export const updateProductQuantity = mutation({
    args: {
        productId: v.string(),
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.productId as Id<"products">);
        if (!product) {
            throw new Error("Product not found");
        }

        const newQuantity = product.quantity - args.quantity;
        const newStatus = newQuantity <= 0 ? "out_of_stock" : product.status;

        return await ctx.db.patch(args.productId as Id<"products">, {
            quantity: Math.max(0, newQuantity),
            status: newStatus,
            updatedAt: Date.now(),
        });
    },
}); 