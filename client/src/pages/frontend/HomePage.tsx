import React, { useEffect } from 'react';
import Hero from '../frontend/Hero';
import TrendingSidebar from '../../components/TrendingSidebar';
import CategoryGrid from '../frontend/CategoryGrid';
import AdBanner from '../../components/public/AdBanner';
import { useLanguage } from '../../context/LanguageContext';
import NewsSection from '../frontend/NewsSection';
import VideoGallery from '../../components/VideoGallery';
import ElectionTally from '../../components/election/ElectionTally';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';

const HomePage: React.FC = () => {
    const { lang } = useLanguage();

    // 🚀 1. Fetch Global Settings (Master Switch)
    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await API.get('/api/settings');
            return res.data?.data;
        }
    });

    // 🚀 2. Fetch Election Candidates
    const { data: electionData = [], isLoading: electionLoading } = useQuery({
        queryKey: ['election-results'],
        queryFn: async () => {
            const res = await API.get('/api/election/results');
            return res.data?.data || [];
        },
        refetchInterval: 30000
    });

    // 🔍 Console Debugging
    useEffect(() => {
        if (!settingsLoading) {
            console.log("🛠️ MASTER SWITCH STATUS:", settings?.showElectionTally);
            console.log("🗳️ CANDIDATES LOADED:", electionData.length);
        }
    }, [settings, electionData, settingsLoading]);

    // 🚀 3. Fetch regular articles
    const { data: articles = [] } = useQuery({
        queryKey: ['home-articles-list'],
        queryFn: async () => {
            const res = await API.get('/api/articles?limit=20');
            return res.data?.data || [];
        }
    });

    return (
        <div className="space-y-10 pb-20 transition-colors duration-300">
            {/* 1. Top Leaderboard Ad */}
            <div className="container mx-auto px-4 pt-4">
                <AdBanner position="top-leaderboard" className="mx-auto" />
            </div>

            {/* 🇳🇵 2. Live Election Tally Section (Conditional) */}
            {/* Logic: Only show if settings exist, switch is ON, and we have at least one candidate */}
            {!settingsLoading && settings?.showElectionTally && electionData.length > 0 && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <ElectionTally
                        candidates={electionData}
                        title={settings.electionTitle || (lang === 'en' ? 'Live Election Count' : 'प्रत्यक्ष निर्वाचन परिणाम')}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 space-y-16">
                        {/* Featured Stories Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
                                    {lang === 'en' ? 'Featured Stories' : 'मुख्य समाचार'}
                                </h2>
                                <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                            </div>
                            <Hero />
                        </div>

                        {/* Politics Section */}
                        <NewsSection
                            title={lang === 'en' ? 'Politics' : 'राजनीति'}
                            categorySlug="politics"
                            limit={4}
                        />

                        <VideoGallery articles={articles} />
                        <AdBanner position="home-middle" />

                        {/* Tech Section */}
                        <NewsSection
                            title={lang === 'en' ? 'Tech' : 'प्रविधि'}
                            categorySlug="tech"
                            limit={4}
                            variant="grid"
                        />

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                                    {lang === 'en' ? 'Explore More' : 'थप अन्वेषण गर्नुहोस्'}
                                </h2>
                                <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                            </div>
                            <CategoryGrid />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <AdBanner position="sidebar-top" />
                        </div>
                        <TrendingSidebar />
                        <div className="sticky top-32 space-y-8">
                            <AdBanner position="sidebar-sticky" />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default HomePage;