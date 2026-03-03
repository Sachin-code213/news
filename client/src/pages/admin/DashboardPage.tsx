import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, API } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, FileText, Users, Zap, TrendingUp, Newspaper, Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    // 🚀 Using TanStack Query with the authenticated API instance
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // This API instance already has the token interceptor attached
            const { data } = await API.get('/api/analytics/stats');
            return data.data;
        }
    });

    // Chart Data (Can be made dynamic once you have a history API)
    const chartData = [
        { name: 'Mon', visits: 400 },
        { name: 'Tue', visits: 300 },
        { name: 'Wed', visits: 900 },
        { name: 'Thu', visits: 780 },
        { name: 'Fri', visits: 1080 },
        { name: 'Sat', visits: 2390 },
        { name: 'Sun', visits: 3490 },
    ];

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">
                    Syncing KhabarPoint Analytics...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Command Center</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Welcome back, <span className="text-red-600 font-bold">{user?.name}</span>. Here is your news performance.
                    </p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 border">
                    Server Status: <span className="text-green-600">Online</span>
                </div>
            </header>

            {/* --- TOP STAT CARDS --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-600 shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{stats?.totalViews?.toLocaleString() || '0'}</div>
                        <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> Live Tracking
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-500">Breaking News</CardTitle>
                        <Zap className="h-4 w-4 text-red-600 fill-current" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{stats?.activeBreaking || '0'}</div>
                        <p className="text-[10px] text-slate-400 font-bold italic mt-1">Active on Ticker</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Articles</CardTitle>
                        <Newspaper className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{stats?.totalArticles || '0'}</div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Published Content</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-600 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-500">Users</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{stats?.totalUsers || '0'}</div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Staff & Authors</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- VISUAL OVERVIEW --- */}
            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-2 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b py-3">
                        <CardTitle className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Weekly Traffic Pulse</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-bold" />
                                    <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="visits" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-2 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b py-3">
                        <CardTitle className="text-[10px] uppercase tracking-widest text-slate-500 font-black">System Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-blue-900">Bilingual Engine</p>
                                <p className="text-[10px] text-blue-700 font-medium">English/Nepali Syncing Active</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-red-50 rounded-xl border border-red-100">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                <Zap className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-red-900">Live Updates</p>
                                <p className="text-[10px] text-red-700 font-medium">News Ticker currently live</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white">
                            <p className="text-[10px] font-black uppercase text-red-500 mb-2 tracking-tighter">Security Protocol</p>
                            <p className="text-xs font-medium opacity-80 leading-relaxed">
                                Access granted to <span className="text-green-400">{user?.role}</span>. JWT Token verified.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;