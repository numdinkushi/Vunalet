import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { toast } from 'sonner';

interface UseProductDeletionProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface DeleteProductParams {
    productId: string;
    productName: string;
}

export function useProductDeletion({ onSuccess, onError }: UseProductDeletionProps = {}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteProduct = useMutation(api.products.deleteProduct);

    const handleDeleteProduct = async ({ productId, productName }: DeleteProductParams) => {
        try {
            setIsDeleting(true);

            await deleteProduct({ productId });

            toast.success(`"${productName}" has been deleted successfully`);
            onSuccess?.();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
            console.error('Error deleting product:', error);

            toast.error(errorMessage);
            onError?.(errorMessage);

        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteProduct: handleDeleteProduct,
        isDeleting
    };
} 