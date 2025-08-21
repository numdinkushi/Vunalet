export interface Product {
    _id: string;
    images: string[];
    name: string;
    price: number;
    unit: string;
    quantity: number;
    description?: string;
    harvestDate: string;
    isOrganic?: boolean;
    isFeatured: boolean;
    location: string;
    status: string;
    farmerId: string;
    categoryId: string;
    createdAt: number;
    updatedAt: number;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    images: string[];
    productCount: number;
}

export interface Farmer {
    clerkUserId: string;
    firstName: string;
}

export interface FilterState {
    searchTerm: string;
    selectedCategory: string;
    sortBy: string;
}

export interface PaginationState {
    currentPage: number;
    productsPerPage: number;
}

export interface ProductsPageProps {
    // Add any props if needed in the future
}

export interface ProductCardProps {
    product: Product;
    index: number;
    currentImageIndex: number;
    farmers?: Farmer[];
    showVideoBackground: boolean;
}

export interface FeaturedProductsProps {
    products: Product[];
    farmers?: Farmer[];
    currentImageIndexes: { [key: string]: number; };
}

export interface ProductFiltersProps {
    filterState: FilterState;
    onFilterChange: (filters: Partial<FilterState>) => void;
    categories: Category[];
}

export interface ProductGridProps {
    products: Product[];
    farmers?: Farmer[];
    currentImageIndexes: { [key: string]: number; };
    showVideoBackground: boolean;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface CategoryGridProps {
    categories: Category[];
}

export interface CategoryCardProps {
    category: Category;
    index: number;
} 