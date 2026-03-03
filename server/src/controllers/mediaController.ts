import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { sendSuccess, sendError } from '../utils/response';
import logger from '../utils/logger';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// @desc    Get all uploaded files
// @route   GET /api/media
// @access  Private (Admin/Editor)
export const getMediaFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!fs.existsSync(UPLOADS_DIR)) return sendSuccess(res, []);

        const files = fs.readdirSync(UPLOADS_DIR)
            .filter(file => fs.statSync(path.join(UPLOADS_DIR, file)).isFile()) // 🚀 Only show files
            .map(file => {
                const stats = fs.statSync(path.join(UPLOADS_DIR, file));
                return {
                    name: file,
                    url: `/uploads/${file}`,
                    size: stats.size,
                    createdAt: stats.birthtime,
                };
            });

        files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        sendSuccess(res, files);
    } catch (error) { next(error); }
};

// @desc    Delete a file
// @route   DELETE /api/media/:filename
// @access  Private (Admin)
export const deleteMediaFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filename } = req.params;
        if (typeof filename !== 'string') {
            return sendError(res, 400, 'Invalid filename');
        }
        const filePath = path.join(UPLOADS_DIR, filename);

        // Prevent directory traversal
        if (!filePath.startsWith(UPLOADS_DIR)) {
            return sendError(res, 400, 'Invalid filename');
        }

        if (!fs.existsSync(filePath)) {
            return sendError(res, 404, 'File not found');
        }

        fs.unlinkSync(filePath);
        sendSuccess(res, null, 'File deleted successfully');
    } catch (error) {
        logger.error(`Error deleting file: ${req.params.filename}`, error);
        next(error);
    }
};
