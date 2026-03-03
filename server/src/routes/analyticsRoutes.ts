import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// 🚀 Only authenticated Admins can see the stats
router.get('/stats', protect, admin, getDashboardStats);

export default router;