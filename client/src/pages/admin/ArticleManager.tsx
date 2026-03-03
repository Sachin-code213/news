import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, UserCircle, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { format } from 'date-fns';
import { useAuth, API } from '../../context/AuthContext';
import { toast } from 'sonner';

const ArticleManager: React.FC = () => {
    const queryClient = useQueryClient();
    const { token } = useAuth();

    // 🚀 FIXED FETCH: Added better data normalization and initial state
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-articles'],
        queryFn: async () => {
            const { data } = await API.get('/api/articles?limit=100');
            return data;
        }
    });

    // 🚀 SAFETY LOGIC: Ensure 'articles' is always an array to prevent .map errors
    const articles = Array.isArray(data?.articles)
        ? data.articles
        : (Array.isArray(data?.data?.articles) ? data.data.articles : []);

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return API.delete(`/api/articles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
            toast.success("Article deleted successfully");
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "Failed to delete article";
            toast.error(msg);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this news article?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-red-600" />
            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Synchronizing content pipeline...</p>
        </div>
    );

    if (error) return (
        <div className="p-10 flex flex-col items-center gap-4 text-red-500 bg-red-50 rounded-3xl m-4 border border-red-100">
            <AlertCircle size={40} />
            <div className="text-center">
                <p className="font-black text-xl uppercase tracking-tighter">Connection Failed</p>
                <p className="text-sm font-medium opacity-80">Check if your backend server is running on port 5000</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4">
                    <RefreshCcw className="mr-2 h-4 w-4" /> Retry Connection
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2 dark:text-white uppercase">
                        <FileText className="h-8 w-8 text-red-600" /> Articles
                    </h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        Control Center / Content Management ({articles.length} Records)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => refetch()} variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200">
                        <RefreshCcw className="h-5 w-5 text-slate-400" />
                    </Button>
                    <Link to="/admin/articles/new">
                        <Button className="bg-red-600 hover:bg-red-700 shadow-xl shadow-red-900/20 font-black tracking-widest text-[10px] h-12 px-6">
                            <Plus className="mr-2 h-4 w-4" /> NEW ARTICLE
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border-2 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[45%] font-black uppercase text-[10px] text-slate-400 tracking-widest p-6">Headline</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Status</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Author</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Date</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px] text-slate-400 tracking-widest p-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* 🚀 CRITICAL FIX: Check articles.length inside the array check */}
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-32 text-slate-400">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <FileText size={64} strokeWidth={1} />
                                        <p className="font-bold italic uppercase text-xs tracking-widest">The newsroom is currently empty</p>
                                        <p className="text-[10px] font-medium">Database cleared or connection reset.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article: any) => (
                                <TableRow key={article._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800">
                                    <TableCell className="p-6 font-bold text-slate-800 dark:text-slate-200">
                                        {article.titleEn || article.title || "Untitled Article"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`${article.status === 'published'
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-slate-400 dark:bg-slate-700'
                                                } text-[9px] font-black uppercase tracking-widest border-none`}
                                        >
                                            {article.status || 'draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[11px] font-bold text-slate-500 flex items-center gap-2 mt-4">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-600">
                                            <UserCircle size={14} />
                                        </div>
                                        {article.author?.name || 'Admin'}
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                                        {article.createdAt ? format(new Date(article.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right p-6">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/articles/edit/${article._id}`}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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