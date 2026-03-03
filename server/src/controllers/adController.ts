import { Request, Response } from 'express';
import Ad from '../models/Ad';
import fs from 'fs';
import path from 'path';
// @desc    Get ads for Public Website (filtered by position)
// @route   GET /api/ads
export const getAds = async (req: Request, res: Response) => {
    try {
        const { position } = req.query;

        // 🚀 IMPROVED QUERY: Handle active status and expiration logic
        const query: any = {
            isActive: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } }
            ]
        };

        // Filter by position if provided
        if (position) {
            query.position = position;
        }

        const ads = await Ad.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: ads.length,
            data: ads
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get ALL ads for Admin Dashboard
// @route   GET /api/ads/admin/all
export const getAdminAds = async (req: Request, res: Response) => {
    try {
        // Sort by newest first so admin sees recent uploads at the top
        const ads = await Ad.find({}).sort('-createdAt');
        res.status(200).json({ success: true, data: ads });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new advertisement
// @route   POST /api/ads
export const createAd = async (req: Request, res: Response) => {
    try {
        // 🚀 VALIDATION: Check for required fields before hitting the database
        const { title, imageUrl, link, position } = req.body;

        if (!title || !imageUrl || !link || !position) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: title, imageUrl, link, and position."
            });
        }

        const ad = await Ad.create(req.body);
        res.status(201).json({ success: true, data: ad });
    } catch (error: any) {
        // This handles Mongoose validation errors (like invalid enum values)
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete advertisement
// @route   DELETE /api/ads/:id

// Add this to your adController.ts
export const deleteAd = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

        // Ads are stored in /uploads/ads/
        if (ad.imageUrl) {
            // Ensure the path correctly points to the 'ads' subfolder
            const filename = path.basename(ad.imageUrl);
            const filePath = path.join(process.cwd(), 'uploads', 'ads', filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Ad.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Ad deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Toggle Ad Active Status
// @route   PATCH /api/ads/:id/toggle
export const toggleAdStatus = async (req: Request, res: Response) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

        ad.isActive = !ad.isActive;
        await ad.save();

        res.status(200).json({ success: true, data: ad });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};