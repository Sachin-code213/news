import React from 'react';
import { Sparkles, ArrowRight, Lock, Clock, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API, useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProReportsPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Sparkles size={14} /> {t("Pro Exclusive", "प्रो विशेष")}
                </div>
                <h1 className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter">
                    Deep <span className="text-red-600">Dives</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    {t("Exclusive investigative journalism and technology trends in Nepal.", "नेपालमा विशेष खोजी पत्रकारिता र प्रविधि प्रवृत्तिहरू।")}
                </p>
            </div>

            {/* Placeholder for Pro Content */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-64 bg-slate-200 dark:bg-slate-800 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="text-slate-400" size={32} />
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Clock size={12} /> 12 Min Read</span>
                                <span className="flex items-center gap-1"><BookOpen size={12} /> Analysis</span>
                            </div>
                            <h3 className="text-2xl font-black dark:text-white leading-tight">
                                The Future of Fintech in Nepal: A 2026 Perspective
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3">
                                Exploring how local digital wallets are evolving into full-scale neobanks...
                            </p>
                            <button className="text-red-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                Read Report <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProReportsPage;