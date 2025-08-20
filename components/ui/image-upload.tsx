import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from './progress';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
    onImagesUploaded: (urls: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUpload({ onImagesUploaded, maxImages = 5, className }: ImageUploadProps) {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadImages = async (files: File[]) => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('images', file);
            });

            // Simulate progress
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
                const newImages = [...uploadedImages, ...data.urls];
                setUploadedImages(newImages);
                onImagesUploaded(newImages);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (uploadedImages.length + acceptedFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }
        uploadImages(acceptedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedImages.length, maxImages]);

    const onDropRejected = useCallback((rejectedFiles: unknown[]) => {
        console.log('Rejected files:', rejectedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true,
        noClick: false,
        noKeyboard: false
    });

    const removeImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        onImagesUploaded(newImages);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Upload Area */}
            <div
                {...getRootProps()}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                        ? "Drop the images here..."
                        : "Drag & drop images here, or click to select"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP up to 5MB each. Max {maxImages} images.
                </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Uploading images...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {uploadedImages.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 