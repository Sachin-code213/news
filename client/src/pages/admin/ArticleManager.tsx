import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, UserCircle, AlertCircle, Loader2, RefreshCcw, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { format } from 'date-fns';
import { useAuth, API } from '../../context/AuthContext';
import { toast } from 'sonner';

const ArticleManager: React.FC = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    // 🚀 IMPROVED FETCH: Includes cache busting and precise endpoint targeting
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['admin-articles'],
        queryFn: async () => {
            // Added timestamp to prevent aggressive browser caching during edits
            const { data } = await API.get(`/api/articles?limit=100&t=${Date.now()}`);
            return data;
        }
    });

    // 🚀 DATA NORMALIZATION: Multi-layer check for backend response structures
    const articles = React.useMemo(() => {
        if (!data) return [];
        // Support for: data.articles, data.data.articles, or data.data (as array)
        const list = data.articles || data.data?.articles || data.data || [];
        return Array.isArray(list) ? list : [];
    }, [data]);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return API.delete(`/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
            toast.success("Article permanently removed");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Delete operation failed");
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm("CRITICAL: Are you sure? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="relative">
                <Loader2 className="animate-spin h-12 w-12 text-red-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-red-600 rounded-full animate-ping"></div>
                </div>
            </div>
            <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">Syncing Newsroom...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 flex flex-col items-center gap-4 text-red-500 bg-red-50/50 dark:bg-red-950/10 rounded-[32px] m-4 border-2 border-dashed border-red-100 dark:border-red-900/30">
            <AlertCircle size={48} strokeWidth={1.5} />
            <div className="text-center">
                <p className="font-black text-xl uppercase tracking-tighter">Gateway Timeout</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Check Backend Connectivity (Port 5000)</p>
                <Button onClick={() => refetch()} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-black px-8 rounded-full">
                    <RefreshCcw className="mr-2 h-4 w-4" /> RECONNECT
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 dark:text-white uppercase">
                        <div className="bg-red-600 p-2 rounded-xl">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        Articles
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Management Console / {articles.length} Total Entries
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="icon"
                        className={`h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800 transition-all ${isFetching ? 'rotate-180' : ''}`}
                    >
                        <RefreshCcw className={`h-5 w-5 ${isFetching ? 'text-red-600' : 'text-slate-400'}`} />
                    </Button>
                    <Link to="/admin/articles/new">
                        <Button className="bg-slate-900 dark:bg-red-600 hover:bg-red-700 shadow-xl shadow-red-900/20 font-black tracking-widest text-[10px] h-12 px-8 rounded-2xl">
                            <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> CREATE NEW
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table Container */}
            <div className="border-2 dark:border-slate-800 rounded-[32px] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <Table>
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/50">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="w-[45%] font-black uppercase text-[10px] text-slate-400 tracking-widest p-6">Headline Content</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Visibility</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Contributor</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Published</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px] text-slate-400 tracking-widest p-6">Controls</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-32">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <FileText size={80} strokeWidth={1} />
                                        <div className="space-y-1">
                                            <p className="font-black uppercase text-sm tracking-tighter">No Articles Found</p>
                                            <p className="text-[10px] font-bold uppercase">The database is currently clear</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article: any) => (
                                <TableRow key={article._id} className="group hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all border-slate-100 dark:border-slate-800">
                                    <TableCell className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-slate-100 leading-tight mb-1 group-hover:text-red-600 transition-colors">
                                                {article.titleEn || article.title || "Untitled Article"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                                ID: {article._id.slice(-6)} • {article.category?.nameEn || 'General'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${article.status === 'published'
                                                    ? 'bg-green-500/10 text-green-600 border-green-200'
                                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                                } text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-none`}
                                        >
                                            {article.status || 'draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                                <UserCircle size={16} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-tighter text-slate-600 dark:text-slate-400">
                                                {article.author?.name || 'Staff'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-[10px] font-bold uppercase tabular-nums">
                                        {article.createdAt ? format(new Date(article.createdAt), 'MMM dd, yyyy') : '—'}
                                    </TableCell>
                                    <TableCell className="text-right p-6">
                                        <div className="flex justify-end gap-1">
                                            {/* Preview Link (Optional: if you have a public route) */}
                                            <a href={`/article/${article.slug}`} target="_blank" rel="noreferrer">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-md">
                                                    <ExternalLink className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </a>

                                            <Link to={`/admin/articles/edit/${article._id}`}>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 hover:shadow-md">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md"
                                                onClick={() => handleDelete(article._id)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ArticleManager;