import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AdSpaceProps {
    position: 'top-leaderboard' | 'home-middle' | 'sidebar-top' | 'sidebar-sticky' | 'sidebar' | 'top-banner' | 'in-article';
    // 🚀 FIXED: Added className to the interface
    className?: string;
}

const AdSpace: React.FC<AdSpaceProps> = ({ position, className = "" }) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const { data: ad, isLoading } = useQuery({
        enabled: !!position,
        queryKey: ['ads', position],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`${baseUrl}/api/ads`, {
                    params: { position: position }
                });

                const adData = data?.data || data;

                if (Array.isArray(adData)) {
                    return adData.length > 0 ? adData[0] : null;
                }
                return adData || null;
            } catch (err) {
                console.error("Ad loading error:", err);
                return null;
            }
        }
    });

    if (isLoading || !ad || !ad.isActive) {
        return null;
    }

    const getLayoutClasses = () => {
        let baseClasses = "";
        switch (position) {
            case 'top-leaderboard':
                baseClasses = "w-full h-24 md:h-32 mb-4";
                break;
            case 'sidebar-top':
            case 'sidebar-sticky':
            case 'sidebar':
                baseClasses = "w-full aspect-square mb-6";
                break;
            case 'home-middle':
            case 'in-article':
                baseClasses = "w-full h-auto my-8";
                break;
            default:
                baseClasses = "w-full h-auto";
        }
        // 🚀 Combine internal classes with the custom 'className' prop
        return `${baseClasses} ${className}`;
    };

    return (
        <div className={`overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-all ${getLayoutClasses()}`}>
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
                <div className="relative h-full w-full">
                    <img
                        src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `${baseUrl}${ad.imageUrl}`}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <span className="block text-[8px] font-black text-center text-slate-400 dark:text-slate-500 uppercase py-1 tracking-widest bg-white dark:bg-slate-900 border-t dark:border-slate-800">
                    ADVERTISEMENT
                </span>
            </a>
        </div>
    );
};

export default AdSpace;