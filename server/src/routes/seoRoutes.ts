import express from 'express';
import { getSitemap, getRSS, getRobots } from '../controllers/seoController';

const router = express.Router();

router.get('/sitemap.xml', getSitemap);
router.get('/feed.xml', getRSS);
router.get('/robots.txt', getRobots);

export default router;
