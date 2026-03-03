import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Subscriber from '../models/Subscriber';
import sendEmail from '../utils/sendEmail';

/**
 * 1. Subscribe a new email (Professional UX)
 */
export const subscribeEmail = async (req: Request, res: Response) => {
    try {
        const { email, lang = 'en' } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: lang === 'en' ? "You are already a part of our newsroom!" : "तपाईं पहिले नै हाम्रो न्यूजरूमको हिस्सा हुनुहुन्छ!"
            });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        const welcomeSubject = lang === 'en' ? "Welcome to the KhabarPoint Family!" : "खबरप्वाइन्ट परिवारमा स्वागत छ!";
        const welcomeMessage = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 24px; background-color: #ffffff;">
                <h1 style="color: #dc2626; font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">KHABARPOINT</h1>
                <p style="font-size: 16px; color: #334155; line-height: 1.6;">
                    ${lang === 'en'
                ? 'Thank you for subscribing. You are now part of an exclusive community receiving the most reliable updates first.'
                : 'हाम्रो न्यूजलेटरमा जोडिनु भएकोमा धन्यवाद। तपाईं अब सबैभन्दा भरपर्दो अपडेटहरू पहिले प्राप्त गर्ने एक विशेष समुदायको हिस्सा हुनुहुन्छ।'}
                </p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #94a3b8;">
                    © 2026 KhabarPoint News Network.
                </div>
            </div>
        `;

        sendEmail({ email, subject: welcomeSubject, message: welcomeMessage }).catch(err => console.error("Welcome Email Error:", err));

        res.status(201).json({
            success: true,
            message: lang === 'en' ? "Thank you for joining our community!" : "हाम्रो समुदायमा जोडिनुभएकोमा धन्यवाद!"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Our newsroom is busy. Please try again shortly." });
    }
};

/**
 * 🚀 2. Get All Subscribers (MISSING EXPORT ADDED)
 */
export const getAllSubscribers = async (req: Request, res: Response) => {
    try {
        const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
        res.status(200).json({ success: true, data: subscribers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch subscribers." });
    }
};

/**
 * 🚀 3. Unsubscribe/Delete (MISSING EXPORT ADDED)
 */
// 🚀 Must import this

export const unsubscribeEmail = async (req: Request, res: Response) => {
    try {
        // 🚀 THE FIX: Cast the parameter to a string
        const identifier = req.params.identifier as string;

        let subscriber = null;

        // 1. Check if the string is a valid MongoDB ID format
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            subscriber = await Subscriber.findByIdAndDelete(identifier);
        }

        // 2. If not found by ID, search and delete by the email field
        if (!subscriber) {
            subscriber = await Subscriber.findOneAndDelete({ email: identifier });
        }

        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Subscriber not found." });
        }

        res.status(200).json({ success: true, message: "Removed successfully." });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
/**
 * 🚀 4. Preview Newsletter (MISSING EXPORT ADDED)
 */
export const previewNewsletter = async (req: Request, res: Response) => {
    try {
        const { subject, body, testEmail } = req.body;
        await sendEmail({
            email: testEmail,
            subject: `[PREVIEW] ${subject}`,
            message: `<div style="font-family: sans-serif; line-height: 1.6; border: 2px dashed #dc2626; padding: 20px;">${body}</div>`
        });
        res.status(200).json({ success: true, message: "Preview sent!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send preview." });
    }
};

/**
 * 5. Broadcast Newsletter (Resilient Batch Processing)
 */
export const broadcastNewsletter = async (req: Request, res: Response) => {
    try {
        const { subject, body } = req.body;
        if (!subject || !body) {
            return res.status(400).json({ success: false, message: "Subject and Content are required for broadcast." });
        }

        const subscribers = await Subscriber.find().select('email').lean();
        if (subscribers.length === 0) {
            return res.status(200).json({ success: true, message: "No subscribers found.", count: 0 });
        }

        const batchSize = 10;
        let successCount = 0;

        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            const results = await Promise.allSettled(batch.map(sub =>
                sendEmail({
                    email: sub.email,
                    subject: subject,
                    message: `<div style="font-family: sans-serif; line-height: 1.6; color: #334155;">${body}</div>`
                })
            ));

            results.forEach((res) => {
                if (res.status === 'fulfilled') successCount++;
            });

            if (i + batchSize < subscribers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        res.status(200).json({
            success: true,
            count: successCount,
            message: `Newsroom Broadcast Complete. Successfully dispatched to ${successCount} readers.`
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "The mail dispatcher encountered an error. Please verify your SMTP settings."
        });
    }
};