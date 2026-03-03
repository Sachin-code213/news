import React from 'react';
import { useLanguage } from '../context/LanguageContext';
// 🚀 FIX: Capitalized 'Info'
import { Mail, MapPin, Phone, ShieldCheck, FileText, Info, Globe, Facebook, Twitter, Instagram } from 'lucide-react';

const StaticPage = ({ slug }: { slug: string }) => {
    const { lang } = useLanguage();

    const data: any = {
        about: {
            icon: <Info className="text-red-600 h-8 w-8" />,
            titleEn: "About KhabarPoint",
            titleNe: "हाम्रो बारेमा",
            contentEn: "KhabarPoint is Nepal's leading digital news destination, dedicated to providing real-time updates on technology, business, and current affairs. Our mission is to empower Nepalese citizens with accurate, unbiased, and timely information.",
            contentNe: "खबरपोइन्ट नेपालको अग्रणी डिजिटल समाचार गन्तव्य हो, जुन प्रविधि, व्यवसाय र समसामयिक मामिलाहरूमा वास्तविक-समय अपडेटहरू प्रदान गर्न समर्पित छ। हाम्रो मिशन नेपाली नागरिकहरूलाई सही, निष्पक्ष र समयसापेक्ष सूचनाको साथ सशक्त बनाउनु हो।"
        },
        contact: {
            icon: <Phone className="text-red-600 h-8 w-8" />,
            titleEn: "Contact Us",
            titleNe: "सम्पर्क गर्नुहोस्",
            contentEn: "Have a story tip or a question? Reach out to our editorial team. We are available 24/7 for urgent news coverage.",
            contentNe: "के तपाईंसँग कुनै समाचार वा प्रश्न छ? हाम्रो सम्पादकीय टोलीलाई सम्पर्क गर्नुहोस्। हामी तत्काल समाचार कभरेजको लागि २४/७ उपलब्ध छौं।"
        },
        privacy: {
            icon: <ShieldCheck className="text-red-600 h-8 w-8" />,
            titleEn: "Privacy Policy",
            titleNe: "गोपनीयता नीति",
            contentEn: "At KhabarPoint, we take your privacy seriously. We do not sell your personal data. We use cookies only to improve your browsing experience and provide personalized news feeds.",
            contentNe: "खबरपोइन्टमा, हामी तपाईंको गोपनीयतालाई गम्भीरताका साथ लिन्छौं। हामी तपाईंको व्यक्तिगत डाटा बेच्दैनौं। हामी तपाईंको ब्राउजिङ अनुभव सुधार गर्न र व्यक्तिगत समाचार फिडहरू प्रदान गर्न मात्र कुकीहरू प्रयोग गर्छौं।"
        },
        terms: {
            icon: <FileText className="text-red-600 h-8 w-8" />,
            titleEn: "Terms of Service",
            titleNe: "सेवाका सर्तहरू",
            contentEn: "By using KhabarPoint, you agree to our terms. Content scraping is strictly prohibited. All articles and media are protected under international copyright laws.",
            contentNe: "खबरपोइन्ट प्रयोग गरेर, तपाईं हाम्रा सर्तहरूमा सहमत हुनुहुन्छ। सामग्री स्क्र्यापिङ कडा रूपमा निषेध गरिएको छ। सबै लेख र मिडिया अन्तर्राष्ट्रिय प्रतिलिपि अधिकार कानून अन्तर्गत सुरक्षित छन्।"
        },
        advertise: {
            icon: <Globe className="text-red-600 h-8 w-8" />,
            titleEn: "Advertise with Us",
            titleNe: "हामीसँग विज्ञापन गर्नुहोस्",
            contentEn: "Reach millions of readers in Nepal and abroad. We offer display ads, sponsored content, and social media promotion packages.",
            contentNe: "नेपाल र विदेशका लाखौं पाठकहरूमाझ पुग्नुहोस्। हामी डिस्प्ले विज्ञापनहरू, प्रायोजित सामग्री, र सामाजिक मिडिया प्रमोशन प्याकेजहरू प्रदान गर्दछौं।"
        }
    };

    const page = data[slug];

    if (!page) {
        return (
            <div className="py-20 text-center dark:text-white">
                <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
                <p className="text-slate-500">The page you are looking for is currently unavailable.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-10 px-4 transition-colors duration-300">
            {/* Breadcrumb style indicator */}
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mb-2">
                KhabarPoint / {slug}
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-8">
                    {page.icon}
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                        {lang === 'en' ? page.titleEn : page.titleNe}
                    </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose">
                    <p className="whitespace-pre-line">
                        {lang === 'en' ? page.contentEn : page.contentNe}
                    </p>
                </div>

                {/* --- 🚀 CONDITIONAL SECTION: ABOUT US SOCIALS --- */}
                {slug === 'about' && (
                    <div className="mt-10 pt-10 border-t dark:border-slate-700">
                        <h3 className="font-bold mb-4 dark:text-white">Follow Our Network</h3>
                        <div className="flex gap-4">
                            <Facebook className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
                            <Twitter className="text-sky-500 cursor-pointer hover:scale-110 transition-transform" />
                            <Instagram className="text-pink-600 cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                    </div>
                )}

                {/* --- 🚀 CONDITIONAL SECTION: CONTACT FORM --- */}
                {slug === 'contact' && (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t dark:border-slate-700">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-red-600 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Email Us</p>
                                    <p className="dark:text-slate-200 text-sm font-bold">khabarpoint@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-red-600 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Call Support</p>
                                    <p className="dark:text-slate-200 text-sm font-bold">+977 9815838904</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Visit Bureau</p>
                                    <p className="dark:text-slate-200 text-sm font-bold">Janakpur Dham, Nepal</p>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Full Name" className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-red-600 border-slate-100" />
                            <input type="email" placeholder="Email Address" className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-red-600 border-slate-100" />
                            <textarea placeholder="How can we help?" className="w-full p-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-red-600 border-slate-100 h-32"></textarea>
                            <button className="bg-red-600 text-white font-black uppercase tracking-widest text-xs w-full py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                                Send Inquiry
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaticPage;