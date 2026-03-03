import React, { useState } from 'react';
import { Sparkles, Bell, Check, Rocket, EyeOff, Zap, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { API, useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import AuthModal from './AuthModal'; // Ensure the path is correct

const ProCard: React.FC = () => {
    const { t } = useLanguage();
    const { user, refreshUser } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#ffffff', '#000000']
        });
    };

    const handleNotifyMe = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 🚀 IF NO USER, OPEN MODAL INSTEAD OF STOPPING
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        try {
            const { data } = await API.post('/api/auth/pro-interest');

            if (data.success) {
                try {
                    if (refreshUser) await refreshUser();
                } catch (refreshErr) {
                    console.warn("⚠️ Refresh failed but interest was logged", refreshErr);
                }

                triggerConfetti();
                toast.success(t("You're on the list!", "तपाईं सूचीमा हुनुहुन्छ!"));
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    const benefits = [
        { icon: <EyeOff size={14} />, textEn: "Ad-free Reading", textNe: "विज्ञापन-रहित पढाइ" },
        { icon: <Zap size={14} />, textEn: "Priority News Alerts", textNe: "प्राथमिकता समाचार अलर्ट" },
        { icon: <Star size={14} />, textEn: "Exclusive Deep-Dives", textNe: "विशेष रिपोर्टहरू" }
    ];

    return (
        <>
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-7 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5 group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-600/10 blur-[50px] group-hover:bg-red-600/20 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="bg-red-600/20 text-red-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-600/20">
                                {t("Coming Soon", "चाँडै आउँदैछ")}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight leading-none text-white">
                            KhabarPoint <span className="text-red-500 italic">PRO</span>
                        </h3>
                    </div>

                    <div className="space-y-3 py-2">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-3 group/item">
                                <div className="p-1.5 bg-white/5 rounded-lg text-red-500 group-hover/item:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <span className="text-xs font-medium text-slate-300">
                                    {t(benefit.textEn, benefit.textNe)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleNotifyMe}
                        disabled={user?.isProInterested}
                        className={`relative z-20 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${user?.isProInterested
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-default'
                            : 'bg-white text-slate-900 hover:bg-red-50 active:scale-[0.98] cursor-pointer'
                            }`}
                    >
                        {user?.isProInterested ? (
                            <>
                                <Check size={16} />
                                {t("On the Waitlist", "प्रतीक्षा सूचीमा हुनुहुन्छ")}
                            </>
                        ) : (
                            <>
                                <Bell size={16} />
                                {t("Notify Me on Launch", "लन्चमा मलाई सूचित गर्नुहोस्")}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* --- Auth Modal for Guests --- */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default ProCard;