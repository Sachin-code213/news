import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { format } from 'date-fns';
import { Calendar, User, Share2, ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Helmet } from 'react-helmet-async';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams();
    const { lang } = useLanguage();

    const { data: article, isLoading, error } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/articles/${id}`);
            return data.data;
        }
    });

    // 🚀 Professional Share Function
    const handleShare = async () => {
        const titleText = lang === 'en' ? article?.titleEn : (article?.titleNe || article?.titleEn);
        const excerptText = lang === 'en' ? article?.excerptEn : (article?.excerptNe || article?.excerptEn);

        const shareData = {
            title: titleText,
            text: excerptText,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(lang === 'en' ? "Link copied to clipboard!" : "लिङ्क प्रतिलिपि गरियो!");
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin text-red-600 h-10 w-10" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Fetching Article...</p>
        </div>
    );

    if (error || !article) return (
        <div className="max-w-4xl mx-auto p-20 text-center">
            <h2 className="text-red-500 font-black text-2xl uppercase">Article Not Found</h2>
            <Link to="/" className="text-slate-500 hover:text-red-600 font-bold mt-4 inline-block underline">Return Home</Link>
        </div>
    );

    // 🚀 DATA LOGIC
    const title = lang === 'en' ? (article.titleEn || article.titleNe) : (article.titleNe || article.titleEn);
    const content = lang === 'en' ? (article.contentEn || article.contentNe) : (article.contentNe || article.contentEn);
    const excerpt = lang === 'en' ? (article.excerptEn || article.excerptNe) : (article.excerptNe || article.excerptEn);

    // 🚀 CRITICAL FIX: Ensure OG Image is an Absolute URL
    // This ensures Facebook/Insta can find the thumbnail
    const siteUrl = "https://khabarpoint.onrender.com"; // Your production URL
    const ogImageUrl = article.image?.startsWith('http')
        ? article.image
        : `${siteUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

    return (
        <div className="w-full overflow-x-hidden bg-white dark:bg-slate-950 transition-colors">
            <Helmet>
                <title>{title} | KhabarPoint</title>
                <meta name="description" content={excerpt} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={excerpt} />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:image:secure_url" content={ogImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={excerpt} />
                <meta name="twitter:image" content={ogImageUrl} />
            </Helmet>

            <article className="max-w-4xl mx-auto px-4 py-6 md:py-12">
                <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-red-600 mb-6 transition-colors group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    {lang === 'en' ? 'Back to Home' : 'गृहपृष्ठ'}
                </Link>

                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                            {lang === 'en' ? (article.category?.nameEn || 'News') : (article.category?.nameNe || 'समाचार')}
                        </span>
                        {article.isBreaking && (
                            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase animate-pulse">
                                {lang === 'en' ? 'Breaking' : 'ताजा खबर'}
                            </span>
                        )}
                    </div>

                    <h1 className={`text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6 ${lang === 'ne' ? 'leading-[1.4]' : 'leading-[1.2]'}`}>
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm border-y py-4 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-red-600" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">{article.author?.name || 'KhabarPoint'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{article.createdAt ? format(new Date(article.createdAt), 'MMM d, yyyy') : 'Recently'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={16} />
                            <span className="capitalize">{lang === 'en' ? article.category?.nameEn : article.category?.nameNe}</span>
                        </div>
                    </div>
                </header>

                {article.image && (
                    <div className="mb-10 rounded-[32px] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 border dark:border-slate-800">
                        <img
                            src={article.image}
                            alt={title}
                            className="w-full h-auto max-h-[600px] object-cover"
                            onError={(e) => (e.currentTarget.src = "/logo-preview.jpg")}
                        />
                    </div>
                )}

                <div
                    className={`
                        prose prose-base md:prose-lg prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight 
                        prose-a:text-red-600 hover:prose-a:text-red-700
                        prose-img:rounded-3xl 
                        ${lang === 'ne' ? 'leading-[2] text-[1.1rem] font-hindi' : 'leading-relaxed'}
                    `}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 KhabarPoint Media Network</p>
                        <Button
                            onClick={handleShare}
                            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest px-10 py-7 rounded-2xl w-full sm:w-auto shadow-xl shadow-red-500/20 transition-all active:scale-95"
                        >
                            <Share2 size={18} /> {lang === 'en' ? 'Share Story' : 'साझा गर्नुहोस्'}
                        </Button>
                    </div>
                </footer>
            </article>
        </div>
    );
};

export default ArticleDetailPage;