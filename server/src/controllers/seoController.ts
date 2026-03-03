import { Request, Response } from 'express';
import Article from '../models/Article';

// @desc    Get Sitemap XML
// @route   GET /sitemap.xml
export const getSitemap = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find({ status: 'published' }).select('slug updatedAt');
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    ${articles
                .map(
                    (article) => `
    <url>
        <loc>${baseUrl}/article/${article.slug}</loc>
        <lastmod>${article.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
                )
                .join('')}
</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        res.status(500).end();
    }
};

// @desc    Get RSS Feed
// @route   GET /feed.xml
export const getRSS = async (req: Request, res: Response) => {
    try {
        const articles = await Article.find({ status: 'published' })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('author', 'name');

        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>Nepali News</title>
    <link>${baseUrl}</link>
    <description>Latest news from Nepal</description>
    <language>en</language>
    ${articles
                .map(
                    (article: any) => `
    <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/article/${article.slug}</link>
        <description><![CDATA[${article.excerpt}]]></description>
        <author>${article.author?.name}</author>
        <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
    </item>`
                )
                .join('')}
</channel>
</rss>`;

        res.header('Content-Type', 'application/xml');
        res.send(rss);
    } catch (error) {
        res.status(500).end();
    }
};

// @desc    Get Robots.txt
// @route   GET /robots.txt
export const getRobots = (req: Request, res: Response) => {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const robots = `User-agent: *
Disallow: /admin/
Sitemap: ${baseUrl}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
};
