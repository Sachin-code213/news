import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 🚀 Auto-create directories
const uploadDir = path.join(process.cwd(), 'uploads');
const adsDir = path.join(uploadDir, 'ads');

[uploadDir, adsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // You can check the route to separate article images from ad images
        if (req.originalUrl.includes('ads')) {
            cb(null, 'uploads/ads/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: (req, file, cb) => {
        // Cleaning the filename to prevent issues with spaces/special chars
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the multer instance
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 🚀 THE FIX: Export both ways to satisfy your different route files
export { upload };
export default upload;