import express from 'express';
import {
    createArticle,
    updateArticle,
    getArticles,
    getArticleBySlug,
    getArticleById,
    deleteArticle,
    searchArticles,
    incrementArticleViews,
    getAdminStats
} from '../controllers/articleController';
import { upload } from '../middleware/uploadMiddleware';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * 🔓 PUBLIC ROUTES
 */
router.get('/', getArticles);
router.get('/search/suggestions', searchArticles);
router.patch('/view/:slug', incrementArticleViews);

// Specific Slug route
router.get('/slug/:slug', getArticleBySlug);

/**
 * 🔒 PROTECTED ADMIN ROUTES
 */
router.get('/admin/stats', protect, admin, getAdminStats);

// 🚀 THE ID ROUTE: Remains before generic slug routes to avoid conflicts
router.get('/:id', getArticleById);

/**
 * ☁️ CLOUDINARY UPLOAD HANDLER
 * This stays compatible with your controllers while using the new Cloudinary engine.
 */
const handleUpload = (req: any, res: any, next: any) => {
    // 'image' matches the field name from your frontend form/Postman
    upload.single('image')(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Cloudinary Upload Error: " + err.message
            });
        }
        next();
    });
};

// Admin CRUD Operations
router.post('/', protect, admin, handleUpload, createArticle);
router.put('/:id', protect, admin, handleUpload, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

export default router;