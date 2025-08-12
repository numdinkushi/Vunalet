import { useState } from 'react';
import { toast } from 'sonner';

interface UseImageUploadReturn {
    uploadImages: (files: FileList | File[]) => Promise<string[]>;
    isUploading: boolean;
    uploadProgress: number;
    resetUpload: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadImages = async (files: FileList | File[]): Promise<string[]> => {
        if (!files || files.length === 0) {
            toast.error('Please select at least one image');
            return [];
        }

        // Convert FileList to array if needed
        const fileArray = Array.from(files);

        // Validate file types and sizes
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        for (const file of fileArray) {
            if (!allowedTypes.includes(file.type)) {
                toast.error(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or WebP images.`);
                return [];
            }
            if (file.size > maxSize) {
                toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
                return [];
            }
        }

        if (fileArray.length > 5) {
            toast.error('Maximum 5 images allowed');
            return [];
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            fileArray.forEach((file) => {
                formData.append('images', file);
            });

            // Simulate progress (since we can't track actual upload progress with this setup)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                return data.urls;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            toast.error(errorMessage);
            return [];
        } finally {
            setIsUploading(false);
            // Reset progress after a delay
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const resetUpload = () => {
        setIsUploading(false);
        setUploadProgress(0);
    };

    return {
        uploadImages,
        isUploading,
        uploadProgress,
        resetUpload,
    };
} 