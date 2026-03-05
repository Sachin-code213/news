import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Cloudinary Storage with Dynamic Folders
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
        // Keeps your logic: Separate ads from standard uploads
        const isAd = req.originalUrl.includes('ads');
        return {
            folder: isAd ? 'khabarpoint/ads' : 'khabarpoint/articles',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            public_id: Date.now() + '-' + Math.round(Math.random() * 1E9),
        };
    },
});

// 3. Create the multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 🚀 Export both ways to maintain compatibility
export { upload };
export default upload;