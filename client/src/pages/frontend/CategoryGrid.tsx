import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Skeleton } from '../../components/ui/skeleton';
import { ChevronRight, Newspaper } from 'lucide-react';

const CategorySection = ({ titleEn, titleNe, categorySlug }: { titleEn: string, titleNe: string, categorySlug: string }) => {
    const { lang } = useLanguage();

    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['category-section', categorySlug],
        queryFn: async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                // 🚀 Added 't' param to bypass any aggressive edge caching
                const { data } = await axios.get(`${baseUrl}/api/articles?categoryName=${categorySlug}&limit=2&t=${Date.now()}`);

                return data.articles || data.data || [];
            } catch (err) {
                console.error(`Error fetching ${categorySlug}:`, err);
                return [];
            }
        },
        staleTime: 30000 // Refetch every 30 seconds if user stays on home
    });

    return (
        <div className="space-y-5 group/section">
            <div className="flex justify-between items-end border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                        {lang === 'en' ? titleEn : titleNe}
                    </h3>
                    <div className="h-1 w-12 bg-red-600 rounded-full transition-all group-hover/section:w-20" />
                </div>
                <Link to={`/category/${categorySlug}`} className="text-red-600 font-bold text-[10px] tracking-widest flex items-center hover:gap-2 transition-all uppercase">
                    {lang === 'en' ? 'Explore' : 'थप हेर्नुहोस्'} <ChevronRight size={12} />
                </Link>
            </div>

            {isLoading ? (
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-40 w-full rounded-2xl dark:bg-slate-800" />
                            <Skeleton className="h-5 w-5/6 dark:bg-slate-800" />
                        </div>
                    ))}
                </div>
            ) : articles.length > 0 ? (
                <div className="space-y-8">
                    {articles.map((article: any) => {
                        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const imageUrl = article.image?.startsWith('http')
                            ? article.image
                            : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

                        return (
                            <Link
                                key={article._id}
                                // 🚀 Routing by _id or slug (ensure this matches your App.tsx route)
                                to={`/article/${article._id}`}
                                className="group block space-y-3"
                            >
                                <div className="relative h-44 overflow-hidden rounded-[24px] bg-slate-100 dark:bg-slate-900 shadow-sm group-hover:shadow-xl group-hover:shadow-red-500/10 transition-all duration-500">
                                    <img
                                        src={imageUrl}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={article.titleEn}
                                        onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500')}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 leading-[1.3] group-hover:text-red-600 transition-colors line-clamp-2 text-lg tracking-tight">
                                    {lang === 'en' ? article.titleEn : article.titleNe}
                                </h4>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-400 gap-3 bg-slate-50/50 dark:bg-transparent">
                    <Newspaper size={24} className="opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {lang === 'en' ? 'No News Available' : 'कुनै समाचार उपलब्ध छैन'}
                    </span>
                </div>
            )}
        </div>
    );
};

const CategoryGrid: React.FC = () => {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                <CategorySection titleEn="Politics" titleNe="राजनीति" categorySlug="politics" />
                <CategorySection titleEn="Technology" titleNe="प्रविधि" categorySlug="technology" />
                <CategorySection titleEn="Sports" titleNe="खेलकुद" categorySlug="sports" />
            </div>
        </section>
    );
};

export default CategoryGrid;