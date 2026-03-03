import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import { Skeleton } from '../components/ui/skeleton';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, Inbox } from 'lucide-react';

const CategoryPage: React.FC = () => {
    const { slug } = useParams(); // This is 'technology', 'politics', etc.
    const { lang, t } = useLanguage();

    const { data: articles, isLoading, isError, refetch } = useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            try {
                // 🚀 FIX: Use VITE_API_URL and the correct query parameter
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${baseUrl}/api/articles?categoryName=${slug}`);

                // 🚀 FIX: Matches 'success: true, articles: [...]' from backend
                return data?.articles || [];
            } catch (err) {
                console.error("Category Fetch Error:", err);
                return [];
            }
        },
        staleTime: 60 * 1000
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 transition-colors duration-300 min-h-screen">
            {/* Header Section */}
            <div className="border-l-4 border-red-600 pl-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                    {slug === 'technology'
                        ? t('Technology News', 'प्रविधि समाचार')
                        : slug === 'politics'
                            ? t('Politics News', 'राजनीति समाचार')
                            : slug === 'sports'
                                ? t('Sports News', 'खेलकुद समाचार')
                                : t(`${slug} News`, `${slug} समाचार`)
                    }
                </h1>
                <p className="text-muted-foreground dark:text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
                    {t(`Latest updates in ${slug}`, `${slug} मा पछिल्लो अपडेटहरू`)}
                </p>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">
                        Error loading category content.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="text-xs font-bold text-red-600 hover:underline"
                    >
                        Retry Connection
                    </button>
                </div>
            )
                : articles && articles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        {articles.map((article: any) => (
                            <ArticleCard key={article._id} article={article} />
                        ))}
                    </div>
                ) : (
                    /* 🚀 FIX: Better empty state when no articles match the slug */
                    <div className="py-32 text-center border-4 border-dotted rounded-3xl border-slate-100 dark:border-slate-800">
                        <div className="max-w-xs mx-auto space-y-4">
                            <Inbox className="h-12 w-12 text-slate-300 mx-auto" />
                            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                                {t("No articles found.", "कुनै समाचार भेटिएन।")}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-600">
                                {t(`Fresh ${slug} news is on its way. Check back soon!`, `${slug} का ताजा समाचारहरू चाँडै आउँदैछन्।`)}
                            </p>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default CategoryPage;