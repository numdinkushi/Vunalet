import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Extended user profiles (extends Clerk user data)
    userProfiles: defineTable({
        clerkUserId: v.string(),
        email: v.string(),
        role: v.optional(v.union(v.literal("farmer"), v.literal("dispatcher"), v.literal("buyer"))),
        firstName: v.string(),
        lastName: v.string(),
        phone: v.optional(v.string()),
        // Legacy address field for backward compatibility
        address: v.optional(v.string()),
        // New South African address structure
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
        specialties: v.optional(v.array(v.string())), // Category IDs
        isOrganicCertified: v.optional(v.boolean()),
        profilePicture: v.optional(v.string()),
        // Lisk ZAR API user data
        liskId: v.optional(v.string()),
        publicKey: v.optional(v.string()),
        paymentIdentifier: v.optional(v.string()),
        isVerified: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerk_user_id", ["clerkUserId"])
        .index("by_role", ["role"])
        .index("by_email", ["email"])
        .index("by_lisk_id", ["liskId"]),

    // Balances table
    balances: defineTable({
        clerkUserId: v.string(),
        token: v.string(), // e.g. "L ZAR Coin"
        walletBalance: v.number(),
        ledgerBalance: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user_token", ["clerkUserId", "token"]),

    // Products table
    products: defineTable({
        farmerId: v.string(), // clerkUserId of the farmer
        categoryId: v.string(), // Reference to categories table
        name: v.string(),
        price: v.number(),
        unit: v.string(),
        quantity: v.number(),
        description: v.optional(v.string()),
        images: v.array(v.string()), // Cloudinary URLs
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
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_farmer", ["farmerId"])
        .index("by_category", ["categoryId"])
        .index("by_status", ["status"])
        .index("by_featured", ["isFeatured"]),

    // Orders table
    orders: defineTable({
        buyerId: v.string(), // clerkUserId of the buyer
        farmerId: v.string(), // clerkUserId of the farmer
        dispatcherId: v.optional(v.string()), // clerkUserId of the dispatcher
        products: v.array(v.object({
            productId: v.string(),
            name: v.string(),
            price: v.number(),
            quantity: v.number(),
            unit: v.string(),
        })),
        totalAmount: v.number(),
        farmerAmount: v.number(), // Required field - amount that goes to the farmer
        dispatcherAmount: v.number(), // Required field - amount that goes to the dispatcher
        deliveryAddress: v.string(),
        deliveryCoordinates: v.optional(v.object({
            lat: v.number(),
            lng: v.number()
        })),
        pickupLocation: v.optional(v.string()), // Add this field
        pickupCoordinates: v.optional(v.object({ // Add this field
            lat: v.number(),
            lng: v.number()
        })),
        deliveryDistance: v.number(),
        deliveryCost: v.number(),
        totalCost: v.number(),
        paymentMethod: v.union(v.literal("lisk_zar"), v.literal("cash")),
        paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
        orderStatus: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("preparing"), v.literal("ready"), v.literal("in_transit"), v.literal("delivered"), v.literal("cancelled")),
        specialInstructions: v.optional(v.string()),
        estimatedPickupTime: v.optional(v.string()), // Add this field
        estimatedDeliveryTime: v.optional(v.string()),
        actualDeliveryTime: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_buyer", ["buyerId"])
        .index("by_farmer", ["farmerId"])
        .index("by_dispatcher", ["dispatcherId"])
        .index("by_status", ["orderStatus"])
        .index("by_payment_status", ["paymentStatus"])
        .index("by_created_at", ["createdAt"]),

    // Deliveries table (for dispatcher tracking)
    deliveries: defineTable({
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
        status: v.union(v.literal("assigned"), v.literal("picked_up"), v.literal("in_transit"), v.literal("delivered")),
        estimatedPickupTime: v.optional(v.string()),
        actualPickupTime: v.optional(v.string()),
        estimatedDeliveryTime: v.optional(v.string()),
        actualDeliveryTime: v.optional(v.string()),
        notes: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_dispatcher", ["dispatcherId"])
        .index("by_order", ["orderId"])
        .index("by_status", ["status"]),

    // Categories table
    categories: defineTable({
        categoryId: v.string(), // Unique identifier matching constants
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        images: v.array(v.string()), // Array of image URLs
        productCount: v.number(), // Cached count of products in this category
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_category_id", ["categoryId"])
        .index("by_slug", ["slug"])
        .index("by_active", ["isActive"]),

    // Notifications table
    notifications: defineTable({
        userId: v.string(),
        type: v.union(v.literal("order_update"), v.literal("payment"), v.literal("delivery"), v.literal("system")),
        title: v.string(),
        message: v.string(),
        isRead: v.boolean(),
        metadata: v.optional(v.any()),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_read_status", ["isRead"])
        .index("by_created_at", ["createdAt"]),

    // Ratings table for farmer reviews
    ratings: defineTable({
        farmerId: v.string(), // clerkUserId of the farmer
        buyerId: v.string(), // clerkUserId of the buyer
        orderId: v.string(), // Reference to the order
        rating: v.number(), // 1-5 stars
        review: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_farmer", ["farmerId"])
        .index("by_buyer", ["buyerId"])
        .index("by_order", ["orderId"])
        .index("by_rating", ["rating"]),
}); 