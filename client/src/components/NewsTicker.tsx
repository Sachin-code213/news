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
        /* 📱 MAIN CONTAINER: overflow-hidden and w-full are mandatory to stop page cutoff */
        <div className="bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800 flex items-center overflow-hidden h-10 md:h-12 relative w-full group">

            {/* 🚩 STATIC LABEL: Stays fixed while text rolls behind it */}
            <div className="bg-red-600 text-white px-3 md:px-5 h-full flex items-center gap-2 z-30 shadow-[10px_0_15px_rgba(0,0,0,0.1)] shrink-0">
                <Zap size={14} className="fill-white animate-pulse" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">
                    {lang === 'en' ? 'Breaking News' : 'ताजा समाचार'}
                </span>
            </div>

            {/* 🏃‍♂️ THE TRACK: Uses 'flex-nowrap' and 'w-max' to ensure no overlapping */}
            <div className="flex flex-nowrap w-max animate-ticker-right group-hover:[animation-play-state:paused] h-full items-center">

                {/* 🔄 Render Function to ensure exact duplication for the infinite loop */}
                {[1, 2].map((loop) => (
                    <div key={loop} className="flex items-center shrink-0 gap-8 md:gap-16 px-4 md:px-8">
                        {news.map((item: Article) => (
                            <Link
                                key={`${item._id}-${loop}`}
                                to={`/article/${item.slug}`}
                                className="flex items-center gap-3 text-[11px] md:text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-red-600 transition-colors whitespace-nowrap shrink-0"
                            >
                                <span className="text-red-600 text-lg">•</span>
                                {lang === 'en' ? item.titleEn : item.titleNe}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsTicker;