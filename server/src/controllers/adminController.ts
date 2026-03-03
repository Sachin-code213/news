import { Request, Response } from 'express';
import User from '../models/User';
import Settings from '../models/Settings';
import Election from '../models/Election';
/**
 * @desc    Get all users interested in Pro
 * @route   GET /api/admin/pro-waitlist
 */
export const getProWaitlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const waitlist = await User.find({ isProInterested: true })
            .select('name email createdAt role')
            .sort('-createdAt')
            .lean();

        res.status(200).json({
            success: true,
            count: waitlist.length,
            data: waitlist
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/admin/stats
 */
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [totalUsers, proInterests, adminCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isProInterested: true }),
            User.countDocuments({ role: 'admin' })
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                proInterests,
                adminCount
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Get Global Site Settings (Used by App.tsx for Maintenance check)
 * @route   GET /api/settings
 */
// controllers/adminController.ts


export const getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        let settingsData = await Settings.findOne();

        if (!settingsData) {
            settingsData = await Settings.create({
                siteName: 'KhabarPoint',
                maintenanceMode: false,
                showElectionTally: false // Default to false for new installs
            });
        }

        // 🔍 FIX: If the document exists but showElectionTally is missing (undefined)
        // This line forces it to be part of the object sent to the frontend
        if (settingsData.showElectionTally === undefined) {
            await Settings.updateOne({}, { $set: { showElectionTally: false } });
        }

        res.status(200).json({
            success: true,
            data: settingsData
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * @desc    Update Site Settings (Branding, SEO, Maintenance Mode)
 * @route   PUT /api/settings
 */
export const updateSiteSettings = async (req: Request, res: Response) => {
    try {
        // We use an empty filter {} because there is only ONE settings document
        const settings = await Settings.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Site settings updated",
            data: settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ... (keep your existing getProWaitlist, getAdminStats, getSettings, etc.)

/**
 * @desc    Create a new Election Candidate
 * @route   POST /api/election/candidates
 */
/**
 * @desc    Create a new Election Candidate
 * @route   POST /api/election/candidates
 */
export const createCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        // 💡 Use req.body directly so 'place' (from frontend) 
        // matches 'place' (in your Mongoose model)
        const candidate = await Election.create(req.body);

        res.status(201).json({
            success: true,
            message: "Candidate added to tally",
            data: candidate
        });
    } catch (error: any) {
        console.error("🔥 ELECTION_CREATE_ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create candidate - Check if all required fields are sent",
            error: error.message
        });
    }
};

/**
 * @desc    Update Candidate Details (Votes, Winner Status, Logo, etc.)
 * @route   PUT /api/election/candidates/:id
 */
export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        // Use $set with req.body to update any field sent from the frontend
        const candidate = await Election.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            res.status(404).json({ success: false, message: "Candidate not found" });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Candidate updated successfully",
            data: candidate
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error updating candidate",
            error: error.message
        });
    }
};

/**
 * @desc    Delete an Election Candidate
 * @route   DELETE /api/election/candidates/:id
 */
export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Election.findByIdAndDelete(req.params.id);

        if (!candidate) {
            res.status(404).json({ success: false, message: "Candidate not found" });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Candidate removed from tally"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getElectionResults = async (req: Request, res: Response) => {
    try {
        const results = await Election.find().sort({ votes: -1 });
        // The key 'data' is mandatory for your frontend logic!
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};