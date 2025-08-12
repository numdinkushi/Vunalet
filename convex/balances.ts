import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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