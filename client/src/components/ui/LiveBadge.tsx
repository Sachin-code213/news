import React from 'react';

export const LiveBadge = () => (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-200 shadow-sm">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        Live
    </span>
);