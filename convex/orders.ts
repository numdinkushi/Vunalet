import { v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from './_generated/api';

// Define interfaces for type safety
interface DispatcherWorkload {
    dispatcherId: string;
    pendingOrders: number;
    totalOrders: number;
}

// Enhanced dispatcher workload interface
interface EnhancedDispatcherWorkload {
    dispatcherId: string;
    pendingOrders: number;
    totalOrders: number;
    averageDeliveryTime?: number;
    completionRate?: number;
    customerRating?: number;
    isOnline?: boolean;
    lastActiveTime?: number;
    location?: {
        lat: number;
        lng: number;
    };
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate dispatcher score for assignment
function calculateDispatcherScore(
    dispatcher: EnhancedDispatcherWorkload,
    orderPickupLocation: { lat: number; lng: number; },
    weights: {
        workload: number;
        proximity: number;
        performance: number;
        availability: number;
    }
): number {
    // Workload score (lower is better) - 40% weight
    const maxWorkload = 10; // Assume max 10 orders per dispatcher
    const workloadScore = Math.max(0, 1 - (dispatcher.pendingOrders / maxWorkload));

    // Proximity score (closer is better) - 30% weight
    let proximityScore = 1;
    if (dispatcher.location && orderPickupLocation) {
        const distance = calculateDistance(
            dispatcher.location.lat,
            dispatcher.location.lng,
            orderPickupLocation.lat,
            orderPickupLocation.lng
        );
        // Score decreases with distance (max 50km for full score)
        proximityScore = Math.max(0, 1 - (distance / 50));
    }

    // Performance score - 20% weight
    const performanceScore = (
        (dispatcher.completionRate || 0.8) * 0.4 +
        (dispatcher.customerRating || 4.0) / 5.0 * 0.3 +
        (dispatcher.averageDeliveryTime ? Math.max(0, 1 - (dispatcher.averageDeliveryTime / 120)) : 0.5) * 0.3
    );

    // Availability score - 10% weight
    const availabilityScore = dispatcher.isOnline ? 1 : 0.3;

    return (
        workloadScore * weights.workload +
        proximityScore * weights.proximity +
        performanceScore * weights.performance +
        availabilityScore * weights.availability
    );
}

// Create a new order
export const createOrder = mutation({
    args: {
        buyerId: v.string(),
        farmerId: v.string(),
        dispatcherId: v.optional(v.string()),
        products: v.array(v.object({
            productId: v.string(),
            name: v.string(),
            price: v.number(),
            quantity: v.number(),
            unit: v.string(),
        })),
        totalAmount: v.number(),
        farmerAmount: v.number(),
        dispatcherAmount: v.number(),
        deliveryAddress: v.string(),
        deliveryCoordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        pickupLocation: v.optional(v.string()),
        pickupCoordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        deliveryDistance: v.number(),
        deliveryCost: v.number(),
        totalCost: v.number(),
        paymentMethod: v.union(v.literal("lisk_zar"), v.literal("celo"), v.literal("cash")),
        paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
        orderStatus: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("in_transit"), v.literal("arrived"), v.literal("delivered"), v.literal("cancelled")),
        // Celo blockchain payment fields
        celoTxHash: v.optional(v.string()),
        celoBlockNumber: v.optional(v.number()),
        celoFromAddress: v.optional(v.string()),
        celoAmountPaid: v.optional(v.number()),
        // Celo recipient addresses for payment distribution
        celoFarmerAddress: v.optional(v.string()),
        celoDispatcherAddress: v.optional(v.string()),
        celoPlatformAddress: v.optional(v.string()),
        specialInstructions: v.optional(v.string()),
        estimatedPickupTime: v.optional(v.string()),
        estimatedDeliveryTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const assignmentExpiryTime = now + (10 * 60 * 1000); // 10 minutes from now

        return await ctx.db.insert("orders", {
            ...args,
            // Hybrid Assignment System - Initialize as available for manual claiming
            assignmentStatus: "available",
            assignmentExpiryTime: assignmentExpiryTime,
            assignmentMethod: undefined, // Will be set when assigned
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Create a delivery record
export const createDelivery = mutation({
    args: {
        orderId: v.string(),
        dispatcherId: v.string(),
        pickupLocation: v.string(),
        deliveryLocation: v.string(),
        pickupCoordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        deliveryCoordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        estimatedPickupTime: v.optional(v.string()),
        estimatedDeliveryTime: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("deliveries", {
            ...args,
            status: "assigned",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

// Get orders by buyer
export const getOrdersByBuyer = query({
    args: { buyerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_buyer", (q) => q.eq("buyerId", args.buyerId))
            .order("desc")
            .collect();
    },
});

// Get orders by buyer with farmer and dispatcher information
export const getOrdersByBuyerWithFarmerInfo = query({
    args: { buyerId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_buyer", (q) => q.eq("buyerId", args.buyerId))
            .order("desc")
            .collect();

        // Get unique farmer and dispatcher IDs from orders
        const farmerIds = [...new Set(orders.map(order => order.farmerId))];
        const dispatcherIds = [...new Set(orders.map(order => order.dispatcherId).filter((id): id is string => id !== undefined))];

        // Fetch farmer profiles
        const farmerProfiles = await Promise.all(
            farmerIds.map(async (farmerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", farmerId))
                    .first();
                return { farmerId, profile };
            })
        );

        // Fetch dispatcher profiles
        const dispatcherProfiles = await Promise.all(
            dispatcherIds.map(async (dispatcherId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", dispatcherId))
                    .first();
                return { dispatcherId, profile };
            })
        );

        // Create maps of ID to profile
        const farmerMap = new Map();
        farmerProfiles.forEach(({ farmerId, profile }) => {
            if (profile) {
                farmerMap.set(farmerId, profile);
            }
        });

        const dispatcherMap = new Map();
        dispatcherProfiles.forEach(({ dispatcherId, profile }) => {
            if (profile) {
                dispatcherMap.set(dispatcherId, profile);
            }
        });

        // Add farmer and dispatcher information to orders - FIXED: Explicitly include CELO addresses
        return orders.map(order => ({
            ...order,
            // Explicitly include CELO address fields
            celoFarmerAddress: order.celoFarmerAddress,
            celoDispatcherAddress: order.celoDispatcherAddress,
            celoPlatformAddress: order.celoPlatformAddress,
            celoFromAddress: order.celoFromAddress,
            celoTxHash: order.celoTxHash,
            celoBlockNumber: order.celoBlockNumber,
            celoAmountPaid: order.celoAmountPaid,
            farmerInfo: farmerMap.get(order.farmerId) || null,
            dispatcherInfo: order.dispatcherId ? dispatcherMap.get(order.dispatcherId) || null : null
        }));
    },
});

// Get orders by farmer with buyer and dispatcher information
export const getOrdersByFarmerWithUserInfo = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .order("desc")
            .collect();

        // Get unique buyer and dispatcher IDs from orders
        const buyerIds = [...new Set(orders.map(order => order.buyerId))];
        const dispatcherIds = [...new Set(orders.map(order => order.dispatcherId).filter((id): id is string => id !== undefined))];

        // Fetch buyer profiles
        const buyerProfiles = await Promise.all(
            buyerIds.map(async (buyerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", buyerId))
                    .first();
                return { buyerId, profile };
            })
        );

        // Fetch dispatcher profiles
        const dispatcherProfiles = await Promise.all(
            dispatcherIds.map(async (dispatcherId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", dispatcherId))
                    .first();
                return { dispatcherId, profile };
            })
        );

        // Create maps of ID to profile
        const buyerMap = new Map();
        buyerProfiles.forEach(({ buyerId, profile }) => {
            if (profile) {
                buyerMap.set(buyerId, profile);
            }
        });

        const dispatcherMap = new Map();
        dispatcherProfiles.forEach(({ dispatcherId, profile }) => {
            if (profile) {
                dispatcherMap.set(dispatcherId, profile);
            }
        });

        // Add user information to orders
        return orders.map(order => ({
            ...order,
            buyerInfo: buyerMap.get(order.buyerId) || null,
            dispatcherInfo: dispatcherMap.get(order.dispatcherId) || null
        }));
    },
});

// Get orders by farmer with buyer information
export const getOrdersByFarmerWithBuyerInfo = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .order("desc")
            .collect();

        // Get unique buyer IDs from orders
        const buyerIds = [...new Set(orders.map(order => order.buyerId))];

        // Fetch buyer profiles
        const buyerProfiles = await Promise.all(
            buyerIds.map(async (buyerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", buyerId))
                    .first();
                return { buyerId, profile };
            })
        );

        // Create a map of buyer ID to profile
        const buyerMap = new Map();
        buyerProfiles.forEach(({ buyerId, profile }) => {
            if (profile) {
                buyerMap.set(buyerId, profile);
            }
        });

        // Add buyer information to orders
        return orders.map(order => ({
            ...order,
            buyerInfo: buyerMap.get(order.buyerId) || null
        }));
    },
});

// Get orders by farmer
export const getOrdersByFarmer = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .order("desc")
            .collect();
    },
});

// Get orders by dispatcher
export const getOrdersByDispatcher = query({
    args: { dispatcherId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("orders")
            .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.dispatcherId))
            .order("desc")
            .collect();
    },
});

// Get orders by dispatcher with buyer and farmer information
export const getOrdersByDispatcherWithUserInfo = query({
    args: { dispatcherId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.dispatcherId))
            .order("desc")
            .collect();

        // Get unique buyer, farmer, and dispatcher IDs from orders
        const buyerIds = [...new Set(orders.map(order => order.buyerId))];
        const farmerIds = [...new Set(orders.map(order => order.farmerId))];
        const dispatcherIds = [...new Set(orders.map(order => order.dispatcherId).filter((id): id is string => id !== undefined))];

        // Fetch buyer profiles
        const buyerProfiles = await Promise.all(
            buyerIds.map(async (buyerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", buyerId))
                    .first();
                return { buyerId, profile };
            })
        );

        // Fetch farmer profiles
        const farmerProfiles = await Promise.all(
            farmerIds.map(async (farmerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", farmerId))
                    .first();
                return { farmerId, profile };
            })
        );

        // Fetch dispatcher profiles
        const dispatcherProfiles = await Promise.all(
            dispatcherIds.map(async (dispatcherId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", dispatcherId))
                    .first();
                return { dispatcherId, profile };
            })
        );

        // Create maps of ID to profile
        const buyerMap = new Map();
        buyerProfiles.forEach(({ buyerId, profile }) => {
            if (profile) {
                buyerMap.set(buyerId, profile);
            }
        });

        const farmerMap = new Map();
        farmerProfiles.forEach(({ farmerId, profile }) => {
            if (profile) {
                farmerMap.set(farmerId, profile);
            }
        });

        const dispatcherMap = new Map();
        dispatcherProfiles.forEach(({ dispatcherId, profile }) => {
            if (profile) {
                dispatcherMap.set(dispatcherId, profile);
            }
        });

        // Add user information to orders
        return orders.map(order => ({
            ...order,
            buyerInfo: buyerMap.get(order.buyerId) || null,
            farmerInfo: farmerMap.get(order.farmerId) || null,
            dispatcherInfo: dispatcherMap.get(order.dispatcherId) || null
        }));
    },
});

// Get order by ID
export const getOrderById = query({
    args: { orderId: v.string() },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .filter((q) => q.eq(q.field("_id"), args.orderId))
            .first();

        return order;
    },
});

// Update order status
export const updateOrderStatus = mutation({
    args: {
        orderId: v.string(),
        orderStatus: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("in_transit"), v.literal("arrived"), v.literal("delivered"), v.literal("cancelled")),
        estimatedDeliveryTime: v.optional(v.string()),
        actualDeliveryTime: v.optional(v.string()),
        cancellationReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { orderId, ...updateData } = args;
        return await ctx.db.patch(orderId as Id<"orders">, {
            ...updateData,
            updatedAt: Date.now(),
        });
    },
});

// Update payment status
export const updatePaymentStatus = mutation({
    args: {
        orderId: v.string(),
        paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.orderId as Id<"orders">, {
            paymentStatus: args.paymentStatus,
            updatedAt: Date.now(),
        });
    },
});

// Update payment method
export const updatePaymentMethod = mutation({
    args: {
        orderId: v.id("orders"),
        paymentMethod: v.union(v.literal("lisk_zar"), v.literal("celo"), v.literal("cash")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.orderId, {
            paymentMethod: args.paymentMethod,
            updatedAt: Date.now(),
        });
    },
});

// Assign dispatcher to order
export const assignDispatcher = mutation({
    args: {
        orderId: v.string(),
        dispatcherId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.orderId as Id<"orders">, {
            dispatcherId: args.dispatcherId,
            updatedAt: Date.now(),
        });
    },
});

// Get orders by status
export const getOrdersByStatus = query({
    args: {
        status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("in_transit"), v.literal("arrived"), v.literal("delivered"), v.literal("cancelled")),
        role: v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer")),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        let orders;

        if (args.role === "farmer") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_farmer", (q) => q.eq("farmerId", args.userId))
                .collect();
        } else if (args.role === "dispatcher") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.userId))
                .collect();
        } else {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
                .collect();
        }

        return orders.filter(order => order.orderStatus === args.status);
    },
});

// Get recent orders
export const getRecentOrders = query({
    args: {
        role: v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer")),
        userId: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let orders;

        if (args.role === "farmer") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_farmer", (q) => q.eq("farmerId", args.userId))
                .order("desc")
                .collect();
        } else if (args.role === "dispatcher") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.userId))
                .order("desc")
                .collect();
        } else {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
                .order("desc")
                .collect();
        }

        return orders.slice(0, args.limit || 10);
    },
});

// Cancel order
export const cancelOrder = mutation({
    args: { orderId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.orderId as Id<"orders">, {
            orderStatus: "cancelled",
            updatedAt: Date.now(),
        });
    },
});

// Get order statistics
export const getOrderStats = query({
    args: {
        role: v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer")),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        let orders;

        if (args.role === "farmer") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_farmer", (q) => q.eq("farmerId", args.userId))
                .collect();
        } else if (args.role === "dispatcher") {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.userId))
                .collect();
        } else {
            orders = await ctx.db
                .query("orders")
                .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
                .collect();
        }

        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.orderStatus === "pending").length,
            confirmed: orders.filter(o => o.orderStatus === "confirmed").length,
            preparing: orders.filter(o => o.orderStatus === "preparing").length,
            ready: orders.filter(o => o.orderStatus === "ready").length,
            inTransit: orders.filter(o => o.orderStatus === "in_transit").length,
            arrived: orders.filter(o => o.orderStatus === "arrived").length,
            delivered: orders.filter(o => o.orderStatus === "delivered").length,
            cancelled: orders.filter(o => o.orderStatus === "cancelled").length,
            totalRevenue: orders
                .filter(o => o.orderStatus === "delivered")
                .reduce((sum, order) => {
                    if (args.role === "farmer") {
                        return sum + order.farmerAmount;
                    } else if (args.role === "dispatcher") {
                        return sum + order.dispatcherAmount;
                    } else {
                        return sum + order.totalAmount;
                    }
                }, 0),
        };

        return stats;
    },
});

// Process payment transfer for order
export const processPaymentTransfer = mutation({
    args: {
        orderId: v.string(),
        buyerLiskId: v.string(),
        farmerPaymentId: v.string(),
        amount: v.number(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            // First, update the order payment status to paid
            await ctx.db.patch(args.orderId as Id<"orders">, {
                paymentStatus: "paid",
                updatedAt: Date.now(),
            });

            // Return success - the actual transfer will be handled by the frontend
            // calling the API endpoint
            return {
                success: true,
                message: "Payment status updated successfully",
                orderId: args.orderId,
            };
        } catch (error) {
            console.error("Failed to process payment transfer:", error);
            throw new Error("Failed to process payment transfer");
        }
    },
});

// Get pending order total for buyer (sum of totalCost for orders that should affect ledger balance)
export const getBuyerPendingTotal = query({
    args: { buyerId: v.string() },
    handler: async (ctx, args) => {
        const buyerOrders = await ctx.db
            .query("orders")
            .withIndex("by_buyer", (q) => q.eq("buyerId", args.buyerId))
            .collect();

        // Calculate total for orders that should affect ledger balance
        // These are orders that are not yet fully completed (delivered/cancelled)
        const pendingOrders = buyerOrders.filter(order =>
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled"
        );

        const totalPending = pendingOrders.reduce((sum, order) => sum + order.totalCost, 0);
        return totalPending;
    },
});

// Get pending order total for farmer (sum of farmerAmount for orders that should affect ledger balance)
export const getFarmerPendingTotal = query({
    args: { farmerId: v.string() },
    handler: async (ctx, args) => {
        const farmerOrders = await ctx.db
            .query("orders")
            .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
            .collect();

        // Calculate total for orders that should affect ledger balance
        // These are orders that are not yet fully completed (delivered/cancelled)
        const pendingOrders = farmerOrders.filter(order =>
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled"
        );

        const totalPending = pendingOrders.reduce((sum, order) => sum + order.farmerAmount, 0);
        return totalPending;
    },
});

// Get pending order total for dispatcher (sum of dispatcherAmount for orders that should affect ledger balance)
export const getDispatcherPendingTotal = query({
    args: { dispatcherId: v.string() },
    handler: async (ctx, args) => {
        const dispatcherOrders = await ctx.db
            .query("orders")
            .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", args.dispatcherId))
            .collect();

        // Calculate total for orders that should affect ledger balance
        // These are orders that are not yet fully completed (delivered/cancelled)
        const pendingOrders = dispatcherOrders.filter(order =>
            order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled"
        );

        const totalPending = pendingOrders.reduce((sum, order) => sum + order.dispatcherAmount, 0);
        return totalPending;
    },
});

// Update Celo payment details
export const updateCeloPayment = mutation({
    args: {
        orderId: v.id("orders"),
        celoTxHash: v.string(),
        celoBlockNumber: v.optional(v.number()),
        celoFromAddress: v.string(),
        celoAmountPaid: v.number(),
        celoFarmerAddress: v.optional(v.string()),
        celoDispatcherAddress: v.optional(v.string()),
        celoPlatformAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { orderId, celoTxHash, celoBlockNumber, celoFromAddress, celoAmountPaid, celoFarmerAddress, celoDispatcherAddress, celoPlatformAddress } = args;

        return await ctx.db.patch(orderId, {
            celoTxHash,
            celoBlockNumber,
            celoFromAddress,
            celoAmountPaid,
            celoFarmerAddress,
            celoDispatcherAddress,
            celoPlatformAddress,
            paymentStatus: "paid",
            updatedAt: Date.now(),
        });
    },
});

// Claim an order manually (dispatcher self-assignment)
export const claimOrder = mutation({
    args: {
        orderId: v.string(),
        dispatcherId: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.orderId as Id<"orders">);

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.assignmentStatus !== "available") {
            throw new Error("Order is not available for claiming");
        }

        if (order.assignmentExpiryTime && Date.now() > order.assignmentExpiryTime) {
            throw new Error("Order claiming window has expired");
        }

        // Update the order
        await ctx.db.patch(args.orderId as Id<"orders">, {
            dispatcherId: args.dispatcherId,
            assignmentStatus: "claimed",
            assignmentMethod: "manual",
            updatedAt: Date.now(),
        });

        // Create delivery record
        await ctx.db.insert("deliveries", {
            orderId: args.orderId,
            dispatcherId: args.dispatcherId,
            pickupLocation: order.pickupLocation || "Farm Location",
            deliveryLocation: order.deliveryAddress,
            pickupCoordinates: order.pickupCoordinates,
            deliveryCoordinates: order.deliveryCoordinates,
            estimatedPickupTime: order.estimatedPickupTime,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            status: "assigned",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create notification for dispatcher
        await ctx.db.insert("notifications", {
            userId: args.dispatcherId,
            type: "delivery",
            title: "Order Claimed Successfully",
            message: `You have successfully claimed order #${order._id.slice(-6)}`,
            metadata: {
                orderId: args.orderId,
                pickupLocation: order.pickupLocation || "Farm Location",
                deliveryLocation: order.deliveryAddress,
            },
            isRead: false,
            createdAt: Date.now(),
        });

        return { success: true, message: "Order claimed successfully" };
    },
});

// Enhanced auto-assignment with robust logic
export const autoAssignExpiredOrders = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Get all orders that are available and have expired their claiming window
        const expiredOrders = await ctx.db
            .query("orders")
            .withIndex("by_assignment_status", (q) => q.eq("assignmentStatus", "available"))
            .filter((q) => q.lt(q.field("assignmentExpiryTime"), now))
            .collect();

        if (expiredOrders.length === 0) {
            return { assigned: 0, message: "No expired orders to assign" };
        }

        // Get all dispatchers with enhanced information
        const dispatchers = await ctx.db
            .query("userProfiles")
            .withIndex("by_role", (q) => q.eq("role", "dispatcher"))
            .collect();

        if (dispatchers.length === 0) {
            // Create admin notification for no dispatchers
            await ctx.db.insert("notifications", {
                userId: "admin", // You might want to get actual admin ID
                type: "system",
                title: "No Dispatchers Available",
                message: `${expiredOrders.length} orders expired but no dispatchers available for assignment`,
                metadata: {
                    expiredOrdersCount: expiredOrders.length,
                    timestamp: now,
                },
                isRead: false,
                createdAt: now,
            });
            throw new Error("No dispatchers available for auto-assignment");
        }

        // Get enhanced workload information for all dispatchers
        const dispatcherIds = dispatchers.map(d => d.clerkUserId);
        const workloads: DispatcherWorkload[] = await ctx.runQuery(api.users.getDispatcherWorkload, {
            dispatcherIds
        });

        // Get dispatcher performance data (ratings, completion rates, etc.)
        const dispatcherPerformance = await Promise.all(
            dispatcherIds.map(async (dispatcherId) => {
                // Get recent deliveries for performance calculation
                const recentDeliveries = await ctx.db
                    .query("deliveries")
                    .withIndex("by_dispatcher", (q) => q.eq("dispatcherId", dispatcherId))
                    .filter((q) => q.gt(q.field("createdAt"), now - (30 * 24 * 60 * 60 * 1000))) // Last 30 days
                    .collect();

                // Calculate performance metrics
                const completedDeliveries = recentDeliveries.filter(d => d.status === "delivered");
                const completionRate = recentDeliveries.length > 0 ? completedDeliveries.length / recentDeliveries.length : 0.8;

                // Calculate average delivery time (mock for now - you'd need actual delivery time tracking)
                const averageDeliveryTime = 60; // minutes

                // Get customer rating (mock for now - you'd need a ratings system)
                const customerRating = 4.2;

                return {
                    dispatcherId,
                    completionRate,
                    averageDeliveryTime,
                    customerRating,
                };
            })
        );

        // Create enhanced dispatcher profiles
        const enhancedDispatchers: EnhancedDispatcherWorkload[] = dispatchers.map(dispatcher => {
            const workload = workloads.find(w => w.dispatcherId === dispatcher.clerkUserId);
            const performance = dispatcherPerformance.find(p => p.dispatcherId === dispatcher.clerkUserId);

            return {
                dispatcherId: dispatcher.clerkUserId,
                pendingOrders: workload?.pendingOrders || 0,
                totalOrders: workload?.totalOrders || 0,
                averageDeliveryTime: performance?.averageDeliveryTime,
                completionRate: performance?.completionRate,
                customerRating: performance?.customerRating,
                isOnline: true, // You might want to implement online status tracking
                lastActiveTime: now,
                location: dispatcher.location ? {
                    lat: 0, // Default latitude since location is a string
                    lng: 0, // Default longitude since location is a string
                } : undefined,
            };
        });

        let assignedCount = 0;
        const assignmentWeights = {
            workload: 0.4,
            proximity: 0.3,
            performance: 0.2,
            availability: 0.1,
        };

        // Assign each expired order using the enhanced algorithm
        for (const order of expiredOrders) {
            const orderPickupLocation = order.pickupCoordinates || order.deliveryCoordinates;

            // Calculate scores for all dispatchers
            const dispatcherScores = enhancedDispatchers.map(dispatcher => ({
                dispatcher,
                score: calculateDispatcherScore(dispatcher, orderPickupLocation || { lat: 0, lng: 0 }, assignmentWeights),
            }));

            // Sort by score (highest first)
            dispatcherScores.sort((a, b) => b.score - a.score);

            // Get the best dispatcher
            const bestDispatcher = dispatcherScores[0]?.dispatcher;

            if (!bestDispatcher) {
                // Create admin notification for failed assignment
                await ctx.db.insert("notifications", {
                    userId: "admin",
                    type: "system",
                    title: "Failed Order Assignment",
                    message: `Order #${order._id.slice(-6)} could not be assigned to any dispatcher`,
                    metadata: {
                        orderId: order._id,
                        timestamp: now,
                    },
                    isRead: false,
                    createdAt: now,
                });
                continue;
            }

            // Update the order
            await ctx.db.patch(order._id, {
                dispatcherId: bestDispatcher.dispatcherId,
                assignmentStatus: "auto_assigned",
                assignmentMethod: "auto",
                updatedAt: now,
            });

            // Create delivery record
            await ctx.db.insert("deliveries", {
                orderId: order._id,
                dispatcherId: bestDispatcher.dispatcherId,
                pickupLocation: order.pickupLocation || "Farm Location",
                deliveryLocation: order.deliveryAddress,
                pickupCoordinates: order.pickupCoordinates,
                deliveryCoordinates: order.deliveryCoordinates,
                estimatedPickupTime: order.estimatedPickupTime,
                estimatedDeliveryTime: order.estimatedDeliveryTime,
                status: "assigned",
                createdAt: now,
                updatedAt: now,
            });

            // Create notification for dispatcher
            await ctx.db.insert("notifications", {
                userId: bestDispatcher.dispatcherId,
                type: "delivery",
                title: "New Delivery Assignment",
                message: `You have been auto-assigned order #${order._id.slice(-6)}. Score: ${dispatcherScores[0].score.toFixed(2)}`,
                metadata: {
                    orderId: order._id,
                    pickupLocation: order.pickupLocation || "Farm Location",
                    deliveryLocation: order.deliveryAddress,
                    assignmentScore: dispatcherScores[0].score,
                    assignmentReason: "Auto-assigned based on workload, proximity, and performance",
                },
                isRead: false,
                createdAt: now,
            });

            assignedCount++;
        }

        // Create summary notification
        if (assignedCount > 0) {
            await ctx.db.insert("notifications", {
                userId: "admin",
                type: "system",
                title: "Auto-Assignment Summary",
                message: `Successfully auto-assigned ${assignedCount} out of ${expiredOrders.length} expired orders`,
                metadata: {
                    totalExpired: expiredOrders.length,
                    successfullyAssigned: assignedCount,
                    failedAssignments: expiredOrders.length - assignedCount,
                    timestamp: now,
                },
                isRead: false,
                createdAt: now,
            });
        }

        return {
            assigned: assignedCount,
            total: expiredOrders.length,
            message: `Auto-assigned ${assignedCount} out of ${expiredOrders.length} expired orders`,
            details: {
                totalExpired: expiredOrders.length,
                successfullyAssigned: assignedCount,
                failedAssignments: expiredOrders.length - assignedCount,
            }
        };
    },
});

// Scheduled function to automatically check for expired orders
export const checkExpiredOrders = internalAction({
    args: {},
    handler: async (ctx): Promise<{ assigned: number; total?: number; message: string; details?: { totalExpired: number; successfullyAssigned: number; failedAssignments: number; }; }> => {
        try {
            const result = await ctx.runMutation(api.orders.autoAssignExpiredOrders, {});
            console.log(`Auto-assignment result: ${result.message}`);
            return result;
        } catch (error) {
            console.error("Auto-assignment failed:", error);
            throw error;
        }
    },
});

// Get orders available for manual claiming (within claiming window)
export const getAvailableOrders = query({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Get all orders that are available and within claiming window
        const availableOrders = await ctx.db
            .query("orders")
            .withIndex("by_assignment_status", (q) => q.eq("assignmentStatus", "available"))
            .filter((q) => q.gt(q.field("assignmentExpiryTime"), now))
            .order("desc")
            .collect();

        // Get unique buyer and farmer IDs from available orders
        const buyerIds = [...new Set(availableOrders.map(order => order.buyerId))];
        const farmerIds = [...new Set(availableOrders.map(order => order.farmerId))];

        // Fetch buyer profiles
        const buyerProfiles = await Promise.all(
            buyerIds.map(async (buyerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", buyerId))
                    .first();
                return { buyerId, profile };
            })
        );

        // Fetch farmer profiles
        const farmerProfiles = await Promise.all(
            farmerIds.map(async (farmerId) => {
                const profile = await ctx.db
                    .query("userProfiles")
                    .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", farmerId))
                    .first();
                return { farmerId, profile };
            })
        );

        // Create maps of ID to profile
        const buyerMap = new Map();
        buyerProfiles.forEach(({ buyerId, profile }) => {
            if (profile) {
                buyerMap.set(buyerId, profile);
            }
        });

        const farmerMap = new Map();
        farmerProfiles.forEach(({ farmerId, profile }) => {
            if (profile) {
                farmerMap.set(farmerId, profile);
            }
        });

        // Add user information to orders
        return availableOrders.map(order => ({
            ...order,
            buyerInfo: buyerMap.get(order.buyerId) || null,
            farmerInfo: farmerMap.get(order.farmerId) || null,
            timeRemaining: order.assignmentExpiryTime ? order.assignmentExpiryTime - now : 0,
        }));
    },
}); 