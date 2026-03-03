import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Mail, Calendar, User, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

const ProWaitlist: React.FC = () => {
    // 🚀 1. Fetch the data from the Admin-only endpoint
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['admin-waitlist'],
        queryFn: async () => {
            const res = await API.get('/api/auth/pro-waitlist');
            return res.data; // Structure: { success: true, count: X, data: [...] }
        }
    });

    // 🚀 2. Extract the array safely
    const waitlistUsers = response?.data || [];

    const handleExportCSV = () => {
        if (waitlistUsers.length === 0) return toast.error("No data to export");

        const headers = ["Name", "Email", "Joined Date"];
        const rows = waitlistUsers.map((u: any) => [
            u.name,
            u.email,
            new Date(u.createdAt).toLocaleDateString()
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `khabarpoint-pro-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Waitlist exported!");
    };

    if (isLoading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Pro Waitlist</h1>
                    <p className="text-slate-500 text-sm">Manage users interested in KhabarPoint Pro ({response?.count || 0} users)</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Interested Since</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {waitlistUsers.map((user: any) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                            <User size={18} />
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail size={14} />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                </td>
                                <td className="p-5 text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {waitlistUsers.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No one has joined the waitlist yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProWaitlist;