import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { API } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
    const { slug } = useParams();
    const { lang, t } = useLanguage();

    const { data: article, isLoading } = useQuery({
        queryKey: ['article', slug],
        queryFn: async () => {
            const { data } = await API.get(`/api/articles/slug/${slug}`);
            return data.data;
        }
    });

    // 🚀 1. SMART CONTENT FALLBACK & SANITIZATION
    const { title, content } = useMemo(() => {
        if (!article) return { title: '', content: '' };

        // Helper to check if string is truly empty or just HTML noise
        const isActuallyEmpty = (str: string | undefined) => {
            if (!str) return true;
            return str.replace(/<[^>]*>?/gm, '').trim().length === 0;
        };

        // Determine title based on language presence
        const activeTitle = lang === 'en'
            ? (article.titleEn || article.titleNe)
            : (article.titleNe || article.titleEn);

        // Determine content body based on language presence
        const rawContent = lang === 'en'
            ? (isActuallyEmpty(article.contentEn) ? article.contentNe : article.contentEn)
            : (isActuallyEmpty(article.contentNe) ? article.contentEn : article.contentNe);

        return {
            title: activeTitle,
            content: DOMPurify.sanitize(rawContent || '', {
                USE_PROFILES: { html: true },
                ADD_ATTR: ['target', 'rel']
            })
        };
    }, [article, lang]);

    // Update Browser Tab Title
    useEffect(() => {
        if (title) {
            document.title = `${title} | KhabarPoint`;
        }
    }, [title]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Loading KhabarPoint News...</p>
        </div>
    );

    if (!article) return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <p className="text-slate-500 font-bold uppercase tracking-widest">Article Not Found</p>
            <Link to="/" className="text-red-600 font-black text-xs uppercase hover:underline">Return Home</Link>
        </div>
    );

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const imageUrl = article.image?.startsWith('http')
        ? article.image
        : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

    return (
        <article className="max-w-4xl mx-auto p-4 md:py-12 dark:bg-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* 🚀 Category Badge & Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <Link
                    to={`/category/${article.category?.slug || 'national'}`}
                    className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-black transition-colors"
                >
                    {lang === 'en'
                        ? (article.category?.nameEn || 'Politics')
                        : (article.category?.nameNe || 'राजनीति')}
                </Link>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={14} className="text-red-600" />
                    {new Date(article.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ne-NP')}
                </div>
            </div>

            {/* 🚀 Title with Nepali Line-Height Adjustment */}
            <h1 className={`text-3xl md:text-5xl font-black mb-8 tracking-tighter ${lang === 'ne' ? 'leading-[1.3]' : 'leading-[1.1]'}`}>
                {title}
            </h1>

            <div className="relative group overflow-hidden rounded-[32px] mb-10 shadow-2xl">
                <img
                    src={imageUrl}
                    alt={article.titleEn}
                    onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000")}
                    className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* 🚀 Content Area with Typography Fixes */}
            <div
                className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tighter 
                prose-img:rounded-3xl prose-a:text-red-600
                ${lang === 'ne'
                        ? 'font-sans leading-[1.8] text-[1.15rem] prose-p:text-slate-800 dark:prose-p:text-slate-200'
                        : 'prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300'}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="mt-16 pt-8 border-t dark:border-slate-800">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                >
                    <ChevronLeft size={16} /> {lang === 'en' ? 'Go Back' : 'पछाडि जानुहोस्'}
                </button>
            </div>
        </article>
    );
};

export default ArticleDetail;