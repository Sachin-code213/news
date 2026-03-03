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

    // 🚀 1. Fetch Election Data
    const { data: electionData = [] } = useQuery({
        queryKey: ['election-results'],
        queryFn: async () => {
            const res = await API.get('/api/election/results');
            return res.data?.data || [];
        },
        refetchInterval: 30000
    });

    // 🚀 2. Fetch Global Settings
    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await API.get('/api/settings');
            return res.data?.data;
        }
    });

    // 🔍 Debugging Logs - These will show you EXACTLY why it might be hidden
    useEffect(() => {
        if (!settingsLoading) {
            console.log("📍 Current Path:", location.pathname);
            console.log("🔘 Switch ON?:", settings?.showElectionTally);
            console.log("📊 Data Count:", electionData?.length);
        }
    }, [location.pathname, settings, electionData, settingsLoading]);

    useEffect(() => {
        const root = window.document.documentElement;
        darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // 🛠️ Improved Homepage Detection
    const isHomePage = location.pathname === '/' || location.pathname === '/home' || location.pathname === '';

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans antialiased transition-colors duration-300">
            <Header lang={lang} setLang={setLang} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <NewsTicker />

            <div className="container mx-auto px-4 mt-4">
                <AdSpace position="top-leaderboard" />
            </div>

            {/* Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 md:top-12 z-40 shadow-sm transition-colors">
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

            {/* 🇳🇵 Election Tally (FULL WIDTH - Only on Home Page) */}
            {isHomePage && settings?.showElectionTally && electionData.length > 0 && (
                <div className="container mx-auto px-4 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <ElectionTally
                        candidates={electionData}
                        title={settings.electionTitle || (lang === 'en' ? 'Live Election Count' : 'प्रत्यक्ष निर्वाचन परिणाम')}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3">
                        <Outlet context={{ darkMode }} />
                        <div className="mt-12">
                            <AdSpace position="home-middle" />
                        </div>
                    </div>

                    <aside className="md:col-span-1 hidden md:block">
                        <div className="sticky top-32 space-y-6">
                            <TrendingSidebar />
                            <AdSpace position="sidebar-top" />
                            <AdSpace position="sidebar-sticky" />
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;