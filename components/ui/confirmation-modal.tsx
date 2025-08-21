'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-500',
                    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    border: 'border-yellow-200'
                };
            case 'info':
                return {
                    icon: 'text-blue-500',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    border: 'border-blue-200'
                };
            default:
                return {
                    icon: 'text-red-500',
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                    border: 'border-red-200'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full border ${styles.border}`}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 leading-relaxed">{message}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="px-6"
                            >
                                {cancelText}
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`px-6 ${styles.button}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Deleting...</span>
                                    </div>
                                ) : (
                                    confirmText
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 