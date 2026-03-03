import { Request, Response } from 'express';
import Article from '../models/Article';
import User from '../models/User';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Parallel execution for high performance
        const [totalArticles, totalUsers, viewStats, activeBreaking] = await Promise.all([
            Article.countDocuments(),
            User.countDocuments(),
            Article.aggregate([
                { $group: { _id: null, totalViews: { $sum: "$views" } } }
            ]),
            Article.countDocuments({ isBreaking: true })
        ]);

        // 2. Format Chart Data
        // Initializing with names that match the 'dataKey' in your Frontend LineChart
        const chartData = [
            { name: 'Sun', views: 0 },
            { name: 'Mon', views: 0 },
            { name: 'Tue', views: 0 },
            { name: 'Wed', views: 0 },
            { name: 'Thu', views: 0 },
            { name: 'Fri', views: 0 },
            { name: 'Sat', views: 0 },
        ];

        const totalViewsCount = viewStats[0]?.totalViews || 0;

        // 3. Simple Mock Logic for Visuals
        // Distributes views slightly so the chart isn't just a flat line at 0
        const todayIndex = new Date().getDay();
        chartData[todayIndex].views = totalViewsCount;

        // Optional: Fill yesterday with a percentage of total views for a better looking curve
        const yesterdayIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        chartData[yesterdayIndex].views = Math.floor(totalViewsCount * 0.8);

        // 4. Send standardized response
        res.status(200).json({
            success: true,
            data: {
                totalArticles,
                totalUsers,
                totalViews: totalViewsCount,
                activeBreaking,
                activeAds: 0, // Placeholder
                chartData: chartData
            }
        });
    } catch (error: any) {
        console.error("🔥 Analytics Controller Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics: " + error.message
        });
    }
};