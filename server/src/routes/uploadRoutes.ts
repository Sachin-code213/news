import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// 1. Configure Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Ensure this folder exists in your server root
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// 2. The Upload Endpoint
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.status(200).json({
        success: true,
        url: `http://localhost:5000/uploads/${req.file.filename}`
    });
});

export default router;