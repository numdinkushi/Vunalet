/**
 * Delivery-related constants
 */

export const DELIVERY_CONSTANTS = {
    // Cost per kilometer for delivery
    COST_PER_KM: 0.005,

    // Average delivery speed in km/h for ETA calculations
    AVERAGE_SPEED_KMH: 40,

    // Minimum delivery time in minutes
    MIN_DELIVERY_TIME_MINUTES: 15,
} as const; 