import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Zap } from 'lucide-react';

interface Article {
    _id: string;
    slug: string;
    titleEn: string;
    titleNe: string;
}

const NewsTicker: React.FC = () => {
    const { lang } = useLanguage();

    const { data: news } = useQuery<Article[]>({
        queryKey: ['ticker-news'],
        queryFn: async () => {
            const { data } = await API.get('/api/articles?isBreaking=true&limit=10');
            return data.data || data.articles || [];
        },
        refetchInterval: 60000,
    });

    if (!news || news.length === 0) return null;

    return (
        <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 flex items-center overflow-hidden h-12 relative stop-on-hover">

            {/* 🚩 STATIC LABEL - Higher Z-index ensures text goes UNDER it */}
            <div className="bg-red-600 text-white px-4 h-full flex items-center gap-2 z-50 shadow-xl shrink-0">
                <Zap size={14} className="fill-white animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
                    {lang === 'en' ? 'Breaking News' : 'ताजा समाचार'}
                </span>
            </div>

            {/* 🏃‍♂️ THE FAST TRACK */}
            {/* We use w-[200%] so the animation has 2 pages of content to loop through */}
            <div className="flex w-[200%] shrink-0 animate-ticker-right">

                {/* 🔄 Set 1 */}
                <div className="flex items-center justify-around w-1/2 gap-12 px-6">
                    {news.map((item: Article) => (
                        <Link key={`${item._id}-a`} to={`/article/${item.slug}`} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 whitespace-nowrap">
                            <span className="text-red-600">•</span>
                            {lang === 'en' ? item.titleEn : item.titleNe}
                        </Link>
                    ))}
                </div>

                {/* 🔄 Set 2 (The Loop Filler) */}
                <div className="flex items-center justify-around w-1/2 gap-12 px-6" aria-hidden="true">
                    {news.map((item: Article) => (
                        <Link key={`${item._id}-b`} to={`/article/${item.slug}`} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 whitespace-nowrap">
                            <span className="text-red-600">•</span>
                            {lang === 'en' ? item.titleEn : item.titleNe}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;