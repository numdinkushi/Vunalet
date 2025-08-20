export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    farmer: string;
    location: string;
    rating: number;
    images: string[];
    quantity: number;
    harvestDate: string;
    featured: boolean;
}

export interface PurchaseFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    quantity: number;
    deliveryDistance: number;
    deliveryCost: number;
    totalCost: number;
}

export interface ProductDetailPageProps {
    product: Product;
    formData: PurchaseFormData;
    isCalculating: boolean;
    isProcessing: boolean; // Add this
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
} 