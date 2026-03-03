import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

type AdPosition =
    | 'sidebar'
    | 'top-banner'
    | 'in-article'
    | 'sidebar-top'
    | 'sidebar-sticky'
    | 'home-middle'
    | 'top-leaderboard';

interface AdBannerProps {
    position: AdPosition;
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, className }) => {
    const { data: ads, isLoading, isError } = useQuery({
        queryKey: ['ads', position],
        queryFn: async () => {
            try {
                const { data } = await API.get(`/api/ads?position=${position}`);
                // 🚀 Robust data extraction
                return data?.data || data?.ads || (Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Ad Fetch Error:", error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 1, // Don't spam the server if CORS is blocking
    });

    if (isLoading) return (
        <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center min-h-[100px] ${className}`}>
            <Loader2 className="h-4 w-4 text-slate-300 animate-spin" />
        </div>
    );

    // 🚀 NEW: Don't render anything if there's an error or no ads
    if (isError || !ads || !Array.isArray(ads) || ads.length === 0) return null;

    // Pick a random ad safely
    const ad = ads[Math.floor(Math.random() * ads.length)];

    // 🚀 NEW: Guard Clause - If 'ad' or 'imageUrl' is missing, stop here
    if (!ad || !ad.imageUrl) return null;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Safety check for starting slash
    const formattedImagePath = ad.imageUrl.startsWith('/') ? ad.imageUrl : `/${ad.imageUrl}`;

    const imageUrl = ad.imageUrl.startsWith('http')
        ? ad.imageUrl
        : `${baseUrl}${formattedImagePath}`;

    return (
        <div className={`ad-container overflow-hidden rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 ${className}`}>
            <a href={ad.link || '#'} target="_blank" rel="noopener noreferrer" className="block">
                <img
                    src={imageUrl}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                    // 🚀 Fallback: Hide if image fails to load
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                    }}
                />
                <div className="bg-slate-50 dark:bg-slate-800 py-1 px-2 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase text-right tracking-widest">
                    Advertisement
                </div>
            </a>
        </div>
    );
};

export default AdBanner;