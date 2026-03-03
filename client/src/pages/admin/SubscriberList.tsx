import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Trash2, Mail, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const SubscriberList: React.FC = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Subscribers
    const { data: subscribers, isLoading } = useQuery({
        queryKey: ['admin-subscribers'],
        queryFn: async () => {
            const { data } = await API.get('/api/subscribers');
            return data.data;
        }
    });

    // 2. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (email: string) => {
            return API.delete(`/api/subscribers/${email}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscribers'] });
            toast.success("Subscriber removed");
        },
        onError: () => toast.error("Failed to delete subscriber")
    });

    if (isLoading) return <div className="p-10 text-center font-bold animate-pulse">Loading Audience...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Subscribers</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Newsletter Audience Management</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <span className="text-red-600 font-black text-xl">{subscribers?.length || 0}</span>
                    <span className="text-[10px] font-bold uppercase ml-2 text-slate-500">Total</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Joined</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                        {subscribers?.map((sub: any) => (
                            <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <span className="font-bold text-sm dark:text-white">{sub.email}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(sub.subscribedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => window.confirm('Remove this subscriber?') && deleteMutation.mutate(sub.email)}
                                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subscribers?.length === 0 && (
                    <div className="p-20 text-center opacity-20">
                        <Users size={48} className="mx-auto mb-4" />
                        <p className="font-black uppercase text-xs tracking-widest">No subscribers found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriberList;