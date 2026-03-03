import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Plus, Minus, Trash2, Trophy, Image as ImageIcon, X, Save, Power, MapPin } from 'lucide-react';

const ElectionManager: React.FC = () => {
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);

    // 1. Updated Form State with 'place'
    const [formData, setFormData] = useState({
        candidateName: '',
        partyName: '',
        partyColor: '#e11d48',
        partyLogo: '',
        place: '', // New Field
        votes: 0
    });

    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await API.get('/api/settings');
            return res.data?.data;
        }
    });

    const { data: candidates = [] } = useQuery({
        queryKey: ['election-results'],
        queryFn: async () => {
            const res = await API.get('/api/election/results');
            return res.data?.data || [];
        }
    });

    const toggleLayoutMutation = useMutation({
        mutationFn: (enabled: boolean) => API.put('/api/settings', { showElectionTally: enabled }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            toast.success("Home page layout updated!");
        }
    });

    const createMutation = useMutation({
        mutationFn: (newCandidate: any) => API.post('/api/election/candidates', newCandidate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['election-results'] });
            toast.success("Candidate added!");
            setIsAdding(false);
            setFormData({ candidateName: '', partyName: '', partyColor: '#e11d48', partyLogo: '', place: '', votes: 0 });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            API.put(`/api/election/candidates/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['election-results'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => API.delete(`/api/election/candidates/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['election-results'] });
            toast.error("Candidate Deleted");
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.candidateName || !formData.partyName || !formData.place)
            return toast.error("Name, Party, and Place are required");
        createMutation.mutate(formData);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-8 dark:border-slate-800 gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Election War Room</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Results, Places & Winners</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => toggleLayoutMutation.mutate(!settings?.showElectionTally)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all border-2 ${settings?.showElectionTally
                                ? 'bg-green-500 border-green-600 text-white shadow-lg'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                            }`}
                    >
                        <Power size={18} />
                        {settings?.showElectionTally ? 'LAYOUT: ACTIVE' : 'LAYOUT: HIDDEN'}
                    </button>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${isAdding ? 'bg-slate-800 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                    >
                        {isAdding ? <X size={20} /> : <Plus size={20} />}
                        {isAdding ? 'Close' : 'Add Candidate'}
                    </button>
                </div>
            </div>

            {/* ADD FORM */}
            {isAdding && (
                <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-red-500/20 shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Candidate Name</label>
                        <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 font-bold" placeholder="Full Name" value={formData.candidateName} onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Political Party</label>
                        <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 font-bold" placeholder="Party Name" value={formData.partyName} onChange={(e) => setFormData({ ...formData, partyName: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Place / Constituency</label>
                        <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 font-bold" placeholder="e.g. Kathmandu-4" value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Logo URL</label>
                        <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700 font-bold" placeholder="https://..." value={formData.partyLogo} onChange={(e) => setFormData({ ...formData, partyLogo: e.target.value })} />
                    </div>
                    <div className="flex flex-col justify-end">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border dark:border-slate-700 h-[58px]">
                            <span className="text-xs font-bold uppercase text-slate-500">Color</span>
                            <input type="color" className="h-8 w-full rounded cursor-pointer bg-transparent" value={formData.partyColor} onChange={(e) => setFormData({ ...formData, partyColor: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-end">
                        <button type="submit" className="h-[58px] bg-red-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
                            <Save size={20} /> Save Candidate
                        </button>
                    </div>
                </form>
            )}

            {/* CANDIDATE LIST */}
            <div className="grid gap-6">
                {candidates.map((c: any) => (
                    <div key={c._id} className={`flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-slate-900 border-2 rounded-[2rem] transition-all hover:shadow-xl ${c.isWinner ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-800'}`}>

                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 dark:border-slate-700 shadow-sm">
                            {c.partyLogo ? <img src={c.partyLogo} className="w-full h-full object-contain p-2" /> : <ImageIcon className="text-slate-300" />}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <MapPin size={12} className="text-red-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.place}</span>
                            </div>
                            <h3 className="font-black text-2xl dark:text-white leading-tight uppercase italic">{c.candidateName}</h3>
                            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: c.partyColor }}>{c.partyName}</p>
                        </div>

                        {/* VOTE CONTROLS */}
                        <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-[2rem] border dark:border-slate-800">
                            <div className="flex items-center gap-1">
                                <button onClick={() => updateMutation.mutate({ id: c._id, payload: { votes: Math.max(0, c.votes - 10) } })} className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm hover:text-red-500 transition-colors"><Minus size={16} /></button>
                                <div className="px-6 text-center min-w-[120px]">
                                    <p className="text-3xl font-black dark:text-white tracking-tighter tabular-nums">{c.votes.toLocaleString()}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Live Votes</p>
                                </div>
                                <button onClick={() => updateMutation.mutate({ id: c._id, payload: { votes: c.votes + 10 } })} className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm hover:text-green-500 transition-colors"><Plus size={16} /></button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => updateMutation.mutate({ id: c._id, payload: { votes: c.votes + 100 } })} className="text-[9px] font-bold px-3 py-1 bg-white dark:bg-slate-700 rounded-lg border dark:border-slate-600 hover:bg-slate-100">+100</button>
                                <button onClick={() => updateMutation.mutate({ id: c._id, payload: { votes: c.votes + 1000 } })} className="text-[9px] font-bold px-3 py-1 bg-white dark:bg-slate-700 rounded-lg border dark:border-slate-600 hover:bg-slate-100">+1k</button>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3 pl-6 border-t md:border-t-0 md:border-l dark:border-slate-800 pt-4 md:pt-0">
                            <button
                                onClick={() => updateMutation.mutate({ id: c._id, payload: { isWinner: !c.isWinner } })}
                                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${c.isWinner ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-yellow-600'}`}
                            >
                                <Trophy size={20} fill={c.isWinner ? "white" : "none"} />
                                <span className="text-[7px] font-bold uppercase mt-1">Win</span>
                            </button>
                            <button
                                onClick={() => window.confirm("Delete?") && deleteMutation.mutate(c._id)}
                                className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-2xl flex flex-col items-center justify-center transition-all"
                            >
                                <Trash2 size={20} />
                                <span className="text-[7px] font-bold uppercase mt-1">Del</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ElectionManager;