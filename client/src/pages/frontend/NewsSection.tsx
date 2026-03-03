import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { API } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface NewsSectionProps {
    title: string;
    categorySlug: string;
    limit?: number;
    variant?: 'list' | 'grid';
}

const NewsSection: React.FC<NewsSectionProps> = ({ title, categorySlug, limit = 4, variant = 'grid' }) => {
    const { lang } = useLanguage();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const { data: articles, isLoading } = useQuery({
        queryKey: ['articles', categorySlug],
        queryFn: async () => {
            // 🚀 Uses the categoryName param established in your articleController
            const { data } = await API.get(`/api/articles?categoryName=${categorySlug}&limit=${limit}`);
            return data.articles || [];
        }
    });

    if (isLoading) return <div className="h-64 flex items-center justify-center animate-pulse bg-slate-50 dark:bg-slate-900/50 rounded-3xl">Loading {title}...</div>;

    if (!articles || articles.length === 0) return null; // 🚀 Hides section if no news uploaded yet

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-end border-b-2 border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white border-b-4 border-red-600 pb-2 -mb-[10px]">
                    {title}
                </h3>
                <Link to={`/category/${categorySlug}`} className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1 hover:gap-2 transition-all">
                    {lang === 'en' ? 'View All' : 'सबै हेर्नुहोस्'} <ArrowRight size={12} />
                </Link>
            </div>

            <div className={variant === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                {articles.map((article: any) => {
                    const imageUrl = article.image?.startsWith('http')
                        ? article.image
                        : `${baseUrl}${article.image}`;

                    return (
                        <Link key={article._id} to={`/article/${article.slug}`} className="group flex flex-col sm:flex-row gap-4">
                            <div className="relative overflow-hidden rounded-2xl aspect-video sm:w-48 flex-shrink-0">
                                <img
                                    src={imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400')}
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                                        {categorySlug}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                                    {lang === 'en' ? article.titleEn : article.titleNe}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {lang === 'en' ? article.excerptEn : article.excerptNe}
                                </p>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span className="flex items-center gap-1"><User size={10} className="text-red-600" /> {article.author?.name || 'Admin'}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {format(new Date(article.createdAt), 'MMM dd')}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default NewsSection;