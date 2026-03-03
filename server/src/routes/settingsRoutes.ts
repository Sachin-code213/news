import express from 'express';
import {
    getSettings,
    updateSettings,
    submitContactForm,
    getInboxMessages,
    updateMessageStatus // Ensure this is imported
} from '../controllers/settingsController';
import { protect, authorize } from '../middleware/authMiddleware';
import { deleteInboxMessage } from '../controllers/settingsController';
const router = express.Router();

// --- 1. Public Routes ---
router.get('/', getSettings);
router.post('/contact', submitContactForm);
router.delete('/messages/:id', protect, authorize('admin'), deleteInboxMessage);
// --- 2. Admin Protected Routes ---
// Use authorize('admin') to ensure only administrators can access these
router.put('/', protect, authorize('admin'), updateSettings);
router.get('/messages', protect, authorize('admin'), getInboxMessages);

// 🚀 Route to update message status (read/unread/replied)
router.patch('/messages/:id/status', protect, authorize('admin'), updateMessageStatus);

export default router;