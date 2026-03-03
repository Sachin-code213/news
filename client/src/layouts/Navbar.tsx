import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
    const { lang, setLang } = useLanguage();

    // 🚀 FIXED: Categories must match the slugs in your database
    const navItems = [
        { nameEn: 'Nepal', nameNe: 'नेपाल', slug: 'nepal' },
        { nameEn: 'Politics', nameNe: 'राजनीति', slug: 'politics' },
        { nameEn: 'Business', nameNe: 'व्यापार', slug: 'business' },
        { nameEn: 'Technology', nameNe: 'प्रविधि', slug: 'technology' },
        { nameEn: 'Sports', nameNe: 'खेलकुद', slug: 'sports' },
        { nameEn: 'Entertainment', nameNe: 'मनोरञ्जन', slug: 'entertainment' },
    ];

    return (
        <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-between h-12">
                    <div className="flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.slug}
                                to={`/category/${item.slug}`}
                                className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                            >
                                {lang === 'en' ? item.nameEn : item.nameNe}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 🚀 Dark Mode Toggle Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleDarkMode}
                            className="dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                        >
                            {darkMode ? (
                                <Sun className="h-4 w-4 text-yellow-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-600" />
                            )}
                        </Button>

                        {/* Language Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLang(lang === 'en' ? 'ne' : 'en')}
                            className="flex items-center gap-1 dark:text-white"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="text-[10px] font-bold">{lang === 'en' ? 'NE' : 'EN'}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;