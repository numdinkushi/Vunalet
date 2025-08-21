import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from './_generated/api';

interface DispatcherAssignmentResult {
    dispatcherId: string;
    isAssigned: boolean;
    reason?: string;
}

interface DispatcherWorkload {
    dispatcherId: string;
    pendingOrders: number;
    totalOrders: number;
}

interface Dispatcher {
    clerkUserId: string;
}

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
        // Farmer-specific fields
        bio: v.optional(v.string()),
        farmSize: v.optional(v.string()),
        experience: v.optional(v.string()),
        specialties: v.optional(v.array(v.string())),
        isOrganicCertified: v.optional(v.boolean()),
        profilePicture: v.optional(v.string()),
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
        // Return null if no clerkUserId provided or if it's empty
        if (!args.clerkUserId || args.clerkUserId.trim() === '') {
            return null;
        }

        try {
            return await ctx.db
                .query("userProfiles")
                .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
                .first();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
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
        // Farmer-specific fields
        bio: v.optional(v.string()),
        farmSize: v.optional(v.string()),
        experience: v.optional(v.string()),
        specialties: v.optional(v.array(v.string())),
        isOrganicCertified: v.optional(v.boolean()),
        profilePicture: v.optional(v.string()),
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

// Get farmers with comprehensive statistics
export const getFarmersWithStats = query({
    handler: async (ctx) => {
        const farmers = await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "farmer"))
            .collect();

        const farmersWithStats = await Promise.all(
            farmers.map(async (farmer) => {
                // Get products count
                const products = await ctx.db
                    .query("products")
                    .withIndex("by_farmer", (q) => q.eq("farmerId", farmer.clerkUserId))
                    .filter((q) => q.eq(q.field("status"), "active"))
                    .collect();

                // Get orders count (unique customers)
                const orders = await ctx.db
                    .query("orders")
                    .withIndex("by_farmer", (q) => q.eq("farmerId", farmer.clerkUserId))
                    .filter((q) => q.eq(q.field("orderStatus"), "delivered"))
                    .collect();

                // Get unique customers
                const uniqueCustomers = new Set(orders.map(order => order.buyerId)).size;

                // Get ratings
                const ratings = await ctx.db
                    .query("ratings")
                    .withIndex("by_farmer", (q) => q.eq("farmerId", farmer.clerkUserId))
                    .collect();

                const averageRating = ratings.length > 0
                    ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
                    : 0;

                return {
                    ...farmer,
                    stats: {
                        totalProducts: products.length,
                        totalCustomers: uniqueCustomers,
                        averageRating,
                        totalRatings: ratings.length,
                    }
                };
            })
        );

        return farmersWithStats;
    },
});

// Get all farmers (for debugging - not just verified)
export const getAllFarmers = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "farmer"))
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
        // New South African address fields
        addressProvince: v.optional(v.string()),
        addressCity: v.optional(v.string()),
        addressStreet: v.optional(v.string()),
        addressPostalCode: v.optional(v.string()),
        addressFull: v.optional(v.string()),
        location: v.optional(v.string()),
        coordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        businessName: v.optional(v.string()),
        businessLicense: v.optional(v.string()),
        // Farmer-specific fields
        bio: v.optional(v.string()),
        farmSize: v.optional(v.string()),
        experience: v.optional(v.string()),
        specialties: v.optional(v.array(v.string())),
        isOrganicCertified: v.optional(v.boolean()),
        profilePicture: v.optional(v.string()),
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

// Debug query to get user profile with all fields
export const getUserProfileDebug = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        console.log('Debug - User profile data:', profile);
        return profile;
    },
});

/**
 * Utility to find the best dispatcher for assignment based on workload
 */
export class DispatcherAssignmentService {
    /**
     * Get dispatcher workload from Convex
     */
    static async getDispatcherWorkload(dispatchers: Dispatcher[]): Promise<DispatcherWorkload[]> {
        const workloads: DispatcherWorkload[] = [];

        for (const dispatcher of dispatchers) {
            // This will be called from the Convex mutation
            // For now, we'll return a placeholder structure
            workloads.push({
                dispatcherId: dispatcher.clerkUserId,
                pendingOrders: 0, // Will be populated by Convex query
                totalOrders: 0,   // Will be populated by Convex query
            });
        }

        return workloads;
    }

    /**
     * Find the best dispatcher for assignment
     */
    static findBestDispatcher(workloads: DispatcherWorkload[]): DispatcherAssignmentResult {
        if (workloads.length === 0) {
            return {
                dispatcherId: '',
                isAssigned: false,
                reason: 'No dispatchers available'
            };
        }

        // Sort by pending orders (ascending) and then by total orders (ascending)
        const sortedWorkloads = workloads.sort((a, b) => {
            if (a.pendingOrders !== b.pendingOrders) {
                return a.pendingOrders - b.pendingOrders;
            }
            return a.totalOrders - b.totalOrders;
        });

        const bestDispatcher = sortedWorkloads[0];

        return {
            dispatcherId: bestDispatcher.dispatcherId,
            isAssigned: true,
            reason: `Assigned to dispatcher with ${bestDispatcher.pendingOrders} pending orders`
        };
    }

    /**
     * Get random dispatcher (fallback method)
     */
    static getRandomDispatcher(dispatchers: Dispatcher[]): DispatcherAssignmentResult {
        if (dispatchers.length === 0) {
            return {
                dispatcherId: '',
                isAssigned: false,
                reason: 'No dispatchers available'
            };
        }

        const randomIndex = Math.floor(Math.random() * dispatchers.length);
        const selectedDispatcher = dispatchers[randomIndex];

        return {
            dispatcherId: selectedDispatcher.clerkUserId,
            isAssigned: true,
            reason: 'Randomly assigned'
        };
    }
}

// Get dispatcher workload for assignment
export const getDispatcherWorkload = query({
    args: { dispatcherIds: v.array(v.string()) },
    handler: async (ctx, args): Promise<DispatcherWorkload[]> => {
        const workloads: DispatcherWorkload[] = [];

        for (const dispatcherId of args.dispatcherIds) {
            // Get pending orders for this dispatcher
            const pendingOrders = await ctx.db
                .query("orders")
                .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", dispatcherId))
                .filter((q) => q.eq(q.field("orderStatus"), "pending"))
                .collect();

            // Get total orders for this dispatcher
            const totalOrders = await ctx.db
                .query("orders")
                .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", dispatcherId))
                .collect();

            workloads.push({
                dispatcherId,
                pendingOrders: pendingOrders.length,
                totalOrders: totalOrders.length,
            });
        }

        return workloads;
    },
});

// Auto-assign dispatcher to order
export const autoAssignDispatcher = mutation({
    args: {},
    handler: async (ctx): Promise<{ dispatcherId: string; pendingOrders: number; reason: string; }> => {
        // Get all dispatchers (remove verification check)
        const dispatchers = await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "dispatcher"))
            .collect();

        if (dispatchers.length === 0) {
            throw new Error("No dispatchers available");
        }

        const dispatcherIds = dispatchers.map(d => d.clerkUserId);

        // Get workload for all dispatchers
        const workloads: DispatcherWorkload[] = await ctx.runQuery(api.users.getDispatcherWorkload, {
            dispatcherIds
        });

        // Find dispatcher with least pending orders
        const sortedWorkloads: DispatcherWorkload[] = workloads.sort((a: DispatcherWorkload, b: DispatcherWorkload) => {
            if (a.pendingOrders !== b.pendingOrders) {
                return a.pendingOrders - b.pendingOrders;
            }
            return a.totalOrders - b.totalOrders;
        });

        const bestDispatcher: DispatcherWorkload = sortedWorkloads[0];

        return {
            dispatcherId: bestDispatcher.dispatcherId,
            pendingOrders: bestDispatcher.pendingOrders,
            reason: `Assigned to dispatcher with ${bestDispatcher.pendingOrders} pending orders`
        };
    },
});