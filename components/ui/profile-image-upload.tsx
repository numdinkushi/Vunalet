'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { Label } from './label';

interface ProfileImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function ProfileImageUpload({
    value,
    onChange,
    label = "Profile Picture",
    placeholder = "Upload your profile picture",
    className = ""
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value && value.trim() !== '' ? value : null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await handleFileUpload(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload-profile-picture', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();

            if (data.success && data.url) {
                setPreview(data.url);
                onChange(data.url);
                setUploadSuccess(true);
                // Reset success state after 3 seconds
                setTimeout(() => setUploadSuccess(false), 3000);
            } else {
                throw new Error('No image URL returned');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <Label className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
            )}

            <div className="space-y-4">
                {/* Preview Section */}
                {preview && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700">Current Profile Picture</Label>
                            {uploadSuccess && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    ✓ Uploaded successfully!
                                </span>
                            )}
                        </div>
                        <div className="relative inline-block group">
                            <div className="relative">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Profile preview"
                                        width={128}
                                        height={128}
                                        className={`rounded-lg object-cover border-2 shadow-sm transition-all duration-200 ${uploadSuccess
                                            ? 'border-green-300 ring-2 ring-green-200'
                                            : 'border-gray-200'
                                            }`}
                                        priority
                                    />
                                ) : (
                                    <div className={`w-32 h-32 rounded-lg border-2 shadow-sm flex items-center justify-center bg-gray-100 ${uploadSuccess
                                        ? 'border-green-300 ring-2 ring-green-200'
                                        : 'border-gray-200'
                                        }`}>
                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 transform scale-90 group-hover:scale-100"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Click the X to remove this image</p>
                        </div>
                    </div>
                )}

                {/* Upload Area */}
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                        ${isDragOver
                            ? 'border-green-400 bg-green-50 scale-105'
                            : preview
                                ? 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                        }
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />

                    <div className="space-y-3">
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <span className="text-sm text-gray-600">Uploading your profile picture...</span>
                                <span className="text-xs text-gray-500">Please wait</span>
                            </div>
                        ) : preview ? (
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-600">Click to change image</p>
                                <p className="text-xs text-gray-500">or drag and drop a new image</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="text-sm text-gray-600">{placeholder}</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                <p className="text-xs text-gray-400">Click or drag and drop</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* URL Input (for manual entry) */}
                <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Or enter image URL manually:</Label>
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => {
                            const url = e.target.value;
                            onChange(url);
                            if (url && url.trim() !== '') {
                                setPreview(url);
                            } else {
                                setPreview(null);
                            }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
} 