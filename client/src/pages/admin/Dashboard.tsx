import React, { useEffect, useState } from 'react';
import { useAuth, API } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Users, Eye, Loader2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalArticles: 0,
        totalViews: 0,
        totalUsers: 0,
        activeAds: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/api/analytics/stats');
                // 🚀 SAFE DATA PARSING: 
                // Handles both { data: { data: stats } } and { data: stats }
                const incomingStats = res.data?.data || res.data;

                if (incomingStats) {
                    setStats({
                        totalArticles: incomingStats.totalArticles || 0,
                        totalViews: incomingStats.totalViews || 0,
                        totalUsers: incomingStats.totalUsers || 0,
                        activeAds: incomingStats.activeAds || 0,
                        chartData: Array.isArray(incomingStats.chartData) ? incomingStats.chartData : []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Articles', value: stats.totalArticles, icon: <FileText className="text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Total Views', value: stats.totalViews, icon: <Eye className="text-green-600" />, color: 'bg-green-50' },
        { label: 'Total Users', value: stats.totalUsers, icon: <Users className="text-purple-600" />, color: 'bg-purple-50' },
        { label: 'Active Ads', value: stats.activeAds, icon: <LayoutDashboard className="text-orange-600" />, color: 'bg-orange-50' },
    ];

    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
                        Welcome, {user?.name?.split(' ')[0] || 'Admin'} 👋
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">KhabarPoint News CMS Overview</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Session</p>
                    <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className={`p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${card.color}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-white rounded-2xl shadow-sm">{card.icon}</div>
                            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-tight">{card.label}</h3>
                        <div className="text-3xl font-black text-slate-900 mt-1">
                            {loading ? <Loader2 className="animate-spin h-6 w-6 text-slate-300" /> : card.value.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* CHART SECTION */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <TrendingUp size={16} className="text-blue-500" /> Traffic Trend
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Analytics for the last 7 days</p>
                    </div>
                </div>

                {/* 🚀 FIXED CONTAINER: Added min-height and overflow hidden to prevent width(-1) errors */}
                <div className="h-[350px] w-full min-h-[350px] relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                            <Loader2 className="animate-spin text-slate-300" size={40} />
                        </div>
                    ) : stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationDuration={1000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 italic text-sm">
                            No traffic data available for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Status Footer */}
            <div className="p-5 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-xl">
                        <Users size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Administrator</p>
                        <p className="text-xs font-bold">{user?.name} — <span className="text-blue-400 uppercase">{user?.role}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-6 px-4">
                    <div className="text-center md:text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Database</p>
                        <div className="text-xs text-green-400 font-bold flex items-center gap-1 justify-end">
                            <div className="h-1.5 w-1.5 bg-green-400 rounded-full" /> Connected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;