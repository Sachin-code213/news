import express from 'express';
import {
    registerUser,
    loginUser,
    getUsers,
    updateUserRole,
    deleteUser
} from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * 🌏 PUBLIC ROUTES
 */
router.post('/register', registerUser);
router.post('/login', loginUser);

/**
 * 🔐 ADMIN ONLY ROUTES
 * These require both a valid token (protect) and admin role (authorize)
 */
router.use(protect, authorize('admin')); // Middleware applied to all routes below this line

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);
export default router;