import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Skeleton } from './ui/skeleton';
import { TrendingUp, Eye, ChevronRight } from 'lucide-react';
import { API } from '../context/AuthContext';
import ProCard from './ui/ProCard';

const TrendingSidebar: React.FC = () => {
    const { lang, t } = useLanguage();

    const { data: trendingArticles, isLoading } = useQuery({
        queryKey: ['trending-news'],
        queryFn: async () => {
            try {
                const { data } = await API.get('/api/articles?isTrending=true&sort=-views&limit=5');
                const articles = data?.articles || data?.data || [];

                if (articles.length === 0) {
                    const fallback = await API.get('/api/articles?sort=-views&limit=5');
                    return fallback.data?.articles || fallback.data?.data || [];
                }
                return articles;
            } catch (err) {
                console.error("Trending Fetch Error:", err);
                return [];
            }
        },
        staleTime: 1000 * 60 * 10
    });

    return (
        <div className="space-y-8">
            {/* --- SECTION 1: TRENDING LIST --- */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                            <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-base font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
                            {t('Trending News', 'चर्चित समाचार')}
                        </h3>
                    </div>
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <Skeleton className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                                <div className="space-y-2 flex-grow">
                                    <Skeleton className="h-4 w-full bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                        ))
                    ) : trendingArticles && trendingArticles.length > 0 ? (
                        trendingArticles.map((article: any, index: number) => {
                            const title = lang === 'en' ? article.titleEn : article.titleNe;
                            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                            const imageUrl = article.image?.startsWith('http')
                                ? article.image
                                : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

                            return (
                                <Link
                                    key={article._id}
                                    to={`/article/${article.slug}`}
                                    className="flex gap-4 group cursor-pointer items-start"
                                >
                                    <div className="relative shrink-0 h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 ring-2 ring-transparent group-hover:ring-red-600/20 transition-all">
                                        <img
                                            src={imageUrl}
                                            alt={title}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200')}
                                        />
                                        <div className="absolute top-0 left-0 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-br-lg">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 flex-grow">
                                        <h4 className="text-[13px] font-bold leading-tight text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors line-clamp-2">
                                            {title}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <Eye className="h-3 w-3 text-red-600/50" />
                                                <span>{article.views || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl font-black text-slate-400 text-[10px] uppercase tracking-widest">
                            {t('No stories found', 'समाचार फेला परेन')}
                        </div>
                    )}
                </div>
            </div>

            {/* --- SECTION 2: PRO UPGRADE TEASER --- */}
            {/* 🚀 Added 'z-50' and 'pointer-events-auto' to ensure the button is clickable */}
            <div className="sticky top-24 z-50 pointer-events-auto">
                <ProCard />
            </div>
        </div>
    );
};

export default TrendingSidebar;