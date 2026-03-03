import { Request, Response } from 'express';
import Category from '../models/Category';
import slugify from 'slugify';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        // Fetch categories and sort alphabetically by English name
        const categories = await Category.find().sort({ nameEn: 1 }).lean();

        res.status(200).json({
            success: true,
            count: categories.length,
            categories, // Matches your frontend: res.data.categories
            data: categories // Backup for res.data.data
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories: " + error.message
        });
    }
};

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { nameEn, nameNe, slug } = req.body;

        if (!nameEn) {
            return res.status(400).json({ success: false, message: "English name is required" });
        }

        // Generate slug if not provided, or clean the provided slug
        const finalSlug = slug
            ? slugify(slug, { lower: true, strict: true })
            : slugify(nameEn, { lower: true, strict: true });

        // Check for existing slug to prevent 11000 Mongo errors
        const existingCategory = await Category.findOne({ slug: finalSlug });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "A category with this slug/name already exists"
            });
        }

        const category = new Category({
            nameEn,
            nameNe: nameNe || '',
            slug: finalSlug
        });

        const createdCategory = await category.save();
        res.status(201).json({
            success: true,
            data: createdCategory
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Creation failed: " + error.message
        });
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await category.deleteOne();
        res.status(200).json({ success: true, message: "Category removed" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};