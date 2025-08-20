import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const upsertUserBalance = mutation({
    args: {
        clerkUserId: v.string(),
        token: v.string(),
        walletBalance: v.number(),
        ledgerBalance: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("balances")
            .withIndex("by_user_token", (q) => q.eq("clerkUserId", args.clerkUserId).eq("token", args.token))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                walletBalance: args.walletBalance,
                ledgerBalance: args.ledgerBalance,
                updatedAt: Date.now(),
            });
            return existing._id;
        }

        const id = await ctx.db.insert("balances", {
            clerkUserId: args.clerkUserId,
            token: args.token,
            walletBalance: args.walletBalance,
            ledgerBalance: args.ledgerBalance,
            updatedAt: Date.now(),
        });

        return id;
    },
});

export const getUserBalance = query({
    args: {
        clerkUserId: v.string(),
        token: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("balances")
            .withIndex("by_user_token", (q) => q.eq("clerkUserId", args.clerkUserId).eq("token", args.token))
            .first();

        if (!existing) {
            return { walletBalance: 0, ledgerBalance: 0 };
        }

        return {
            walletBalance: existing.walletBalance,
            ledgerBalance: existing.ledgerBalance,
        };
    },
});

// Get user balance with calculated ledger balance
export const getUserBalanceWithLedger = query({
    args: {
        clerkUserId: v.string(),
        token: v.string(),
        role: v.union(v.literal("buyer"), v.literal("farmer"), v.literal("dispatcher")),
    },
    handler: async (ctx, args) => {
        // Get wallet balance from balances table
        const existing = await ctx.db
            .query("balances")
            .withIndex("by_user_token", (q) => q.eq("clerkUserId", args.clerkUserId).eq("token", args.token))
            .first();

        const walletBalance = existing?.walletBalance || 0;

        // Calculate ledger balance based on role and pending orders
        let ledgerBalance = 0;

        if (args.role === "buyer") {
            const pendingTotal = await ctx.runQuery(api.orders.getBuyerPendingTotal, {
                buyerId: args.clerkUserId
            });
            ledgerBalance = pendingTotal;
        } else if (args.role === "farmer") {
            const pendingTotal = await ctx.runQuery(api.orders.getFarmerPendingTotal, {
                farmerId: args.clerkUserId
            });
            ledgerBalance = pendingTotal;
        } else if (args.role === "dispatcher") {
            const pendingTotal = await ctx.runQuery(api.orders.getDispatcherPendingTotal, {
                dispatcherId: args.clerkUserId
            });
            ledgerBalance = pendingTotal;
        }

        return {
            walletBalance,
            ledgerBalance,
        };
    },
}); 