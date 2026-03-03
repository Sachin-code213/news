import { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user?: any;  // Or replace 'any' with IUser if you prefer
            file?: any;  // Required for Multer (single upload)
            files?: any; // Required for Multer (multiple uploads)
        }
    }
}