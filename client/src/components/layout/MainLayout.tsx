import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TrendingSidebar from '../TrendingSidebar';
import NewsTicker from '../NewsTicker';
import AdSpace from '../AdSpace';
import ElectionTally from '../election/ElectionTally';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';

interface MainLayoutProps {
    toggleDarkMode: () => void;
    darkMode: boolean;
}

const categories = [
    { name: { en: 'Nepal', ne: 'नेपाल' }, slug: 'nepal' },
    { name: { en: 'Politics', ne: 'राजनीति' }, slug: 'politics' },
    { name: { en: 'Business', ne: 'व्यापार' }, slug: 'business' },
    { name: { en: 'Tech', ne: 'प्रविधि' }, slug: 'tech' },
    { name: { en: 'Sports', ne: 'खेलकुद' }, slug: 'sports' },
    { name: { en: 'Entertainment', ne: 'मनोरञ्जन' }, slug: 'entertainment' },
];

const MainLayout: React.FC<MainLayoutProps> = ({ toggleDarkMode, darkMode }) => {
    const { lang, setLang } = useLanguage();
    const location = useLocation();

    const { data: electionData = [] } = useQuery({
        queryKey: ['election-results'],
        queryFn: async () => {
            const res = await API.get('/api/election/results');
            return res.data?.data || [];
        },
        refetchInterval: 30000
    });

    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await API.get('/api/settings');
            return res.data?.data;
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const isHomePage = location.pathname === '/' || location.pathname === '/home' || location.pathname === '';

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300">
            <Header lang={lang} setLang={setLang} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <NewsTicker />

            <div className="container mx-auto px-4 mt-4">
                <AdSpace position="top-leaderboard" />
            </div>

            {/* Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 md:top-12 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-6 h-12 overflow-x-auto no-scrollbar scroll-smooth">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className={`text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap py-4 border-b-2 ${location.pathname.includes(cat.slug)
                                    ? 'text-red-600 border-red-600'
                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-red-600'
                                    }`}
                            >
                                {lang === 'en' ? cat.name.en : cat.name.ne}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 🇳🇵 Election Tally */}
            {isHomePage && settings?.showElectionTally && electionData.length > 0 && (
                <div className="container mx-auto px-4 mt-6">
                    <ElectionTally
                        candidates={electionData}
                        title={settings.electionTitle || (lang === 'en' ? 'Live Count' : 'प्रत्यक्ष गणना')}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* 🚀 FIXED GRID: grid-cols-1 ensures stacking on mobile, lg:grid-cols-4 for desktop side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

                    {/* LEFT CONTENT (Primary) */}
                    <div className="lg:col-span-3 order-1">
                        <Outlet context={{ darkMode }} />
                        <div className="mt-12">
                            <AdSpace position="home-middle" />
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR (Secondary) */}
                    {/* 🚀 REMOVED 'hidden' entirely so it never disappears on mobile resize */}
                    <aside className="lg:col-span-1 w-full space-y-10 order-2">

                        {/* 1. Trending Items */}
                        <div className="w-full">
                            <TrendingSidebar />
                        </div>

                        {/* 2. Professional Sponsored Ad Section */}
                        <div className="lg:sticky lg:top-32 space-y-6">
                            <div className="relative group p-1">
                                {/* Header label for the ad */}
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        {lang === 'en' ? 'ADVERTISEMENT' : 'विज्ञापन'}
                                    </span>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                                </div>

                                {/* The Ad Box */}
                                <div className="p-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 transition-colors duration-300">
                                    <AdSpace position="sidebar-sticky" className="w-full rounded-2xl overflow-hidden shadow-sm" />
                                </div>

                                {/* Support text */}
                                <p className="mt-4 text-[10px] text-center text-slate-400 font-medium px-4 leading-relaxed italic">
                                    {lang === 'en'
                                        ? 'Help us bring you the truth. Support our partners.'
                                        : 'सत्य समाचारका लागि हाम्रा साझेदारहरूलाई समर्थन गर्नुहोस्।'}
                                </p>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;