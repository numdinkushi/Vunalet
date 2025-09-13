import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check for expired orders every 2 minutes
crons.interval(
    "auto assign expired orders",
    { minutes: 2 },
    internal.orders.checkExpiredOrders
);

// Check for expired orders every 30 seconds during peak hours (8 AM - 8 PM)
crons.interval(
    "auto assign expired orders peak hours",
    { seconds: 30 },
    internal.orders.checkExpiredOrders
);

export default crons; 