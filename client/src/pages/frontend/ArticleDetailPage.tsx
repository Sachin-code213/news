import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { format } from 'date-fns';
import { Calendar, User, Tag, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
const ArticleDetailPage: React.FC = () => {
    const { id } = useParams();
    const { lang } = useLanguage();

    // 1. Fetch Article Data
    const { data: article, isLoading, error } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/articles/${id}`);
            return data.data;
        }
    });

    if (isLoading) return <div className="max-w-4xl mx-auto p-10 text-center animate-pulse font-bold">Loading Story...</div>;
    if (error || !article) return <div className="max-w-4xl mx-auto p-10 text-center text-red-500">Article not found.</div>;

    // Determine which language content to show
    const title = lang === 'en' ? article.titleEn : article.titleNe;
    const content = lang === 'en' ? article.contentEn : article.contentNe;

    return (
        <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Back to Home */}
            <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-red-600 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                {lang === 'en' ? 'Back to News' : 'समाचारमा फर्कनुहोस्'}
            </Link>

            {/* Header Section */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                        {article.category?.nameEn || 'News'}
                    </span>
                    {article.isBreaking && (
                        <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase animate-pulse">
                            Breaking
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                    {title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-y py-4 border-slate-100">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-red-600" />
                        <span className="font-bold text-slate-700">{article.author?.name || 'KhabarPoint Team'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{format(new Date(article.createdAt), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span className="capitalize">{article.category?.nameEn}</span>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {article.image && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
                    <img
                        src={article.image}
                        alt={title}
                        className="w-full h-auto max-h-[500px] object-cover"
                    />
                </div>
            )}

            {/* News Content (Tiptap Render) */}
            <div
                className="prose prose-lg prose-slate max-w-none 
                prose-headings:font-black prose-headings:tracking-tight 
                prose-a:text-red-600 hover:prose-a:text-red-700
                prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Footer Actions */}
            <footer className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-400 font-medium">© 2026 KhabarPoint Media Network</p>
                    <Button variant="outline" className="flex items-center gap-2 font-bold">
                        <Share2 size={16} /> Share Story
                    </Button>
                </div>
            </footer>
        </article>
    );
};

export default ArticleDetailPage;