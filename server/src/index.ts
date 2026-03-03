import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import hpp from 'hpp';
import dns from 'node:dns';
import bcrypt from 'bcryptjs';

// Models & Config
import './models/Category';
import './models/Article';
import User from './models/User';
import Category from './models/Category';
import Article from './models/Article';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

// Routes
import articleRoutes from './routes/articleRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import authRoutes from './routes/authRoutes';
import adRoutes from './routes/adRoutes';
import categoryRoutes from './routes/categoryRoutes';
import mediaRoutes from './routes/mediaRoutes';
import userRoutes from './routes/userRoutes';
import settingsRoutes from './routes/settingsRoutes';
import newsletterRoutes from './routes/newsletterRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import seoRoutes from './routes/seoRoutes';
import electionRoutes from './routes/electionRoutes';

dotenv.config();

// Fix for Node 22 DNS issues sometimes seen on cloud providers
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app: Express = express();
const PORT = process.env.PORT || 10000;

// --- 1. GLOBAL MIDDLEWARE ---

const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 🧼 NoSQL Injection Protection
app.use((req: Request, res: Response, next: NextFunction) => {
    const clean = (obj: any) => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (key.startsWith('$')) delete obj[key];
                else clean(obj[key]);
            }
        }
        return obj;
    };
    if (req.body) clean(req.body);
    if (req.query) clean(req.query);
    next();
});

// --- 2. STATIC ASSETS ---
// Use path.join for cross-platform compatibility
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// --- 3. API ROUTES ---
app.use('/api/seo', seoRoutes); // Added prefix for clarity
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/election', electionRoutes);

// --- 4. SECURE SEED ROUTE ---
app.get('/api/seed-categories-securely', async (req: Request, res: Response) => {
    const seedKey = req.query.key;
    if (process.env.NODE_ENV === 'production' && seedKey !== process.env.ADMIN_SEED_KEY) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    try {
        await Article.deleteMany({});
        await Category.deleteMany({});
        await User.deleteMany({ email: 'admin@khabarpoint.com' });

        const categories = [
            { nameEn: 'Nepal', nameNe: 'नेपाल', slug: 'nepal' },
            { nameEn: 'Politics', nameNe: 'राजनीति', slug: 'politics' },
            { nameEn: 'Business', nameNe: 'व्यापार', slug: 'business' },
            { nameEn: 'Tech', nameNe: 'प्रविधि', slug: 'tech' },
            { nameEn: 'Sports', nameNe: 'खेलकुद', slug: 'sports' },
            { nameEn: 'Entertainment', nameNe: 'मनोरञ्जन', slug: 'entertainment' }
        ];
        await Category.insertMany(categories);

        const hashedPassword = await bcrypt.hash('1000021133', 10);
        await User.create({
            name: 'System Admin',
            email: 'admin@khabarpoint.com',
            password: hashedPassword,
            role: 'admin'
        });

        res.json({ success: true, message: "✅ Database Cleared & Admin Created!" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- 5. FRONTEND SERVING ---
const clientPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientPath));

app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientPath, 'index.html'), (err) => {
            if (err) res.status(404).send('Frontend not built or index.html missing');
        });
    }
});

// --- 6. ERROR HANDLING ---
app.use(errorHandler);

// --- 7. SERVER INITIALIZATION ---
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();