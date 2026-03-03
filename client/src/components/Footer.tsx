import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Send, Loader2, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
// 🚀 1. Import your authenticated API instance and Auth context
import { API, useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
    const { lang, t } = useLanguage();
    const { user } = useAuth(); // 🚀 2. Get user status for Pro upgrade
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

    /**
     * 🚀 NEWSLETTER FUNCTIONALITY
     * Connected to: POST /api/subscribers/subscribe
     */
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            // Using your standard API instance or axios
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${baseUrl}/api/subscribers/subscribe`, { email, lang });

            setStatus('success');
            setEmail('');

            toast.success(t("Welcome to the family!", "हाम्रो परिवारमा स्वागत छ!"), {
                description: t(
                    "Thank you for joining. Your first news update is on its way!",
                    "हामीसँग जोडिनुभएकोमा धन्यवाद। पहिलो अपडेट चाँडै आउँदैछ!"
                ),
                icon: <Heart className="text-red-500 fill-red-500" size={16} />
            });
        } catch (err: any) {
            setStatus('error');
            const errorMessage = err.response?.data?.message || t("Connection Interrupted", "सम्पर्क विच्छेद भयो");
            toast.error(errorMessage);
        }
    };

    /**
     * 🚀 PRO UPGRADE FUNCTIONALITY
     * Connected to: POST /api/settings/pro-interest (Authenticated)
     */
    const handleProUpgrade = async () => {
        // Guard: User must be logged in to track interest in their profile
        if (!user) {
            return toast.error(t("Login Required", "लगइन आवश्यक छ"), {
                description: t("Please login to join the Pro waitlist.", "प्रो प्रतीक्षा सूचीमा सामेल हुन कृपया लगइन गर्नुहोस्।")
            });
        }

        try {
            // This hits the controller that sets isProInterested: true in the DB
            await API.post('/api/settings/pro-interest');

            toast.success(t("Interest Recorded!", "रुचि रेकर्ड गरियो!"), {
                description: t(
                    "You're on the waitlist for KhabarPoint Pro. We'll notify you soon!",
                    "तपाईं खबरप्वाइन्ट प्रोको प्रतीक्षा सूचीमा हुनुहुन्छ। हामी तपाईंलाई चाँडै सूचित गर्नेछौं!"
                ),
                icon: <Sparkles className="text-amber-500" />
            });
        } catch (err: any) {
            toast.error(t("Something went wrong", "केही गलत भयो"), {
                description: t("Our newsroom is busy. Try again later.", "हाम्रो न्यूजरूम व्यस्त छ। पछि फेरि प्रयास गर्नुहोस्।")
            });
        }
    };

    return (
        <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 mt-12 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* 1. Branding Section */}
                    <div className="md:col-span-1 space-y-4">
                        <Link to="/" className="text-2xl font-black text-red-600 tracking-tighter italic uppercase">
                            {settings?.siteName?.split(' ')[0] || 'KHABAR'}
                            <span className="text-slate-900 dark:text-white ml-1">
                                {settings?.siteName?.split(' ')[1] || 'POINT'}
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {settings?.metaDescription || t(
                                "Nepal's premium destination for technology, business, and national updates.",
                                "प्रविधि, व्यवसाय र राष्ट्रिय अपडेटहरूको लागि नेपालको प्रिमियम गन्तव्य।"
                            )}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, url: settings?.facebookUrl, color: 'hover:text-blue-600' },
                                { icon: Twitter, url: settings?.twitterUrl, color: 'hover:text-sky-500' },
                                { icon: Instagram, url: settings?.instagramUrl, color: 'hover:text-pink-600' },
                                { icon: Youtube, url: settings?.youtubeUrl, color: 'hover:text-red-600' }
                            ].map((social, i) => social.url && (
                                <a key={i} href={social.url} target="_blank" rel="noreferrer">
                                    <social.icon className={`h-5 w-5 text-slate-400 cursor-pointer transition-colors ${social.color}`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t("Quick Links", "छिटो लिङ्कहरू")}</h4>
                        <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/about" className="hover:text-red-600 transition-colors">{t("About Us", "हाम्रो बारेमा")}</Link>
                            <Link to="/contact" className="hover:text-red-600 transition-colors">{t("Contact", "सम्पर्क")}</Link>
                            {/* 🚀 Pro Upgrade Button now triggers the handleProUpgrade function */}
                            <button onClick={handleProUpgrade} className="text-left hover:text-amber-500 transition-colors flex items-center gap-1 group w-fit">
                                <Sparkles size={12} className="text-amber-500 group-hover:animate-pulse" />
                                {t("KhabarPoint Pro", "खबरप्वाइन्ट प्रो")}
                            </button>
                            <Link to="/login" className="hover:text-red-600 transition-colors font-bold text-red-600/50 uppercase text-[10px]">{t("Staff Login", "कर्मचारी लगइन")}</Link>
                        </div>
                    </div>

                    {/* 3. Legal Section */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t("Legal", "कानूनी")}</h4>
                        <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/terms" className="hover:text-red-600 transition-colors">{t("Terms of Service", "सेवाका सर्तहरू")}</Link>
                            <Link to="/privacy" className="hover:text-red-600 transition-colors">{t("Privacy Policy", "गोपनीयता नीति")}</Link>
                        </div>
                    </div>

                    {/* 4. Newsletter Section */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">{t("Newsletter", "न्यूजलेटर")}</h4>

                        {status === 'success' ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-6 rounded-3xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="h-10 w-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        {t("Thank You!", "धन्यवाद!")}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {t("We've added you to our elite reader list.", "तपाईं हाम्रो पाठक सूचीमा थपिनुभएको छ।")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {t("Join 10,000+ readers for the morning's top stories.", "बिहानको मुख्य समाचारहरूको लागि १०,०००+ पाठकहरूसँग जोडिनुहोस्।")}
                                </p>
                                <form onSubmit={handleSubscribe} className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder={t("Email", "इमेल")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-red-600 outline-none dark:text-white transition-all"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-all disabled:bg-slate-400 shrink-0 shadow-xl shadow-red-600/20"
                                    >
                                        {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left leading-relaxed">
                        {settings?.footerText || `© ${new Date().getFullYear()} KHABAR POINT. NEPAL'S NEWSROOM.`}
                    </p>
                    <div className="text-[10px] text-slate-400 flex gap-4 font-bold uppercase tracking-widest">
                        {/* Use <a> tags with the exact .xml extension */}
                        <a
                            href="/sitemap.xml"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-600 transition-colors"
                        >
                            {t("Sitemap", "साइटम्याप")}
                        </a>
                        <a
                            href="/feed.xml"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-600 transition-colors"
                        >
                            {t("RSS", "आरएसएस")}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;