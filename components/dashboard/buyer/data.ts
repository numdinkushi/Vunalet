import { OrderStats } from './types';

// South African mock data
export const mockOrderStats: OrderStats = {
    total: 24,
    pending: 3,
    confirmed: 2,
    preparing: 1,
    ready: 1,
    inTransit: 2,
    delivered: 15,
    totalRevenue: 2850.75
};

// Remove the entire mockOrders array and related data since it's not used 