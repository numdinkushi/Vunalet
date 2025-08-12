import React, { useState } from 'react';
import { ImageUpload } from './image-upload';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export function ImageUploadTest() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImagesUploaded = (urls: string[]) => {
        setUploadedImages(urls);
        console.log('Uploaded images:', urls);
    };

    const handleReset = () => {
        setUploadedImages([]);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Image Upload Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ImageUpload
                    onImagesUploaded={handleImagesUploaded}
                    maxImages={5}
                />

                {uploadedImages.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Uploaded Images ({uploadedImages.length})</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {uploadedImages.map((url, index) => (
                                <div key={index} className="space-y-2">
                                    <img
                                        src={url}
                                        alt={`Test image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <p className="text-xs text-gray-500 truncate">{url}</p>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleReset} variant="outline">
                            Reset
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 