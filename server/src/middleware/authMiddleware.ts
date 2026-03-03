import jwt from 'jsonwebtoken';
import User from '../models/User';

// 1. Protection Middleware (Verifies JWT)
export const protect = async (req: any, res: any, next: any) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log("❌ User not found for ID:", decoded.id);
                return res.status(401).json({ message: 'User no longer exists' });
            }

            console.log("✅ Token Verified for:", req.user.name);
            return next();
        } catch (error: any) {
            console.log("❌ JWT Verification Error:", error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log("❌ No Authorization Header found on request to:", req.path);
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// 2. Admin Check Middleware
export const admin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

// 3. Role-based Authorize Check (Flexible)
export const authorize = (...roles: string[]) => {
    return (req: any, res: any, next: any) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`🚫 Access Denied: User role [${req.user?.role}] not in allowed roles [${roles}]`);
            return res.status(403).json({
                success: false,
                message: `User role ${req.user?.role} is not authorized to access this route`
            });
        }
        next();
    };
};