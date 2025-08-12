import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Initialize categories with data from constants
export const initializeCategories = mutation({
    args: {},
    handler: async (ctx) => {
        // Define categories with Cloudinary URLs
        const categories = [
            {
                id: '1',
                name: 'Vegetables',
                description: 'Fresh, organic vegetables from local farms',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977393/vunalet/categories/vegetables/rw9prdpjxdf7ef9wihfk.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977394/vunalet/categories/vegetables/y5csnotfi6q8kmipycdy.jpg'
                ],
                productCount: 0,
            },
            {
                id: '2',
                name: 'Fruits',
                description: 'Sweet and juicy fruits in season',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977395/vunalet/categories/fruits/rbnsoqxdx07pcgkei9qk.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977397/vunalet/categories/fruits/shlq4cuo6x5nbj58mrlq.jpg'
                ],
                productCount: 0,
            },
            {
                id: '3',
                name: 'Grains & Cereals',
                description: 'Nutritious grains and cereals',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977399/vunalet/categories/grains-cereals/vq5ephziuujlsx2xk3dc.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977403/vunalet/categories/grains-cereals/rbnjkviomybsoikyzwwh.jpg'
                ],
                productCount: 0,
            },
            {
                id: '4',
                name: 'Tubers & Starchy Vegetables',
                description: 'Root vegetables and starchy produce',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977405/vunalet/categories/tubers-starchy-vegetables/dmgj67fnljzw8yadofts.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977407/vunalet/categories/tubers-starchy-vegetables/rg6fg3sopghvewxhjh5y.jpg'
                ],
                productCount: 0,
            },
            {
                id: '5',
                name: 'Legumes (Pulses)',
                description: 'Protein-rich legumes and pulses',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977410/vunalet/categories/legumes-pulses-/prwud1hpt7dszzjodpr5.jpg'
                ],
                productCount: 0,
            },
            {
                id: '6',
                name: 'Nuts & Seeds',
                description: 'Healthy nuts and seeds',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977413/vunalet/categories/nuts-seeds/obkilstbig2dq0mcjvv2.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977416/vunalet/categories/nuts-seeds/xgs2xpvzmfvfrpgy2bvf.jpg'
                ],
                productCount: 0,
            },
            {
                id: '7',
                name: 'Dairy & Dairy Alternatives',
                description: 'Fresh dairy and plant-based alternatives',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977419/vunalet/categories/dairy-dairy-alternatives/t1wahnbiy99pqcjmotsp.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977421/vunalet/categories/dairy-dairy-alternatives/jk31t9lyq5plos2ptzib.jpg'
                ],
                productCount: 0,
            },
            {
                id: '8',
                name: 'Meat & Poultry',
                description: 'Quality meat and poultry products',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977424/vunalet/categories/meat-poultry/lf1g0vduu7ektrfbhlb4.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977427/vunalet/categories/meat-poultry/i8nlyvsifn3k7weamo39.jpg'
                ],
                productCount: 0,
            },
            {
                id: '9',
                name: 'Fish & Seafood',
                description: 'Fresh fish and seafood',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977429/vunalet/categories/fish-seafood/ksadznr5udjebdopoddt.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977431/vunalet/categories/fish-seafood/nj2azyo9twy9xujj9mig.jpg'
                ],
                productCount: 0,
            },
            {
                id: '10',
                name: 'Eggs',
                description: 'Fresh farm eggs',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977432/vunalet/categories/eggs/cdcprtcdmc5pc8y1ywoi.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977433/vunalet/categories/eggs/tydcly61prl95hfdlfr5.jpg'
                ],
                productCount: 0,
            },
            {
                id: '11',
                name: 'Oils & Fats',
                description: 'Healthy cooking oils and fats',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977435/vunalet/categories/oils-fats/sxpn37ce6xhlpehy32gw.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977437/vunalet/categories/oils-fats/nytbydigzbq5hkzauvqw.jpg'
                ],
                productCount: 0,
            },
            {
                id: '12',
                name: 'Herbs & Spices',
                description: 'Fresh herbs and aromatic spices',
                images: [
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977438/vunalet/categories/herbs-spices/esdstfqfmopapwuyfipb.jpg',
                    'https://res.cloudinary.com/du0xtdehy/image/upload/v1754977439/vunalet/categories/herbs-spices/th3j7knf4vfss37p2wgm.jpg'
                ],
                productCount: 0,
            }
        ];

        const results = [];
        for (const category of categories) {
            const existing = await ctx.db
                .query("categories")
                .withIndex("by_category_id", (q) => q.eq("categoryId", category.id))
                .first();

            if (!existing) {
                const id = await ctx.db.insert("categories", {
                    categoryId: category.id,
                    name: category.name,
                    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    description: category.description,
                    images: category.images,
                    productCount: category.productCount,
                    isActive: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });
                results.push(id);
            }
        }

        return results;
    },
});

// Get all active categories
export const getActiveCategories = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .order("asc")
            .collect();
    },
});

// Get category by ID
export const getCategoryById = query({
    args: { categoryId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_category_id", (q) => q.eq("categoryId", args.categoryId))
            .first();
    },
});

// Update category product count
export const updateCategoryProductCount = mutation({
    args: { categoryId: v.string() },
    handler: async (ctx, args) => {
        const category = await ctx.db
            .query("categories")
            .withIndex("by_category_id", (q) => q.eq("categoryId", args.categoryId))
            .first();

        if (!category) {
            throw new Error(`Category with ID ${args.categoryId} not found`);
        }

        // Count products in this category
        const productCount = await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();

        // Update category with new product count
        await ctx.db.patch(category._id, {
            productCount: productCount.length,
            updatedAt: Date.now(),
        });

        return productCount.length;
    },
});

// Create a new category
export const createCategory = mutation({
    args: {
        categoryId: v.string(),
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        images: v.array(v.string()),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("categories")
            .withIndex("by_category_id", (q) => q.eq("categoryId", args.categoryId))
            .first();

        if (existing) {
            throw new Error(`Category with ID ${args.categoryId} already exists`);
        }

        return await ctx.db.insert("categories", {
            ...args,
            productCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Update category
export const updateCategory = mutation({
    args: {
        categoryId: v.string(),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { categoryId, ...updateData } = args;

        const category = await ctx.db
            .query("categories")
            .withIndex("by_category_id", (q) => q.eq("categoryId", categoryId))
            .first();

        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }

        return await ctx.db.patch(category._id, {
            ...updateData,
            updatedAt: Date.now(),
        });
    },
}); 