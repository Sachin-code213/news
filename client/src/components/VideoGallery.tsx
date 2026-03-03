import React from 'react';
import ArticleCard from './ArticleCard';
import { Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoGalleryProps {
    articles: any[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ articles }) => {
    // Filter only video content and take the latest 4
    const videoArticles = articles.filter(a => a.type === 'video').slice(0, 4);

    if (videoArticles.length === 0) return null;

    return (
        <section className="my-12 px-4 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-600/20">
                        <Play size={20} className="text-white fill-current" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white leading-none">
                            Video News
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Multimedia Highlights
                        </p>
                    </div>
                </div>

                <Link to="/videos" className="group flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">
                    View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Video Grid/Scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {videoArticles.map((article) => (
                    <div key={article._id} className="transform hover:-translate-y-1 transition-transform duration-300">
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>

            {/* Modern Divider */}
            <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
        </section>
    );
};

export default VideoGallery;