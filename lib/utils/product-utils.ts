export interface ExpiryConfig {
    roomTemp: number;    // Days at room temperature
    refrigerated: number; // Days when refrigerated
    frozen?: number;     // Days when frozen (optional)
}

export type StorageMethod = 'room_temp' | 'refrigerated' | 'frozen';

export const EXPIRY_CONFIG: Record<string, ExpiryConfig> = {
    '1': { roomTemp: 7, refrigerated: 14 },      // Vegetables
    '2': { roomTemp: 7, refrigerated: 14 },      // Fruits  
    '3': { roomTemp: 60, refrigerated: 90 },     // Grains
    '4': { roomTemp: 21, refrigerated: 45 },     // Tubers
    '5': { roomTemp: 7, refrigerated: 14 },      // Legumes
    '6': { roomTemp: 180, refrigerated: 365 },   // Nuts
    '7': { roomTemp: 10, refrigerated: 21 },     // Dairy
    '8': { roomTemp: 5, refrigerated: 7 },       // Meat
    '9': { roomTemp: 3, refrigerated: 5 },       // Fish
    '10': { roomTemp: 21, refrigerated: 45 },    // Eggs
    '11': { roomTemp: 365, refrigerated: 730 },  // Oils
    '12': { roomTemp: 7, refrigerated: 14 }      // Herbs
};

/**
 * Get expiry days for a category based on storage method
 */
export const getExpiryDaysForCategory = (categoryId: string, storageMethod: StorageMethod): number => {
    const config = EXPIRY_CONFIG[categoryId];
    if (!config) {
        return 7; // Default to 7 days if category not found
    }

    switch (storageMethod) {
        case 'refrigerated':
            return config.refrigerated;
        case 'frozen':
            return config.frozen || config.refrigerated; // Fallback to refrigerated if frozen not specified
        case 'room_temp':
        default:
            return config.roomTemp;
    }
};

/**
 * Calculate expiry date based on harvest date, category, and storage method
 */
export const calculateExpiryDate = (
    harvestDate: string,
    categoryId: string,
    storageMethod: StorageMethod = 'room_temp'
): string => {
    const harvest = new Date(harvestDate);
    if (isNaN(harvest.getTime())) {
        throw new Error('Invalid harvest date');
    }

    const expiryDays = getExpiryDaysForCategory(categoryId, storageMethod);
    const expiry = new Date(harvest.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    return expiry.toISOString().split('T')[0];
};

/**
 * Validate if a product is expired
 */
export const isProductExpired = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
};

/**
 * Get days until expiry
 */
export const getDaysUntilExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Get expiry status for display
 */
export const getExpiryStatus = (expiryDate: string): 'fresh' | 'expiring_soon' | 'expired' => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry < 0) {
        return 'expired';
    } else if (daysUntilExpiry <= 3) {
        return 'expiring_soon';
    } else {
        return 'fresh';
    }
}; 