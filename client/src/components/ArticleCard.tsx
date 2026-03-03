import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, ArrowRight, Play } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleCardProps {
    article: any;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const title = lang === 'en' ? article.titleEn : article.titleNe;
    const excerpt = lang === 'en' ? article.excerptEn : article.excerptNe;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // 🚀 THE FIX: Smart Image URL Logic
    // Checks if the image is a full URL (YouTube) or a local path (/uploads)
    const imageUrl = article.image && (article.image.startsWith('http://') || article.image.startsWith('https://'))
        ? article.image
        : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

    // 🚀 Action Handler: Redirect to YouTube for videos, or Internal Page for news
    const handleAction = (e: React.MouseEvent) => {
        if (article.type === 'video' && article.videoUrl) {
            e.preventDefault();
            window.open(article.videoUrl, '_blank', 'noopener,noreferrer');
        } else {
            // Support both slug (SEO) and _id (Fallback)
            const target = article.slug || article._id;
            navigate(`/article/${target}`);
        }
    };

    const renderCategory = () => {
        if (typeof article.category === 'object' && article.category !== null) {
            return lang === 'en' ? article.category.nameEn : article.category.nameNe;
        }

        if (typeof article.category === 'string') {
            const catMap: Record<string, { en: string, ne: string }> = {
                politics: { en: 'Politics', ne: 'राजनीति' },
                nepal: { en: 'Nepal', ne: 'नेपाल' },
                tech: { en: 'Tech', ne: 'प्रविधि' },
                business: { en: 'Business', ne: 'व्यापार' },
                sports: { en: 'Sports', ne: 'खेलकुद' },
                entertainment: { en: 'Entertainment', ne: 'मनोरञ्जन' }
            };

            const found = catMap[article.category.toLowerCase()];
            return found ? (lang === 'en' ? found.en : found.ne) : article.category;
        }

        return lang === 'en' ? 'News' : 'समाचार';
    };

    return (
        <div
            onClick={handleAction}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden block bg-slate-200 dark:bg-slate-800">
                <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600'}
                    alt={title}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // 🚀 FALLBACK: If YouTube HD (maxres) fails, try Standard HD (hqdefault)
                        if (target.src.includes('maxresdefault')) {
                            target.src = target.src.replace('maxresdefault', 'hqdefault');
                        } else {
                            target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';
                        }
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* 🎥 Video Play Overlay (Only shows if type is video) */}
                {article.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                        <div className="bg-red-600 text-white p-3 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform">
                            <Play size={24} fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded shadow-lg">
                        {renderCategory()}
                    </span>
                    {article.type === 'video' && (
                        <span className="bg-black/80 text-white text-[10px] font-black px-2 py-1 uppercase rounded backdrop-blur-sm">
                            Video
                        </span>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.createdAt ? format(new Date(article.createdAt), 'MMM dd, yyyy') : 'Recently'}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author?.name || 'Admin'}
                    </div>
                </div>

                <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2">
                    {title}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {excerpt}
                </p>

                <div className="pt-4 mt-auto">
                    <div className="text-red-600 dark:text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        {article.type === 'video' ? (
                            <>{lang === 'en' ? 'Watch Now' : 'अहिले हेर्नुहोस्'} <ArrowRight className="h-3 w-3" /></>
                        ) : (
                            <>{lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ArrowRight className="h-3 w-3" /></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;