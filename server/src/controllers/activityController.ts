import { Request, Response, NextFunction } from 'express';
import ActivityLog from '../models/ActivityLog';
import { sendSuccess } from '../utils/response';

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin)
export const getActivityLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.pageNumber) || 1;
        const pageSize = 20;

        const count = await ActivityLog.countDocuments();
        const logs = await ActivityLog.find()
            .populate('user', 'name role')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        sendSuccess(res, { logs, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        next(error);
    }
};

// Helper function to log activity (not an endpoint)
export const logActivity = async (userId: string, action: string, target: string, details?: any, req?: Request) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            target,
            details,
            ipAddress: req?.ip,
            userAgent: req?.headers['user-agent']
        } as any);
    } catch (error) {
        console.error('Failed to log activity', error);
    }
}
