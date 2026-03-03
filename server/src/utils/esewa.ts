import crypto from 'crypto';

/**
 * Generates an HMAC-SHA256 signature for eSewa v2 integration
 * Format: total_amount,transaction_uuid,product_code
 */
export const generateEsewaSignature = (secretKey: string, data: string): string => {
    return crypto
        .createHmac('sha256', secretKey)
        .update(data)
        .digest('base64');
};