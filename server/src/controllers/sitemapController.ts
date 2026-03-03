// server/controllers/sitemapController.ts
import Article from '../models/Article';

export const generateSitemap = async (req: any, res: any) => {
    try {
        const articles = await Article.find({}).select('slug updatedAt');
        const baseUrl = 'https://khabarpoint.com'; // Replace with your actual domain later

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${baseUrl}</loc>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>
            ${articles.map(article => `
                <url>
                    <loc>${baseUrl}/article/${article.slug}</loc>
                    <lastmod>${article.updatedAt.toISOString().split('T')[0]}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>
            `).join('')}
        </urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(sitemap);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
};