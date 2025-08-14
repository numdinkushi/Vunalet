import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { uploadProfilePicture } from '../../lib/cloudinary';

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

const uploadMiddleware = upload.single('image'); // Allow only 1 image for profile

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Handle file upload with multer
        await new Promise((resolve, reject) => {
            uploadMiddleware(req as unknown as Express.Request, res as unknown as Express.Response, (err: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });

        const file = (req as unknown as { file: Express.Multer.File; }).file;

        if (!file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Upload to Cloudinary using profile picture function
        const imageUrl = await uploadProfilePicture(file.buffer);

        res.status(200).json({
            success: true,
            url: imageUrl,
            message: 'Profile picture uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Failed to upload profile picture',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 