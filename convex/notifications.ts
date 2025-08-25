import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create notification
export const createNotification = mutation({
    args: {
        userId: v.string(),
        type: v.union(v.literal("order_update"), v.literal("payment"), v.literal("delivery"), v.literal("system")),
        title: v.string(),
        message: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("notifications", {
            ...args,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});

// Get notifications for user
export const getNotifications = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Mark notification as read
export const markNotificationAsRead = mutation({
    args: { notificationId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.notificationId as any, {
            isRead: true,
        });
    },
});

// Create delivery assignment notification
export const createDeliveryNotification = mutation({
    args: {
        dispatcherId: v.string(),
        orderId: v.string(),
        pickupLocation: v.string(),
        deliveryLocation: v.string(),
        estimatedPickupTime: v.optional(v.string()),
        estimatedDeliveryTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const notification = await ctx.db.insert("notifications", {
            userId: args.dispatcherId,
            type: "delivery",
            title: "New Delivery Assignment",
            message: `You have been assigned a new delivery from ${args.pickupLocation} to ${args.deliveryLocation}`,
            metadata: {
                orderId: args.orderId,
                pickupLocation: args.pickupLocation,
                deliveryLocation: args.deliveryLocation,
                estimatedPickupTime: args.estimatedPickupTime,
                estimatedDeliveryTime: args.estimatedDeliveryTime,
            },
            isRead: false,
            createdAt: Date.now(),
        });

        return notification;
    },
});

// Get all notifications (for migration)
export const getAllNotifications = query({
    handler: async (ctx) => {
        return await ctx.db.query("notifications").collect();
    },
});

// Delete notification (for migration)
export const deleteNotification = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.notificationId);
    },
}); 