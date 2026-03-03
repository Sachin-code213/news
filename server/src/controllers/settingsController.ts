import { Request, Response } from 'express';
import Settings from '../models/Settings';
import Message from '../models/Message';
import User from '../models/User';

// 1. Get Settings (Public)
export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json({ success: true, data: settings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Update Settings (Admin Only)
// This handles Maintenance Mode, Site Names, and general branding
export const updateSettings = async (req: Request, res: Response) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            {},
            req.body, // Handles maintenanceMode: true/false automatically
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: settings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Submit Contact Form (Public)
export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        // Sets default status to 'unread' in the model
        const newMessage = await Message.create({ name, email, message });
        res.status(201).json({ success: true, message: "Message sent to admin inbox!" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get All Inbox Messages (Admin Only)
export const getInboxMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find().sort('-createdAt');
        res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Log Pro Interest (Authenticated Users)
export const logProInterest = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isProInterested = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Your interest in KhabarPoint Pro has been recorded!"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update Message Status (Admin Only)
export const updateMessageStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting { "status": "read" }

        const message = await Message.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        res.status(200).json({ success: true, data: message });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// 🗑️ 7. Delete Inbox Message (Admin Only)
// FIX: Permanently removes a message from the newsroom inbox
export const deleteInboxMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Captures the ID from the URL

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message already deleted or not found" });
        }

        res.status(200).json({
            success: true,
            message: "Message permanently deleted from newsroom inbox"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};