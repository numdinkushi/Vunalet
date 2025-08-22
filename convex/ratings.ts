import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new rating/review
export const createRating = mutation({
    args: {
        orderId: v.string(),
        ratedUserId: v.string(),
        raterRole: v.union(v.literal("buyer"), v.literal("farmer"), v.literal("dispatcher")),
        ratedRole: v.union(v.literal("farmer"), v.literal("dispatcher")),
        rating: v.number(),
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if rating already exists for this order and rated user
        const existingRating = await ctx.db
            .query("ratings")
            .withIndex("by_order_and_rated_user", (q) =>
                q.eq("orderId", args.orderId).eq("ratedUserId", args.ratedUserId)
            )
            .first();

        if (existingRating) {
            // Update existing rating
            return await ctx.db.patch(existingRating._id, {
                rating: args.rating,
                comment: args.comment,
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

// Get ratings for a specific user (farmer or dispatcher)
export const getUserRatings = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("ratings")
            .withIndex("by_rated_user", (q) => q.eq("ratedUserId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get average rating for a user (farmer or dispatcher)
export const getUserAverageRating = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const ratings = await ctx.db
            .query("ratings")
            .withIndex("by_rated_user", (q) => q.eq("ratedUserId", args.userId))
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