import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Globe, Sun, Moon, Loader2 } from 'lucide-react';

interface HeaderProps {
    lang: 'en' | 'ne';
    setLang: (lang: 'en' | 'ne') => void;
    toggleDarkMode: () => void;
    darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, toggleDarkMode, darkMode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // 🚀 NEW: Fetch dynamic site settings for branding
    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await API.get('/api/settings');
            return data.data;
        }
    });

    // 🚀 NEW: Real-time search suggestion logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.trim().length > 2) {
                try {
                    const { data } = await API.get(`/api/articles/search/suggestions?query=${searchTerm}`);
                    setSuggestions(data.articles || []);
                    setShowSuggestions(true);
                } catch (err) { console.error(err); }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 dark:border-slate-800 backdrop-blur shadow-sm transition-colors duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* 🚀 DYNAMIC BRANDING: Uses siteName from Settings API */}
                <Link to="/" className="text-2xl font-black tracking-tighter shrink-0 uppercase italic">
                    <span className="text-red-600">{settings?.siteName?.split(' ')[0] || 'KHABAR'}</span>
                    <span className="text-slate-900 dark:text-white ml-1">
                        {settings?.siteName?.split(' ')[1] || 'POINT'}
                    </span>
                </Link>

                {/* 🚀 ENHANCED SEARCH: With real-time suggestions */}
                <div className="hidden md:block relative max-w-sm w-full mx-8" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit}>
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={lang === 'en' ? "Search news..." : "समाचार खोज्नुहोस्..."}
                            className="pl-9 bg-slate-100 dark:bg-slate-800 dark:text-white border-none focus:ring-2 focus:ring-red-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 mt-2 rounded-xl shadow-2xl border dark:border-slate-800 overflow-hidden">
                            {suggestions.map((item: any) => (
                                <button
                                    key={item._id}
                                    onClick={() => {
                                        navigate(`/article/${item.slug}`);
                                        setSearchTerm('');
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-0 dark:border-slate-800 transition-colors"
                                >
                                    <p className="text-xs font-bold dark:text-white line-clamp-1">{item.titleEn}</p>
                                    <span className="text-[9px] text-red-600 font-black uppercase tracking-widest">{item.category?.nameEn}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full text-slate-500 dark:text-slate-400">
                        {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLang(lang === 'en' ? 'ne' : 'en')}
                        className="flex items-center gap-2 dark:text-white h-8"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="text-[10px] uppercase font-black">{lang === 'en' ? 'NE' : 'EN'}</span>
                    </Button>

                    {/* Auth Section */}
                    {user ? (
                        <div className="flex items-center gap-3 ml-2 pl-2 border-l dark:border-slate-800">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] font-black leading-none dark:text-white uppercase">{user.name}</span>
                                <span className="text-[8px] text-red-600 font-bold uppercase tracking-tighter">{user.role}</span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 text-[10px] font-black uppercase"
                                onClick={() => { logout(); navigate('/'); }}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login" className="ml-2">
                            <Button size="sm" className="h-8 text-[10px] font-black uppercase bg-red-600 hover:bg-red-700">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;