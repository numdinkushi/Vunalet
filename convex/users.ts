import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create basic user profile (without role)
export const createBasicUserProfile = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        // Stablecoin API data (optional)
        liskId: v.optional(v.string()),
        publicKey: v.optional(v.string()),
        paymentIdentifier: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        console.log('Creating/updating basic user profile:', args);

        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (existingProfile) {
            // Update existing profile with basic info
            console.log('Updating existing profile with stablecoin data');
            const result = await ctx.db.patch(existingProfile._id, {
                ...args,
                updatedAt: Date.now(),
            });
            console.log('Profile updated successfully:', result);
            return result;
        } else {
            // Create new basic profile
            console.log('Creating new basic profile with stablecoin data');
            const result = await ctx.db.insert("userProfiles", {
                ...args,
                isVerified: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            console.log('Profile created successfully:', result);
            return result;
        }
    },
});

// Create or update user profile
export const createUserProfile = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        role: v.optional(v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer"))),
        firstName: v.string(),
        lastName: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        location: v.optional(v.string()),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        businessName: v.optional(v.string()),
        businessLicense: v.optional(v.string()),
        // Lisk ZAR API user data
        liskId: v.optional(v.string()),
        publicKey: v.optional(v.string()),
        paymentIdentifier: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (existingProfile) {
            // Update existing profile
            return await ctx.db.patch(existingProfile._id, {
                ...args,
                updatedAt: Date.now(),
            });
        } else {
            // Create new profile
            return await ctx.db.insert("userProfiles", {
                ...args,
                isVerified: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
    },
});

// Get user profile by Clerk user ID
export const getUserProfile = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();
    },
});

// Get all users by role
export const getUsersByRole = query({
    args: { role: v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer")) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", args.role))
            .collect();
    },
});

// Update user profile
export const updateUserProfile = mutation({
    args: {
        clerkUserId: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        location: v.optional(v.string()),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        businessName: v.optional(v.string()),
        businessLicense: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        const { clerkUserId, ...updateData } = args;
        return await ctx.db.patch(profile._id, {
            ...updateData,
            updatedAt: Date.now(),
        });
    },
});

// Verify user (admin function)
export const verifyUser = mutation({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        return await ctx.db.patch(profile._id, {
            isVerified: true,
            updatedAt: Date.now(),
        });
    },
});

// Get all farmers (for product browsing)
export const getFarmers = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "farmer"))
            .filter((q) => q.eq(q.field("isVerified"), true))
            .collect();
    },
});

// Get all dispatchers (for order assignment)
export const getDispatchers = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "dispatcher"))
            .filter((q) => q.eq(q.field("isVerified"), true))
            .collect();
    },
});

// Update Lisk ZAR user data
export const updateLiskUserData = mutation({
    args: {
        clerkUserId: v.string(),
        liskId: v.string(),
        publicKey: v.string(),
        paymentIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (!profile) {
            throw new Error("User profile not found");
        }

        return await ctx.db.patch(profile._id, {
            liskId: args.liskId,
            publicKey: args.publicKey,
            paymentIdentifier: args.paymentIdentifier,
            updatedAt: Date.now(),
        });
    },
});

// Create user with stablecoin integration
export const createUserWithStablecoinIntegration = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        role: v.optional(v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer"))),
        firstName: v.string(),
        lastName: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        location: v.optional(v.string()),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        businessName: v.optional(v.string()),
        businessLicense: v.optional(v.string()),
        // Stablecoin API data
        liskId: v.optional(v.string()),
        publicKey: v.optional(v.string()),
        paymentIdentifier: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        console.log('createUserWithStablecoinIntegration called with args:', args);

        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        console.log('Existing profile found:', existingProfile);

        if (existingProfile) {
            // Update existing profile with stablecoin data
            console.log('Updating existing profile with stablecoin data');
            const updateData = {
                ...args,
                updatedAt: Date.now(),
            };
            console.log('Update data:', updateData);

            const result = await ctx.db.patch(existingProfile._id, updateData);
            console.log('Profile updated successfully:', result);
            return result;
        } else {
            // Create new profile with stablecoin data
            console.log('Creating new profile with stablecoin data');
            const insertData = {
                ...args,
                isVerified: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            console.log('Insert data:', insertData);

            const result = await ctx.db.insert("userProfiles", insertData);
            console.log('Profile created successfully:', result);
            return result;
        }
    },
});

// Get user by Lisk ID
export const getUserByLiskId = query({
    args: { liskId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_lisk_id", (q) => q.eq("liskId", args.liskId))
            .first();
    },
}); 