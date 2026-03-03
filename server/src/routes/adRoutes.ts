import express from 'express';
import { getAds, getAdminAds, createAd, deleteAd } from '../controllers/adController';
import { protect, authorize } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// 🌏 Public
router.get('/', getAds);

// 🔐 Admin
router.get('/admin/all', protect, authorize('admin'), getAdminAds);

// 🚀 THE FIX: Add the upload middleware here!
// 'image' must match the key used in your Frontend FormData
router.post('/', protect, authorize('admin'), upload.single('image'), createAd);

router.delete('/:id', protect, authorize('admin'), deleteAd);

export default router;