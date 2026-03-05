import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Zap, PlayCircle, AlertCircle } from 'lucide-react';

const Hero: React.FC = () => {
    const { lang } = useLanguage();
    const [imgError, setImgError] = useState(false);

    const { data: featured, isLoading, isError } = useQuery({
        queryKey: ['featured-hero'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${baseUrl}/api/articles?isBreaking=true&limit=1`);
            return data.articles?.[0] || data.data?.[0] || null; // Support both API formats
        }
    });

    if (isLoading) return <Skeleton className="w-full aspect-[4/5] md:aspect-video rounded-3xl mb-8" />;
    if (isError || !featured) return null;

    const hasVideo = Boolean(featured.videoUrl && featured.videoUrl.length > 0);
    const isYouTube = hasVideo && (featured.videoUrl.includes('youtube.com') || featured.videoUrl.includes('youtu.be'));

    const title = lang === 'en' ? featured.titleEn : featured.titleNe;
    const excerpt = lang === 'en' ? featured.excerptEn : featured.excerptNe;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const imageUrl = featured.image?.startsWith('http')
        ? featured.image
        : `${baseUrl}${featured.image?.startsWith('/') ? '' : '/'}${featured.image}`;

    return (
        /* 📱 ASPECT RATIO FIX: Instead of fixed heights (h-[400px]), 
           using 'aspect' ensures the Hero shrinks perfectly on ALL devices without cutting off. */
        <section className="relative group overflow-hidden rounded-2xl md:rounded-3xl bg-slate-900 aspect-[4/5] md:aspect-[16/7] lg:aspect-[21/9] mb-8 md:mb-12 shadow-2xl w-full border border-slate-200 dark:border-slate-800">

            {/* 1. Background Media */}
            <div className="absolute inset-0 w-full h-full">
                {hasVideo && !isYouTube ? (
                    <video
                        src={featured.videoUrl.startsWith('http') ? featured.videoUrl : `${baseUrl}${featured.videoUrl}`}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <img
                        src={imgError ? 'https://images.unsplash.com/photo-1585829365234-781fcd50c30b?q=80&w=1000' : imageUrl}
                        alt={title}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                )}
            </div>

            {/* 2. VIDEO PLAY OVERLAY */}
            {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-red-600/90 text-white p-4 md:p-6 rounded-full shadow-2xl backdrop-blur-sm transform group-hover:scale-110 transition-all duration-500">
                        <PlayCircle className="h-8 w-8 md:h-14 md:w-14 fill-current" />
                    </div>
                </div>
            )}

            {/* Professional Gradient: Darker at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

            {/* 3. Content Area */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white z-20">
                <div className="max-w-4xl space-y-3 md:space-y-5">
                    <div className="flex items-center gap-3">
                        <Badge className={`${hasVideo ? 'bg-blue-600' : 'bg-red-600'} text-white border-none px-3 py-1 flex items-center gap-2 uppercase font-black text-[10px] md:text-xs tracking-widest`}>
                            {hasVideo ? <PlayCircle size={14} /> : <Zap size={14} className="fill-white" />}
                            {lang === 'en' ? (hasVideo ? 'Watch Now' : 'Breaking News') : (hasVideo ? 'भिडियो' : 'ताजा समाचार')}
                        </Badge>
                    </div>

                    <Link to={`/article/${featured.slug}`} className="block">
                        {/* 📱 TEXT FIX: Clamping and Responsive Sizing */}
                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-black leading-[1.1] hover:text-red-500 transition-colors line-clamp-3 md:line-clamp-2 drop-shadow-lg">
                            {title}
                        </h2>
                    </Link>

                    {/* Excerpt: Hidden on small mobile to prevent overlap */}
                    <p className="hidden sm:line-clamp-2 md:line-clamp-3 text-slate-200 text-sm md:text-lg font-medium max-w-2xl opacity-80 leading-relaxed">
                        {excerpt}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;