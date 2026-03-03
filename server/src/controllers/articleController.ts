import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Article from '../models/Article';
import Category from '../models/Category';
import User from '../models/User';
import slugify from 'slugify';

/**
 * 1. Create Article
 */
/**
 * 1. Create Article (Updated for Video Support)
 */
export const createArticle = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {
            titleEn, titleNe, contentEn, contentNe,
            category, isBreaking, isLive, excerptEn, excerptNe,
            type, videoUrl // 🚀 Added these
        } = req.body;

        if (!titleEn && !titleNe) {
            return res.status(400).json({ success: false, message: "Title is required." });
        }

        const baseSlug = titleEn || titleNe;
        const slug = `${slugify(baseSlug, { lower: true, strict: true })}-${Date.now()}`;

        const newArticle = new Article({
            titleEn: titleEn || '',
            titleNe: titleNe || '',
            contentEn: contentEn || '',
            contentNe: contentNe || '',
            excerptEn: excerptEn || '',
            excerptNe: excerptNe || '',
            category,
            slug,
            type: type || 'text', // 🚀 Save the type
            videoUrl: videoUrl || '', // 🚀 Save the YouTube URL
            isBreaking: String(isBreaking) === 'true',
            isLive: String(isLive) === 'true',
            // Correctly handles local uploads OR external YouTube thumbnail URLs
            image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
            author: req.user.id
        });

        const savedArticle = await newArticle.save();
        res.status(201).json({ success: true, data: savedArticle });
    } catch (error) {
        next(error);
    }
};


export const getArticles = async (req: any, res: any) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const { category, categoryName, isBreaking, isLive, limit, type } = req.query; // 🚀 Added type
        let query: any = {};

        const activeCategory = category || categoryName;

        if (activeCategory && activeCategory !== 'all') {
            const isObjectId = mongoose.Types.ObjectId.isValid(activeCategory);
            query.category = isObjectId ? new mongoose.Types.ObjectId(activeCategory) : activeCategory;
        }

        if (isBreaking) query.isBreaking = isBreaking === 'true';
        if (isLive) query.isLive = isLive === 'true';
        if (type) query.type = type; // 🚀 Allows /api/articles?type=video

        const articles = await Article.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) || 100)
            .populate('category', 'nameEn nameNe')
            .populate('author', 'name')
            .lean();

        return res.status(200).json({
            success: true,
            count: articles.length,
            data: articles,
            articles: articles
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateArticle = async (req: any, res: Response, next: NextFunction) => {
    try {
        const updateData = { ...req.body };

        // Ensure booleans are handled correctly
        if (updateData.isBreaking !== undefined) updateData.isBreaking = String(updateData.isBreaking) === 'true';
        if (updateData.isLive !== undefined) updateData.isLive = String(updateData.isLive) === 'true';

        // Image logic: File upload takes priority, then fallback to current image field (URL)
        if (req.file) {
            const oldArticle = await Article.findById(req.params.id);
            if (oldArticle?.image?.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '../../', oldArticle.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const article = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
};

/**
 * 4. All Other Functionalities (Views, Slug, Search, Stats)
 */
export const incrementArticleViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await Article.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
        res.status(200).json({ success: true, views: article?.views });
    } catch (error) { next(error); }
};

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article?.image?.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../../', article.image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) { next(error); }
};

export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug }).populate('category author');
        res.status(200).json({ success: true, data: article });
    } catch (error) { next(error); }
};

export const searchArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regex = new RegExp(String(req.query.query), 'i');
        const articles = await Article.find({ $or: [{ titleEn: regex }, { titleNe: regex }] }).limit(6);
        res.status(200).json({ success: true, articles });
    } catch (error) { next(error); }
};

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalArticles = await Article.countDocuments();
        const trendingNow = await Article.find().sort('-views').limit(5).select('titleEn views').lean();
        res.status(200).json({ success: true, stats: { totalArticles, trendingNow } });
    } catch (error) { res.status(500).json({ success: false }); }
};
/**
 * 5. Get Single Article by ID (Required for Admin Editor)
 */
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('category', 'nameEn nameNe')
            .populate('author', 'name');

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(200).json({ success: true, data: article });
    } catch (error) {
        // Handle invalid MongoDB ID format specifically
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ success: false, message: "Invalid Article ID format" });
        }
        next(error);
    }
};