import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { LiveBadge } from '../components/ui/LiveBadge';
import { Calendar, User, Facebook, Twitter, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ArticlePage: React.FC = () => {
    const { slug } = useParams();
    const { lang, t } = useLanguage();

    // 🚀 1. VIEW TRACKER LOGIC (Maintained)
    useEffect(() => {
        const incrementView = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                await axios.patch(`${baseUrl}/api/articles/view/${slug}`);
            } catch (err) {
                console.error("View tracking failed:", err);
            }
        };

        if (slug) {
            incrementView();
        }
    }, [slug]);

    const { data: article, isLoading, isError } = useQuery({
        queryKey: ['article', slug],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${baseUrl}/api/articles/slug/${slug}`);
            return data.data;
        },
        enabled: !!slug,
    });

    // 🚀 2. SMART CONTENT MAPPING (Fixed for Nepali visibility)
    // We check if the field is strictly empty or just contains "empty" HTML tags
    const title = lang === 'en'
        ? (article?.titleEn || article?.titleNe)
        : (article?.titleNe || article?.titleEn);

    const rawContent = lang === 'en'
        ? (article?.contentEn || article?.contentNe)
        : (article?.contentNe || article?.contentEn);

    const excerpt = lang === 'en'
        ? (article?.excerptEn || article?.excerptNe)
        : (article?.excerptNe || article?.excerptEn);

    // 🚀 3. SECURE SANITIZATION (Fixed for Unicode/Nepali strings)
    const sanitizedContent = useMemo(() => {
        if (!rawContent) return '';

        // Clean up "ghost" tags from editors (like <p><br></p>) before sanitizing
        const checkEmpty = rawContent.replace(/<[^>]*>?/gm, '').trim();
        if (checkEmpty.length === 0 && lang === 'ne' && article?.contentEn) {
            return DOMPurify.sanitize(article.contentEn);
        }

        return DOMPurify.sanitize(rawContent, {
            USE_PROFILES: { html: true },
            ADD_ATTR: ['target', 'rel']
        });
    }, [rawContent, lang, article]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Fetching News...</p>
            </div>
        );
    }

    if (isError || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold dark:text-white">News Not Found</h2>
                <p className="text-slate-500 mt-2 mb-6 italic">This article might have been moved or deleted.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.href = '/'} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-full font-bold hover:bg-slate-300 transition-all">Home</button>
                    <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-all shadow-lg">Retry</button>
                </div>
            </div>
        );
    }

    const shareUrl = window.location.href;
    const shareOnFB = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    const shareOnTW = () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`, '_blank');
    const shareOnWA = () => window.open(`https://wa.me/?text=${title} ${shareUrl}`, '_blank');

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const imageUrl = article.image?.startsWith('http')
        ? article.image
        : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

    return (
        <article className="max-w-4xl mx-auto px-4 py-10 space-y-8 pb-24 dark:bg-slate-900 transition-colors duration-300">
            <Helmet>
                <title>{title} | KhabarPoint</title>
                <meta name="description" content={excerpt} />
                <meta property="og:title" content={title} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:description" content={excerpt} />
            </Helmet>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase rounded tracking-widest">
                        {typeof article.category === 'object'
                            ? (lang === 'en' ? article.category.nameEn : article.category.nameNe)
                            : article.category}
                    </span>
                    {article.isLive && <LiveBadge />}
                </div>

                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white ${lang === 'ne' ? 'leading-[1.2]' : 'leading-tight'}`}>
                    {title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-red-600" />
                            <span>{article.author?.name || 'KhabarPoint Admin'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>{format(new Date(article.createdAt), 'MMMM dd, yyyy')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={shareOnFB} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-blue-600 transition-colors"><Facebook className="h-4 w-4" /></button>
                        <button onClick={shareOnTW} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 text-sky-500 transition-colors"><Twitter className="h-4 w-4" /></button>
                        <button onClick={shareOnWA} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-green-100 text-green-600 transition-colors"><MessageCircle className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>

            <figure className="relative">
                <img
                    src={imageUrl}
                    alt={title}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000' }}
                    className="w-full rounded-2xl shadow-2xl object-cover max-h-[500px] bg-slate-200 dark:bg-slate-800"
                />
                {article.isBreaking && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 font-black text-xs uppercase italic shadow-lg">Breaking News</div>
                )}
            </figure>

            {/* 🚀 4. TYPOGRAPHY FIX: Enhanced for Nepali Unicode scripts */}
            <div
                className={`prose prose-lg md:prose-xl max-w-none text-slate-800 dark:text-slate-200
                           prose-headings:font-sans prose-headings:font-black prose-a:text-red-600 prose-strong:dark:text-white
                           ${lang === 'ne' ? 'font-sans leading-[1.8] text-[1.1rem]' : 'font-serif leading-relaxed'}`}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl text-center space-y-4">
                <h3 className="font-bold text-lg dark:text-white">
                    {lang === 'en' ? 'Share this story' : 'यो समाचार सेयर गर्नुहोस्'}
                </h3>
                <div className="flex justify-center gap-4">
                    <button onClick={shareOnFB} className="flex items-center gap-2 bg-white dark:bg-slate-700 px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all font-bold text-sm dark:text-white">
                        <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                    </button>
                    <button onClick={shareOnWA} className="flex items-center gap-2 bg-white dark:bg-slate-700 px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all font-bold text-sm dark:text-white">
                        <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ArticlePage;