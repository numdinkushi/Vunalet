export interface DispatcherWorkload {
    dispatcherId: string;
    pendingOrders: number;
    totalOrders: number;
}

export interface DispatcherAssignmentResult {
    dispatcherId: string;
    isAssigned: boolean;
    reason?: string;
}

export interface Dispatcher {
    clerkUserId: string;
}

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