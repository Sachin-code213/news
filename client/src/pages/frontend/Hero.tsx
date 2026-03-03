import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { Zap, Calendar, AlertCircle, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';

const Hero: React.FC = () => {
    const { lang } = useLanguage();

    const { data: featured, isLoading, isError } = useQuery({
        queryKey: ['featured-hero'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${baseUrl}/api/articles?isBreaking=true&limit=1`);
            return data.articles?.[0] || null;
        }
    });

    if (isLoading) return <Skeleton className="w-full h-[500px] lg:h-[600px] rounded-3xl mb-12" />;
    if (isError || !featured) return null;

    // 🔍 DEBUGGING: Check your F12 console to see these values
    console.log("HERO DATA:", {
        title: featured.titleEn,
        type: featured.postType,
        video: featured.videoUrl,
        image: featured.image
    });

    // 🚀 THE FIX: If there is a videoUrl, we TREAT IT as a video, no matter what.
    const hasVideo = Boolean(featured.videoUrl && featured.videoUrl.length > 0);
    const isYouTube = hasVideo && (featured.videoUrl.includes('youtube.com') || featured.videoUrl.includes('youtu.be'));

    const title = lang === 'en' ? featured.titleEn : featured.titleNe;
    const excerpt = lang === 'en' ? featured.excerptEn : featured.excerptNe;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Image logic
    const imageUrl = featured.image?.startsWith('http')
        ? featured.image
        : `${baseUrl}${featured.image?.startsWith('/') ? '' : '/'}${featured.image}`;

    return (
        <section className="relative group overflow-hidden rounded-3xl bg-slate-900 h-[500px] lg:h-[600px] mb-12 shadow-2xl transition-all duration-500">

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
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                )}
            </div>

            {/* 2. VIDEO PLAY OVERLAY (Only shows if hasVideo is true) */}
            {hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-600/90 text-white p-5 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)] transform group-hover:scale-125 transition-all duration-300">
                        <PlayCircle className="h-12 w-12 fill-current" />
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

            {/* 3. Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
                <div className="max-w-3xl space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge className={`${hasVideo ? 'bg-blue-600' : 'bg-red-600'} text-white border-none px-3 py-1 flex items-center gap-1 uppercase font-black`}>
                            {hasVideo ? <PlayCircle className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                            {lang === 'en' ? (hasVideo ? 'Video' : 'Breaking') : (hasVideo ? 'भिडियो' : 'ब्रेकिङ्ग')}
                        </Badge>
                    </div>

                    <Link to={`/article/${featured.slug}`}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight hover:text-red-500 transition-colors line-clamp-3">
                            {title}
                        </h2>
                    </Link>

                    <p className="text-slate-300 text-sm md:text-lg font-medium line-clamp-2 max-w-2xl opacity-90">
                        {excerpt}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;