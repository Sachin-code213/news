import React from 'react';
import { Trophy, MapPin, Activity } from 'lucide-react';

interface Candidate {
    _id: string;
    candidateName: string;
    partyName: string;
    partyLogo?: string;
    partyColor?: string;
    place: string; // 📍 Added the Place field
    votes: number;
    isWinner?: boolean;
}

interface ElectionTallyProps {
    candidates: Candidate[];
    title: string;
}

const ElectionTally: React.FC<ElectionTallyProps> = ({ candidates, title }) => {
    if (!candidates || candidates.length === 0) return null;

    // Sort by votes to determine the "Leader"
    const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
    const maxVotes = sorted[0].votes || 1; // Used for the progress bar calculation

    return (
        <section className="bg-white dark:bg-slate-900 border-t-4 border-red-600 rounded-b-[2.5rem] my-8 shadow-2xl overflow-hidden border-x border-b border-slate-100 dark:border-slate-800">
            <div className="p-6 md:p-8">
                {/* --- LIVE HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                        </div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-900/50">
                        <Activity size={14} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Live Count 2082</span>
                    </div>
                </div>

                {/* --- TALLY GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {sorted.map((c, index) => (
                        <div
                            key={c._id}
                            className={`relative p-5 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl ${c.isWinner
                                    ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20'
                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                                }`}
                        >
                            {/* Winner Icon */}
                            {c.isWinner && (
                                <div className="absolute -top-3 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-lg rotate-12">
                                    <Trophy size={16} className="text-white fill-white" />
                                </div>
                            )}

                            {/* 1. Place Badge (Constituency) */}
                            <div className="flex items-center justify-center gap-1 mb-3 opacity-70">
                                <MapPin size={10} className="text-red-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest truncate">
                                    {c.place || "N/A"}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                {/* 2. Party Logo */}
                                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-2 mb-3 shadow-sm border dark:border-slate-700">
                                    {c.partyLogo ? (
                                        <img src={c.partyLogo} alt="party" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-slate-300">
                                            {c.partyName.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* 3. Candidate Info */}
                                <h3 className="font-black text-sm uppercase dark:text-white truncate w-full px-2">
                                    {c.candidateName}
                                </h3>
                                <p className="text-[9px] font-bold uppercase tracking-tighter mb-4" style={{ color: c.partyColor }}>
                                    {c.partyName}
                                </p>

                                {/* 4. Vote Display */}
                                <div className="w-full space-y-2">
                                    <div className="flex items-end justify-center gap-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                                            {c.votes?.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Relative Progress Bar */}
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out rounded-full"
                                            style={{
                                                width: `${(c.votes / maxVotes) * 100}%`,
                                                backgroundColor: c.partyColor || '#e11d48'
                                            }}
                                        />
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Votes</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM MARQUEE --- */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-[9px] font-bold text-center text-slate-400 uppercase tracking-[0.3em]">
                    Election Data Syncing via Central API • Last updated: Just now
                </p>
            </div>
        </section>
    );
};

export default ElectionTally;