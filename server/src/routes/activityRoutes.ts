import express from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getActivityLogs);

export default router;
