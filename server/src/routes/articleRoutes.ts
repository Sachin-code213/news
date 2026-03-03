import express from 'express';
import {
    createArticle,
    updateArticle,
    getArticles,
    getArticleBySlug,
    getArticleById, // 🚀 1. MUST BE IMPORTED HERE
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

// 🚀 2. THE ID ROUTE: This handles the 404 error in your ArticleEditor.tsx
// It must come BEFORE the generic slug route if you don't use the '/slug/' prefix
router.get('/:id', getArticleById);

const handleUpload = (req: any, res: any, next: any) => {
    upload.single('image')(req, res, (err: any) => {
        if (err) return res.status(400).json({ success: false, message: "Image upload error: " + err.message });
        next();
    });
};

router.post('/', protect, admin, handleUpload, createArticle);
router.put('/:id', protect, admin, handleUpload, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

export default router;