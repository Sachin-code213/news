import { Response } from 'express';

interface ResponseData {
    success: boolean;
    message?: string;
    data?: any;
    error?: any;
}

export const sendResponse = (
    res: Response,
    statusCode: number,
    success: boolean,
    data?: any,
    message?: string,
    error?: any
) => {
    const response: ResponseData = {
        success,
        message,
        data,
        error,
    };

    // Remove undefined keys
    Object.keys(response).forEach((key) => {
        if ((response as any)[key] === undefined) {
            delete (response as any)[key];
        }
    });

    return res.status(statusCode).json(response);
};

export const sendSuccess = (res: Response, data: any, message?: string) => {
    return sendResponse(res, 200, true, data, message);
};

export const sendCreated = (res: Response, data: any, message?: string) => {
    return sendResponse(res, 201, true, data, message);
};

export const sendError = (res: Response, statusCode: number, message: string, error?: any) => {
    return sendResponse(res, statusCode, false, undefined, message, error);
};
