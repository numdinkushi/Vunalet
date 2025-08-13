export interface FarmerStats {
    totalProducts: number;
    totalCustomers: number;
    averageRating: number;
    totalRatings: number;
}

export interface Farmer {
    clerkUserId: string;
    firstName: string;
    lastName: string;
    location?: string;
    bio?: string;
    farmSize?: string;
    experience?: string;
    specialties?: string[];
    isOrganicCertified?: boolean;
    profilePicture?: string;
    stats: FarmerStats;
} 