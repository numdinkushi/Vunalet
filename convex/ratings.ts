import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new rating/review
export const createRating = mutation({
    args: {
        farmerId: v.string(),
        buyerId: v.string(),
        orderId: v.string(),
        rating: v.number(),
        review: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if rating already exists for this order
        const existingRating = await ctx.db
            .query("ratings")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
            .first();

        if (existingRating) {
            // Update existing rating
            return await ctx.db.patch(existingRating._id, {
                rating: args.rating,
                review: args.review,
                updatedAt: Date.now(),
            });
        }

        // Create new rating
        return await ctx.db.insert("ratings", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Get ratings for a specific farmer
export const getFarmerRatings = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("ratings")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .order("desc")
            .collect();
    },
});

// Get average rating for a farmer
export const getFarmerAverageRating = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        const ratings = await ctx.db
            .query("ratings")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .collect();

        if (ratings.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
                }
            };
        }

        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length;

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(rating => {
            distribution[rating.rating as keyof typeof distribution]++;
        });

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
            totalRatings: ratings.length,
            ratingDistribution: distribution
        };
    },
});

// Get rating by order ID
export const getRatingByOrder = query({
    args: { orderId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("ratings")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
            .first();
    },
});

// Update rating
export const updateRating = mutation({
    args: {
        ratingId: v.string(),
        rating: v.number(),
        review: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { ratingId, ...updateData } = args;
        return await ctx.db.patch(ratingId as Id<"ratings">, {
            ...updateData,
            updatedAt: Date.now(),
        });
    },
});

// Delete rating
export const deleteRating = mutation({
    args: { ratingId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.ratingId as Id<"ratings">);
    },
}); 