import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import hpp from 'hpp';
import dns from 'node:dns';
import bcrypt from 'bcryptjs';
import fs from 'fs';

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
    contentSecurityPolicy: false // Required for meta-injection to work correctly with external images
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// --- 3. API ROUTES ---
app.use('/api/seo', seoRoutes);
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

// --- 5. FRONTEND SERVING WITH UNIVERSAL META-INJECTION ---
const clientPath = path.join(__dirname, '../../client/dist');
const indexPath = path.join(clientPath, 'index.html');

/**
 * 🚀 DYNAMIC NEWS INJECTOR
 * Optimized for Facebook, WhatsApp, LinkedIn, and X (Twitter)
 */
app.get('/article/:slug', async (req: Request, res: Response) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });

        // If article doesn't exist, fall back to standard React index
        if (!article) {
            return res.sendFile(indexPath);
        }

        fs.readFile(indexPath, 'utf8', (err, htmlData) => {
            if (err) return res.sendFile(indexPath);

            // 1. Data Preparation
            const title = `${article.titleNe || article.titleEn} | KhabarPoint`;
            const description = (article.summaryNe || article.summaryEn || article.excerptEn || "Stay updated with KhabarPoint").substring(0, 160);

            // 2. Image Optimization (Cloudinary auto-format & social-friendly sizing)
            const imageUrl = article.image?.includes('cloudinary')
                ? article.image.replace('/upload/', '/upload/w_1200,h_630,c_fill,q_auto,f_jpg/')
                : article.image;

            const siteUrl = process.env.CLIENT_URL || 'https://khabarpoint.vercel.app';
            const fullUrl = `${siteUrl}/article/${req.params.slug}`;

            // 3. Dynamic Injection using Global Regex
            // This replaces the placeholder values in your index.html with real news data
            let modifiedHtml = htmlData
                .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
                // Replaces <meta property="og:title" content="..."> etc.
                .replace(/(property="og:title"\s+content=").*?(")/, `$1${title}$2`)
                .replace(/(property="og:description"\s+content=").*?(")/, `$1${description}$2`)
                .replace(/(property="og:image"\s+content=").*?(")/, `$1${imageUrl}$2`)
                .replace(/(property="og:url"\s+content=").*?(")/, `$1${fullUrl}$2`)
                // Replaces <meta property="twitter:title" content="..."> etc.
                .replace(/(property="twitter:title"\s+content=").*?(")/, `$1${title}$2`)
                .replace(/(property="twitter:description"\s+content=").*?(")/, `$1${description}$2`)
                .replace(/(property="twitter:image"\s+content=").*?(")/, `$1${imageUrl}$2`)
                // Replaces standard description
                .replace(/(name="description"\s+content=").*?(")/, `$1${description}$2`);

            return res.send(modifiedHtml);
        });
    } catch (error) {
        console.error("Meta injection error:", error);
        res.sendFile(indexPath);
    }
});

// Serve frontend static files AFTER the dynamic route
app.use(express.static(clientPath));

// Standard Frontend Catch-all
app.get('/*', (req: Request, res: Response) => {
    res.sendFile(indexPath);
});

// --- 6. ERROR HANDLING ---
app.use(errorHandler);
app.get('/*', (req: Request, res: Response) => {
    // If the request is for an API but reached here, it's a 404
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: "API route not found" });
    }
    res.sendFile(indexPath);
});

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