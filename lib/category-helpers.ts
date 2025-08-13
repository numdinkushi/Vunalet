import { categoryMap, categories } from '../constants/categories';

/**
 * Get category name from category ID
 */
export function getCategoryName(categoryId: string): string | undefined {
    return categoryMap[categoryId as keyof typeof categoryMap];
}

/**
 * Get category names from an array of category IDs
 */
export function getCategoryNames(categoryIds: string[]): string[] {
    return categoryIds
        .map(id => getCategoryName(id))
        .filter((name): name is string => name !== undefined);
}

/**
 * Get category object from category ID
 */
export function getCategory(categoryId: string) {
    return categories.find(cat => cat.id === categoryId);
}

/**
 * Get categories from an array of category IDs
 */
export function getCategories(categoryIds: string[]) {
    return categories.filter(cat => categoryIds.includes(cat.id));
}

/**
 * Check if a category ID is valid
 */
export function isValidCategoryId(categoryId: string): boolean {
    return categoryId in categoryMap;
}

/**
 * Get all available category IDs
 */
export function getAllCategoryIds(): string[] {
    return Object.keys(categoryMap);
} 