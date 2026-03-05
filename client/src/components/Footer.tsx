import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Send, Loader2, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { API, useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
    const { lang, t } = useLanguage();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${baseUrl}/api/settings`);
            return data.data;
        }
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${baseUrl}/api/subscribers/subscribe`, { email, lang });
            setStatus('success');
            setEmail('');
            toast.success(t("Welcome!", "स्वागत छ!"), {
                icon: <Heart className="text-red-500 fill-red-500" size={16} />
            });
        } catch (err: any) {
            setStatus('error');
            toast.error(err.response?.data?.message || t("Error", "त्रुटि"));
        }
    };

    const handleProUpgrade = async () => {
        if (!user) {
            return toast.error(t("Login Required", "लगइन आवश्यक छ"));
        }
        try {
            await API.post('/api/settings/pro-interest');
            toast.success(t("Added to Waitlist!", "प्रतीक्षा सूचीमा थपियो!"));
        } catch (err: any) {
            toast.error(t("Try again later", "पछि फेरि प्रयास गर्नुहोस्"));
        }
    };

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 mt-20 transition-colors duration-300">
            <div className="container mx-auto px-6 py-16">

                {/* 🚀 RESPONSIVE GRID: 1 col on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* 1. Branding Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black text-red-600 tracking-tighter italic uppercase flex items-center">
                            {settings?.siteName?.split(' ')[0] || 'KHABAR'}
                            <span className="text-slate-900 dark:text-white ml-1">
                                {settings?.siteName?.split(' ')[1] || 'POINT'}
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            {settings?.metaDescription || t(
                                "Nepal's premium destination for technology, business, and national updates.",
                                "प्रविधि, व्यवसाय र राष्ट्रिय अपडेटहरूको लागि नेपालको प्रिमियम गन्तव्य।"
                            )}
                        </p>
                        <div className="flex gap-5">
                            {[
                                { icon: Facebook, url: settings?.facebookUrl, color: 'hover:text-blue-600' },
                                { icon: Twitter, url: settings?.twitterUrl, color: 'hover:text-sky-500' },
                                { icon: Instagram, url: settings?.instagramUrl, color: 'hover:text-pink-600' },
                                { icon: Youtube, url: settings?.youtubeUrl, color: 'hover:text-red-600' }
                            ].map((social, i) => social.url && (
                                <a key={i} href={social.url} target="_blank" rel="noreferrer" className="transform hover:-translate-y-1 transition-all duration-300">
                                    <social.icon className={`h-5 w-5 text-slate-400 ${social.color}`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white border-l-2 border-red-600 pl-3">
                            {t("Quick Links", "छिटो लिङ्कहरू")}
                        </h4>
                        <nav className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/about" className="hover:text-red-600 transition-colors w-fit">{t("About Us", "हाम्रो बारेमा")}</Link>
                            <Link to="/contact" className="hover:text-red-600 transition-colors w-fit">{t("Contact", "सम्पर्क")}</Link>
                            <button onClick={handleProUpgrade} className="hover:text-amber-500 transition-colors flex items-center gap-2 group w-fit">
                                <Sparkles size={14} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                                {t("KhabarPoint Pro", "खबरप्वाइन्ट प्रो")}
                            </button>
                        </nav>
                    </div>

                    {/* 3. Legal Section */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white border-l-2 border-red-600 pl-3">
                            {t("Legal", "कानूनी")}
                        </h4>
                        <nav className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/terms" className="hover:text-red-600 transition-colors w-fit">{t("Terms of Service", "सेवाका सर्तहरू")}</Link>
                            <Link to="/privacy" className="hover:text-red-600 transition-colors w-fit">{t("Privacy Policy", "गोपनीयता नीति")}</Link>
                            <Link to="/login" className="mt-2 text-[10px] font-black text-slate-300 dark:text-slate-700 hover:text-red-600 transition-colors uppercase tracking-widest italic">
                                {t("Staff Portal", "कर्मचारी पोर्टल")}
                            </Link>
                        </nav>
                    </div>

                    {/* 4. Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white border-l-2 border-red-600 pl-3">
                            {t("Newsletter", "न्यूजलेटर")}
                        </h4>

                        {status === 'success' ? (
                            <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-5 rounded-2xl animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                                    <CheckCircle size={18} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t("Verified", "प्रमाणित")}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                                    {t("Welcome to the inner circle.", "हाम्रो भित्री सर्कलमा स्वागत छ।")}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t("Get the day's most essential stories delivered to your inbox.", "दिनका मुख्य समाचारहरू आफ्नो इमेलमा प्राप्त गर्नुहोस्।")}
                                </p>
                                <form onSubmit={handleSubscribe} className="relative group">
                                    <input
                                        type="email"
                                        placeholder={t("Email Address", "इमेल ठेगाना")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-slate-300 flex items-center justify-center"
                                    >
                                        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-slate-100 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            {settings?.footerText || `© ${new Date().getFullYear()} KHABAR POINT. ALL RIGHTS RESERVED.`}
                        </p>
                        <p className="text-[9px] text-slate-300 dark:text-slate-600 uppercase tracking-tighter">
                            Designed for Nepal • Managed in Kathmandu
                        </p>
                    </div>

                    <div className="flex gap-8">
                        <a href="/sitemap.xml" target="_blank" className="text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">
                            {t("Sitemap", "साइटम्याप")}
                        </a>
                        <a href="/feed.xml" target="_blank" className="text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest">
                            {t("RSS Feed", "आरएसएस")}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;