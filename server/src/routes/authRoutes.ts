import express from 'express';
import { loginUser, registerUser, getMe, logProInterest } from '../controllers/authController';
import { getProWaitlist, getAdminStats } from '../controllers/adminController';
// 🚀 Use 'as' to rename the middleware import and avoid the collision
import { protect, admin as adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/pro-interest', protect, logProInterest);
router.get('/me', protect, getMe);

// 🚀 Use the new 'adminMiddleware' name here
router.get('/pro-waitlist', protect, adminMiddleware, getProWaitlist);
router.get('/stats', protect, adminMiddleware, getAdminStats);

export default router;