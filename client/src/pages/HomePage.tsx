import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { API } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Hero from './frontend/Hero';
import NewsSection from './frontend/NewsSection';
import AdBanner from '../components/public/AdBanner';

const HomePage: React.FC = () => {
    const { lang } = useLanguage();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const { data: articles, isLoading } = useQuery({
        queryKey: ['articles'],
        queryFn: async () => {
            const { data } = await API.get('/api/articles?limit=10');
            return data.articles || data.data || [];
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-10">
                <Skeleton className="h-[400px] w-full rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[300px] rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-20 transition-colors duration-300">
            {/* Top Leaderboard Ad */}
            <AdBanner position="top-leaderboard" className="mx-auto" />


            <div className="container mx-auto px-4 sm:px-6 lg:px-8"></div>
            {/* Featured Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
                        {lang === 'en' ? 'Featured Stories' : 'मुख्य समाचार'}
                    </h2>
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                </div>
                <Hero />
            </section>

            {/* News Categories */}
           /* <NewsSection
                title={lang === 'en' ? 'Politics' : 'राजनीति'}
                categorySlug="politics"
                limit={4}
            />*/

            <AdBanner position="home-middle" />

            <NewsSection
                title={lang === 'en' ? 'Tech & Innovation' : 'प्रविधि'}
                categorySlug="tech"
                limit={4}
            />

            {/* Latest Updates Grid */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                        {lang === 'en' ? 'Latest Updates' : 'ताजा अपडेट'}
                    </h2>
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles?.slice(0, 6).map((article: any) => (
                        <Link key={article._id} to={`/article/${article.slug}`} className="group">
                            <Card className="border-none shadow-none bg-transparent group-hover:bg-slate-50 dark:group-hover:bg-slate-900/50 transition-all p-2 rounded-2xl">
                                <div className="aspect-video overflow-hidden rounded-xl mb-4">
                                    <img
                                        src={article.image?.startsWith('http') ? article.image : `${baseUrl}${article.image}`}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={article.titleEn}
                                    />
                                </div>
                                <CardHeader className="p-0 space-y-2">
                                    <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold border-red-200 text-red-600">
                                        {lang === 'en' ? article.category?.nameEn : article.category?.nameNe}
                                    </Badge>
                                    <CardTitle className="text-xl font-bold line-clamp-2 leading-tight">
                                        {lang === 'en' ? article.titleEn : article.titleNe}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-2 text-sm text-muted-foreground line-clamp-2">
                                    {lang === 'en' ? article.excerptEn : article.excerptNe}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;