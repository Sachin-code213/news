import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const SubscriberList = () => {
    const queryClient = useQueryClient();
    const { data: subs } = useQuery({
        queryKey: ['admin-subscribers'],
        queryFn: async () => {
            const { data } = await API.get('/api/subscribers');
            return data.data;
        }
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-6">Mailing List</h1>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border dark:border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <tr>
                            <th className="p-6">Email Address</th>
                            <th className="p-6">Joined Date</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                        {subs?.map((sub: any) => (
                            <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                <td className="p-6 font-bold dark:text-white flex items-center gap-2"><Mail size={14} className="text-red-600" /> {sub.email}</td>
                                <td className="p-6 text-xs text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                <td className="p-6 text-right"><button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={16} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriberList;