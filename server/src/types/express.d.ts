import { IUser } from '../models/User'; // Import your User interface

declare global {
    namespace Express {
        interface Request {
            user?: any; // This tells TypeScript that 'req.user' is valid
        }
    }
}