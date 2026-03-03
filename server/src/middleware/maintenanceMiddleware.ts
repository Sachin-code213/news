import { Request, Response, NextFunction } from 'express';
import Settings from '../models/Settings';

export const checkMaintenance = async (req: any, res: Response, next: NextFunction) => {
    try {
        const settings = await Settings.findOne();

        // If maintenance is OFF, just proceed
        if (!settings || !settings.maintenanceMode) {
            return next();
        }

        // 🚀 BYPASS LOGIC: Allow Admins to keep working
        // 1. Allow calls to auth (so you can log in)
        // 2. Allow calls to settings (so you can turn it off)
        // 3. Allow users who are already logged in as admin
        const isAuthRoute = req.path.includes('/api/auth');
        const isSettingsRoute = req.path.includes('/api/settings');
        const isAdmin = req.user && req.user.role === 'admin';

        if (isAuthRoute || isSettingsRoute || isAdmin) {
            return next();
        }

        // Otherwise, block the request
        return res.status(503).json({
            maintenanceMode: true,
            message: "Site is under maintenance. Please try again later."
        });
    } catch (error) {
        next(); // If DB fails, don't crash the site
    }
};