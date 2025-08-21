'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { ConfirmationModal } from '../../../ui/confirmation-modal';
import { useProductDeletion } from '../../../../hooks/use-product-deletion';

interface DeleteProductButtonProps {
    productId: string;
    productName: string;
    onSuccess?: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export function DeleteProductButton({
    productId,
    productName,
    onSuccess,
    variant = 'destructive',
    size = 'sm',
    className = ''
}: DeleteProductButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { deleteProduct, isDeleting } = useProductDeletion({
        onSuccess: () => {
            onSuccess?.();
            setIsModalOpen(false);
        }
    });

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteProduct({ productId, productName });
    };

    const handleCloseModal = () => {
        if (!isDeleting) {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={`flex items-center space-x-2 ${className}`}
            >
                <Trash2 className="w-4 h-4" />
                {size !== 'icon' && <span>Delete</span>}
            </Button>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
                confirmText="Delete Product"
                cancelText="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
} 