import express from 'express';
import {
    subscribeEmail,
    getAllSubscribers,
    unsubscribeEmail,
    previewNewsletter,
    broadcastNewsletter
} from '../controllers/subscriberController';
// 🚀 THE FIX: Import it as 'authorize' and use it consistently
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// 1. Public Subscribe
router.post('/subscribe', subscribeEmail);

// 2. Admin Get All
router.get('/', protect, authorize('admin'), getAllSubscribers);

// 3. Admin Preview
router.post('/preview', protect, authorize('admin'), previewNewsletter);

// 4. Admin Broadcast
router.post('/broadcast', protect, authorize('admin'), broadcastNewsletter);

// 5. Delete/Unsubscribe
// 🚀 FIXED: Changed 'admin' to 'authorize('admin')' to match your auth logic
router.delete('/:identifier', protect, authorize('admin'), unsubscribeEmail);

export default router;