import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { uploadImage } from '../../lib/cloudinary';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// Disable body parsing, we'll handle it with multer
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadMiddleware = upload.array('images', 5); // Allow up to 5 images

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Handle file upload with multer
        await new Promise((resolve, reject) => {
            uploadMiddleware(req as any, res as any, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });

        const files = (req as any).files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        const uploadedUrls: string[] = [];

        // Upload each file to Cloudinary
        for (const file of files) {
            try {
                const imageUrl = await uploadImage(file.buffer);
                uploadedUrls.push(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
        }

        res.status(200).json({
            success: true,
            urls: uploadedUrls,
            message: `Successfully uploaded ${uploadedUrls.length} image(s)`
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Failed to upload images',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 