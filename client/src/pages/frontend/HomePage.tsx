import React from 'react';
import Hero from '../frontend/Hero';
import TrendingSidebar from '../../components/TrendingSidebar';
import CategoryGrid from '../frontend/CategoryGrid';
import AdBanner from '../../components/public/AdBanner';
import { useLanguage } from '../../context/LanguageContext';
import NewsSection from '../frontend/NewsSection';
import VideoGallery from '../../components/VideoGallery';
import ElectionTally from '../../components/election/ElectionTally';
import { useQuery } from '@tanstack/react-query';
import { API, useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';

const HomePage: React.FC = () => {
    const { lang } = useLanguage();
    const { user } = useAuth();

    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await API.get('/api/settings');
            return res.data?.data;
        }
    });

    const { data: electionData = [] } = useQuery({
        queryKey: ['election-results'],
        queryFn: async () => {
            const res = await API.get('/api/election/results');
            return res.data?.data || [];
        },
        refetchInterval: 30000
    });

    const { data: articles = [] } = useQuery({
        queryKey: ['home-articles-list'],
        queryFn: async () => {
            const res = await API.get('/api/articles?limit=20');
            return res.data?.data || [];
        }
    });

    const handleProUpgrade = async () => {
        if (!user) return toast.error(lang === 'en' ? "Login Required" : "लगइन आवश्यक छ");
        try {
            await API.post('/api/settings/pro-interest');
            toast.success(lang === 'en' ? "Added to Waitlist!" : "प्रतीक्षा सूचीमा थपियो!");
        } catch (err) {
            toast.error(lang === 'en' ? "Something went wrong" : "केही गलत भयो");
        }
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <div className="space-y-6 md:space-y-10 pb-20">

                {/* 1. TOP AD - Professional Leaderboard */}
                <div className="container mx-auto px-4 pt-4">
                    <div className="w-full flex justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl py-2">
                        <AdBanner position="top-leaderboard" className="max-w-full h-auto" />
                    </div>
                </div>

                {/* 🇳🇵 2. Election Tally */}
                {!settingsLoading && settings?.showElectionTally && electionData.length > 0 && (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <ElectionTally
                            candidates={electionData}
                            title={settings.electionTitle || (lang === 'en' ? 'Live Count' : 'प्रत्यक्ष गणना')}
                        />
                    </div>
                )}

                <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12 items-start">

                        {/* LEFT: Main Content */}
                        <div className="lg:col-span-3 space-y-12 md:space-y-20">
                            <section className="space-y-6">
                                <Hero />
                            </section>

                            <NewsSection title={lang === 'en' ? 'Politics' : 'राजनीति'} categorySlug="politics" limit={4} />

                            <VideoGallery articles={articles} />

                            <div className="flex justify-center w-full py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                                <AdBanner position="home-middle" className="max-w-full h-auto" />
                            </div>

                            <NewsSection title={lang === 'en' ? 'Tech' : 'प्रविधि'} categorySlug="tech" limit={4} variant="grid" />

                            <CategoryGrid />
                        </div>

                        {/* RIGHT: Sidebar */}
                        <aside className="lg:col-span-1 space-y-8 w-full">

                            {/* Trending Section */}
                            <TrendingSidebar />

                            {/* 🚀 PRO WAITLIST CARD */}
                            <section className="relative overflow-hidden p-6 bg-slate-900 dark:bg-amber-500 rounded-3xl shadow-xl">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-2 text-amber-500 dark:text-slate-900">
                                        <Sparkles size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white dark:text-slate-950 leading-tight">
                                        {lang === 'en' ? 'KhabarPoint Pro' : 'खबरप्वाइन्ट प्रो'}
                                    </h3>
                                    <button
                                        onClick={handleProUpgrade}
                                        className="w-full py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl font-black text-xs uppercase tracking-tighter hover:scale-[1.02] transition-transform"
                                    >
                                        {lang === 'en' ? 'Join Waitlist' : 'सूचीमा सामेल हुनुहोस्'}
                                    </button>
                                </div>
                                <div className="absolute -right-4 -bottom-4 text-white/5 dark:text-black/5 rotate-12">
                                    <Sparkles size={120} />
                                </div>
                            </section>

                            {/* 🚀 STICKY RESPONSIVE AD SECTION */}
                            <div className="lg:sticky lg:top-24 space-y-6">
                                <div className="group relative">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Advertisement</span>
                                        <Info size={10} className="text-slate-300" />
                                    </div>
                                    <div className="p-2 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
                                        <AdBanner position="sidebar-sticky" className="w-full h-auto rounded-lg shadow-sm" />
                                    </div>
                                </div>

                                {/* Micro Footer for Sidebar */}
                                <div className="text-[10px] text-slate-400 font-medium px-2 leading-relaxed">
                                    {lang === 'en' ? 'Ads help us keep the news free for everyone.' : 'विज्ञापनले हामीलाई समाचार निःशुल्क राख्न मद्दत गर्दछ।'}
                                </div>
                            </div>
                        </aside>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;