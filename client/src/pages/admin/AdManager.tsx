import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API, useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, PlusCircle, ExternalLink, Megaphone, Loader2, Eye } from 'lucide-react';

const AdManager: React.FC = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        link: '',
        position: 'sidebar'
    });

    // 1. Fetch Ads with Authorization
    const { data: ads, isLoading } = useQuery({
        queryKey: ['admin-ads'],
        queryFn: async () => {
            const { data } = await API.get('/api/ads/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.data;
        }
    });

    // 2. Create Ad Mutation
    const createMutation = useMutation({
        mutationFn: (newAd: typeof formData) =>
            API.post('/api/ads', newAd, {
                headers: { Authorization: `Bearer ${token}` }
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
            setFormData({ title: '', imageUrl: '', link: '', position: 'sidebar' });
            alert("Advertisement successfully added to rotation!");
        }
    });

    // 3. Delete Ad Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            API.delete(`/api/ads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-ads'] })
    });

    return (
        <div className="space-y-8 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 border-b dark:border-slate-800 pb-4">
                <Megaphone className="h-8 w-8 text-red-600" />
                <div>
                    <h1 className="text-3xl font-black tracking-tighter dark:text-white uppercase">AD MANAGER</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Monetize KhabarPoint Content</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create New Ad Form */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-400">
                        <PlusCircle className="h-4 w-4" /> New Advertisement
                    </h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }}>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Internal Title</label>
                            <Input
                                placeholder="e.g., Sidebar Promotional"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Destination URL</label>
                            <Input
                                placeholder="https://example.com"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Banner Image URL</label>
                            <Input
                                placeholder="https://imgur.com/your-ad.png"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Placement Position</label>
                            <select
                                className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white font-medium text-sm h-10 outline-none"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            >
                                <option value="top-leaderboard">Top Leaderboard (Header)</option>
                                <option value="sidebar-top">Sidebar Top (Primary)</option>
                                <option value="sidebar-sticky">Sidebar Sticky (Bottom)</option>
                                <option value="home-middle">Home Middle (In-Feed)</option>
                                <option value="sidebar">Default Sidebar</option>
                            </select>
                        </div>
                        <Button
                            className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Launch Advertisement'}
                        </Button>
                    </form>
                </div>

                {/* 🚀 NEW: Live Preview Section */}
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-slate-400">
                        <Eye className="h-4 w-4" /> Live Preview
                    </h2>
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                        {formData.imageUrl ? (
                            <div className="w-full space-y-4">
                                <div className={`overflow-hidden rounded-xl border shadow-lg bg-white dark:bg-slate-900 ${formData.position.includes('sidebar') ? 'aspect-square' : 'h-24'}`}>
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Displaying in: {formData.position}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 font-bold italic">Enter an Image URL to see preview...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* List of Current Ads */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
                        <tr>
                            <th className="p-4 text-[10px] font-black uppercase text-slate-400">Preview</th>
                            <th className="p-4 text-[10px] font-black uppercase text-slate-400">Title & Position</th>
                            <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold animate-pulse">Syncing Ad-Server...</td></tr>
                        ) : ads?.length === 0 ? (
                            <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold italic">No active ads found.</td></tr>
                        ) : ads?.map((ad: any) => (
                            <tr key={ad._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 w-32">
                                    <img src={ad.imageUrl} alt="" className="h-12 w-20 object-cover rounded-lg border dark:border-slate-700" />
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900 dark:text-white">{ad.title}</p>
                                    <span className="text-[10px] uppercase bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded text-red-600 dark:text-red-400 font-black">
                                        {ad.position}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <a href={ad.link} target="_blank" rel="noreferrer">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><ExternalLink className="h-4 w-4" /></Button>
                                        </a>
                                        <Button
                                            variant="ghost" size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                            onClick={() => window.confirm("Delete Ad?") && deleteMutation.mutate(ad._id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdManager;