import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Trash2, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const MediaManager: React.FC = () => {
    const queryClient = useQueryClient();
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const { data: media, isLoading } = useQuery({
        queryKey: ['admin-media'],
        queryFn: async () => {
            const { data } = await API.get('/api/media');
            return data.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (filename: string) => {
            return API.delete(`/api/media/${filename}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-media'] });
            toast.success("File permanently deleted");
        }
    });

    const copyToClipboard = (url: string, id: string) => {
        const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        toast.info("Link copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-red-600" size={40} />
            <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Scanning Server Storage...</p>
        </div>
    );

    return (
        <div className="space-y-6 p-2">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase dark:text-white">Media Library</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Storage Assets</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-xs font-bold dark:text-slate-300">
                    {media?.length || 0} Files Total
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {media?.map((file: any) => (
                    <div key={file.name} className="group relative bg-white dark:bg-slate-900 border-2 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-red-500 dark:hover:border-red-600 transition-all">
                        <img
                            src={`${import.meta.env.VITE_API_URL || ''}${file.url}`}
                            alt={file.name}
                            className="h-32 w-full object-cover"
                        />

                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() => window.confirm("Delete this file?") && deleteMutation.mutate(file.name)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                                <a
                                    href={`${import.meta.env.VITE_API_URL || ''}${file.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white text-black h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            <Button
                                onClick={() => copyToClipboard(file.url, file.name)}
                                className="h-7 text-[9px] font-black uppercase tracking-tighter bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                                {copiedId === file.name ? <Check size={12} className="mr-1" /> : <Copy size={12} className="mr-1" />}
                                {copiedId === file.name ? 'Copied' : 'Copy Link'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {media?.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed dark:border-slate-800 rounded-3xl">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Your media library is empty</p>
                </div>
            )}
        </div>
    );
};

export default MediaManager;