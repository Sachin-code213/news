import express from 'express';
import { getMediaFiles, deleteMediaFile } from '../controllers/mediaController';
import { protect, authorize } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Upload endpoint is already handled in article routes, but we could make a generic one here
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.status(201).json({
        success: true,
        data: {
            filename: req.file.filename,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        }
    });
});

router.route('/')
    .get(protect, authorize('admin', 'editor'), getMediaFiles);

router.route('/:filename')
    .delete(protect, authorize('admin'), deleteMediaFile);

export default router;
