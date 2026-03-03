import React from 'react';
import { Button } from '../../components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// 🚀 Use the centralized API instance instead of raw axios for automatic token handling
import { API } from '../../context/AuthContext';
import { Edit, Trash2, Plus, Eye, ExternalLink, Loader2, FileText, AlertTriangle, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ManageArticles = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // 1. Fetch all articles
    const { data: articles, isLoading, error } = useQuery({
        queryKey: ['admin-articles'],
        queryFn: async () => {
            // 🚀 Simplified: API instance already handles the Authorization header
            const { data } = await API.get('/api/articles');
            return data.articles || data.data || [];
        }
    });

    // 2. Permanent Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await API.delete(`/api/articles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
            toast.success("Article and associated media wiped from system!");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Purge failed";
            toast.error(msg);
        }
    });

    const handleConfirmDelete = (id: string) => {
        const warnMessage = "⚠️ WARNING: This will permanently delete the article text AND the image file. Proceed?";
        if (window.confirm(warnMessage)) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-red-600" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scanning Database...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl m-6 border border-red-100">
            <AlertTriangle className="mx-auto text-red-600 mb-4" size={40} />
            <p className="text-red-600 font-bold">Failed to connect to KhabarPoint API</p>
        </div>
    );

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end border-b dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Content Pipeline</h1>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                        Active Records: <span className="text-red-600">{articles?.length || 0}</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* 🚀 New: Manage Categories Shortcut */}
                    <Link to="/admin/categories" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                        <Layers size={16} /> Categories
                    </Link>

                    <Link to="/admin/articles/new" className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95">
                        <Plus size={16} /> Create Entry
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800">
                        <tr>
                            <th className="p-5">Article Preview</th>
                            <th className="p-5">Section</th>
                            <th className="p-5 text-center">Impact (Views)</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {articles?.map((article: any) => {
                            // Improved Image URL logic
                            const imageUrl = article.image?.startsWith('http')
                                ? article.image
                                : `${baseUrl}${article.image?.startsWith('/') ? '' : '/'}${article.image}`;

                            return (
                                <tr key={article._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-14 w-14 flex-shrink-0">
                                                <img
                                                    src={imageUrl}
                                                    className="h-full w-full rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                    alt=""
                                                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200')}
                                                />
                                            </div>
                                            <div className="max-w-md">
                                                <p className="text-sm font-black dark:text-slate-200 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                                                    {article.titleEn || article.title || "Untitled Article"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                        ID: {article._id.slice(-6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-[9px] font-black bg-red-50 dark:bg-red-900/10 text-red-600 px-3 py-1.5 rounded-full uppercase tracking-widest border border-red-100 dark:border-red-900/20">
                                            {article.category?.nameEn || 'National'}
                                        </span>
                                    </td>
                                    <td className="p-5 text-center">
                                        <div className="inline-flex items-center gap-1.5 text-slate-500 text-[10px] font-black bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border dark:border-slate-700">
                                            <Eye size={12} className="text-red-600" /> {article.views?.toLocaleString() || 0}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/article/${article.slug}`}
                                                target="_blank"
                                                className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                            <button
                                                onClick={() => navigate(`/admin/articles/edit/${article._id}`)}
                                                className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(article._id)}
                                                className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {!articles?.length && (
                <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Archives Empty</p>
                    <Link to="/admin/articles/new" className="mt-4 inline-block">
                        <Button className="bg-slate-900 text-white text-[10px] px-6 h-10 rounded-full font-bold uppercase tracking-widest">Draft your first story</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ManageArticles;