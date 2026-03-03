import { Request, Response } from 'express'; // 🚀 1. Import Express types
import User from '../models/User'; // 🚀 2. Import your User model

/**
 * @desc    Verify eSewa payment and upgrade user
 * @route   GET /api/payments/esewa-success
 */
export const verifyEsewaPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data } = req.query; // TypeScript now knows 'query' exists

        if (!data) {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=no_data`);
            return;
        }

        // 1. Decode the base64 data from eSewa
        const decodedString = Buffer.from(data as string, 'base64').toString('utf-8');
        const decodedData = JSON.parse(decodedString);

        // 2. Extract User ID (assuming format: PRO-userId-timestamp)
        const userId = decodedData.transaction_uuid.split('-')[1];

        if (decodedData.status === 'COMPLETE') {
            // 🚀 3. Update the user in MongoDB
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    isPro: true,
                    proSubscriptionDate: new Date()
                },
                { new: true }
            );

            if (!updatedUser) {
                res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reason=user_not_found`);
                return;
            }

            // Redirect to frontend success page
            res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
        }
    } catch (error) {
        console.error("eSewa Verification Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }
};