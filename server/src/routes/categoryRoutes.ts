import express from 'express';
import {
    getCategories,
    createCategory,
    deleteCategory // 🚀 Added delete functionality
} from '../controllers/categoryController';
import { protect, admin } from '../middleware/authMiddleware'; // Standardized to 'admin'

const router = express.Router();

/**
 * 🔓 PUBLIC ROUTES
 */
// Used by both the Navbar and the Article Editor dropdown
router.get('/', getCategories);

/**
 * 🔒 PROTECTED ADMIN ROUTES
 */
// Note: Using 'admin' to match your ArticleRoutes style. 
// If you prefer 'authorize', ensure the function exists in your middleware.
router.post('/', protect, admin, createCategory);

// Added ID-based delete route for the Admin Category Management page
router.delete('/:id', protect, admin, deleteCategory);

export default router;