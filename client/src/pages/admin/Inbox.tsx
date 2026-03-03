import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { Mail, Clock, CheckCircle, Trash2, Loader2, MessageSquareReply, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';

const Inbox = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Messages
    const { data: messages, isLoading } = useQuery({
        queryKey: ['admin-messages'],
        queryFn: async () => {
            const { data } = await API.get('/api/settings/messages');
            return data.data;
        }
    });

    // 2. Mutation: Update Status (supports read, replied, unread)
    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            // 🚀 FIX: Use backticks (`) so ${id} works. 
            // Single quotes (') will send the literal text "${id}" to the server.
            return API.patch(`/api/settings/messages/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
            // toast.success("Status updated!"); // Optional: add success feedback
        },
        onError: (error: any) => {
            console.error("Mutation Error:", error.response?.data || error.message);
            toast.error("Failed to update message status");
        }
    });

    // 3. Mutation: Delete Message
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return API.delete(`/api/settings/messages/${id}`);
        },
        onSuccess: () => {
            toast.success("Message permanently removed");
            queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
            queryClient.invalidateQueries({ queryKey: ['admin-messages-count'] });
        },
        onError: () => toast.error("Could not delete message. Try again.")
    });

    const handleReply = (msg: any) => {
        const subject = encodeURIComponent(`Re: Inquiry from ${msg.name} - KhabarPoint`);
        const body = encodeURIComponent(`\n\n--- Original Message ---\nFrom: ${msg.email}\n${msg.message}`);
        window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
        statusMutation.mutate({ id: msg._id, status: 'replied' });
    };

    if (isLoading) return (
        <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={40} />
            <p className="font-black uppercase text-xs tracking-widest text-slate-400">Opening Newsroom Inbox...</p>
        </div>
    );

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Inbox</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reader Tips & Contact Inquiries</p>
                </div>
            </div>

            <div className="grid gap-4">
                {messages?.map((msg: any) => {
                    const isUnread = msg.status === 'unread';
                    const isReplied = msg.status === 'replied';

                    return (
                        <div
                            key={msg._id}
                            className={`group relative p-6 rounded-[32px] border-2 transition-all cursor-default ${isUnread
                                ? 'bg-white dark:bg-slate-900 border-red-100 dark:border-red-900/30 shadow-xl shadow-red-600/5'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-80'
                                }`}
                        >
                            {isUnread && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full border-4 border-white dark:border-slate-950 animate-pulse" />
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xl ${isUnread ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {msg.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black dark:text-white uppercase tracking-tight">{msg.name}</h3>
                                            {isReplied && (
                                                <Badge variant="outline" className="text-[8px] bg-green-50 text-green-600 border-green-200">
                                                    Replied
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">{msg.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                        <Clock size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {/* 👁️ Toggle Read/Unread Status */}
                                        <button
                                            onClick={() => statusMutation.mutate({ id: msg._id, status: isUnread ? 'read' : 'unread' })}
                                            className={`p-2 rounded-full transition-all ${isUnread ? 'text-slate-300 hover:text-green-600 hover:bg-green-50' : 'text-green-600 bg-green-50 hover:bg-slate-100'}`}
                                            title={isUnread ? "Mark as Read" : "Mark as Unread"}
                                        >
                                            {isUnread ? <Eye size={18} /> : <CheckCircle size={18} />}
                                        </button>

                                        <button
                                            onClick={() => handleReply(msg)}
                                            className="p-2 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                                            title="Reply to Reader"
                                        >
                                            <MessageSquareReply size={18} />
                                        </button>

                                        {/* 🗑️ Delete Message Button */}
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Are you sure? This action cannot be undone.")) {
                                                    deleteMutation.mutate(msg._id);
                                                }
                                            }}
                                            className="p-2 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-2xl text-sm leading-relaxed ${isUnread
                                ? 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}

                {messages?.length === 0 && (
                    <div className="py-40 text-center space-y-4 opacity-30">
                        <Mail size={64} className="mx-auto" strokeWidth={1} />
                        <p className="font-black uppercase tracking-widest text-xs">Your inbox is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;