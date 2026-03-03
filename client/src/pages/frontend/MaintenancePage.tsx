import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Cog, MessageSquare, ArrowRight } from 'lucide-react';

const MaintenancePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center transition-colors duration-300">
            <div className="max-w-md w-full space-y-10">

                {/* 🎨 Animated Icon Section */}
                <div className="relative flex justify-center">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 animate-pulse" />

                    <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border-2 border-red-100 dark:border-red-900/30">
                        <Hammer size={48} className="text-red-600 animate-bounce" />
                    </div>

                    {/* Floating Gear */}
                    <div className="absolute top-0 right-1/4">
                        <Cog
                            size={32}
                            className="text-slate-400 dark:text-slate-600 animate-[spin_4s_linear_infinite]"
                        />
                    </div>
                </div>

                {/* 📝 Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                        Under <span className="text-red-600">Maintenance</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4">
                        We're fine-tuning our newsroom to bring you a better experience.
                        <span className="block mt-1 text-red-600/80 dark:text-red-500/80 text-sm font-bold tracking-tight">
                            KhabarPoint will be back online shortly.
                        </span>
                    </p>
                </div>

                {/* 🔗 Action / Contact */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <MessageSquare size={14} className="text-red-600" />
                        Need urgent info? Contact the Editor
                    </div>

                    <a
                        href="mailto:editor@khabarpoint.com"
                        className="group px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl hover:shadow-red-600/20 flex items-center gap-2"
                    >
                        Send Email <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {/* Footer & Secret Admin Link */}
                <div className="space-y-4 pt-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} KhabarPoint Media Group
                    </p>

                    {/* 🕵️ Hidden Login Link: Helpful if you need to turn off maintenance mode */}
                    <Link
                        to="/login"
                        className="block text-[8px] text-slate-300 dark:text-slate-800 hover:text-red-500 transition-colors uppercase tracking-[0.3em]"
                    >
                        Admin Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;