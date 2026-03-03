import React, { useState } from 'react';
import { API } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Send, Eye, Loader2, CheckCircle, PartyPopper, AlertCircle } from 'lucide-react';

const NewsletterManager: React.FC = () => {
    const [mailData, setMailData] = useState({ subject: '', body: '', testEmail: '' });
    const [loading, setLoading] = useState(false);
    const [lastBroadcast, setLastBroadcast] = useState<{ count: number; date: Date } | null>(null);

    const handlePreview = async () => {
        if (!mailData.testEmail || !mailData.subject) {
            return toast.error("Please enter a subject and a test email address");
        }
        setLoading(true);
        try {
            await API.post('/api/subscribers/preview', mailData);
            toast.success("Preview Dispatch Successful", {
                description: "The draft has been sent to your test inbox."
            });
        } catch (err) {
            toast.error("Preview Failed", {
                description: "Check your SMTP settings in the backend."
            });
        } finally { setLoading(false); }
    };

    const handleBroadcast = async () => {
        if (!mailData.subject || !mailData.body) return toast.error("Newsletter is empty!");
        if (!window.confirm("Confirm Broadcast: This will send an email to all active subscribers.")) return;

        setLoading(true);
        try {
            const { data } = await API.post('/api/subscribers/broadcast', mailData);

            // 🚀 Professional Success State
            setLastBroadcast({ count: data.count || 0, date: new Date() });
            setMailData({ ...mailData, subject: '', body: '' }); // Clear form on success

            toast.success("Broadcast Dispatched", {
                description: `Thank you, Admin! Your message has been successfully sent to ${data.count} subscribers.`,
                icon: <PartyPopper className="text-amber-500" />
            });
        } catch (err: any) {
            // 🚀 Graceful Error Handling
            const errorMessage = err.response?.data?.message || "The mail server is currently unresponsive.";
            toast.error("Dispatch Interrupted", {
                description: `${errorMessage} Please verify your SMTP credentials.`
            });
        } finally { setLoading(false); }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
                        Newsroom <span className="text-red-600">Broadcast</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Professional Newsletter Distribution System</p>
                </div>
                {lastBroadcast && (
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-800">
                        <CheckCircle size={12} /> Last Sent: {lastBroadcast.count} Readers
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <input
                            className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 outline-none focus:border-red-600 dark:focus:border-red-600 dark:text-white font-bold transition-all shadow-sm"
                            placeholder="Compelling Subject Line..."
                            value={mailData.subject}
                            onChange={e => setMailData({ ...mailData, subject: e.target.value })}
                        />
                    </div>
                    <textarea
                        className="w-full p-8 rounded-[32px] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 outline-none focus:border-red-600 dark:focus:border-red-600 dark:text-white h-[500px] font-serif text-lg leading-relaxed shadow-sm transition-all"
                        placeholder="Write your professional newsletter here. HTML templates are supported..."
                        value={mailData.body}
                        onChange={e => setMailData({ ...mailData, body: e.target.value })}
                    />
                </div>

                <div className="space-y-6">
                    {/* Preview Box */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">Quality Control</h4>
                            <p className="text-[10px] text-slate-500 font-medium italic">Send a test to yourself before broadcasting.</p>
                        </div>

                        <input
                            className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:text-white"
                            placeholder="admin@khabarpoint.com"
                            value={mailData.testEmail}
                            onChange={e => setMailData({ ...mailData, testEmail: e.target.value })}
                        />

                        <button
                            onClick={handlePreview}
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : <><Eye size={16} /> Preview Draft</>}
                        </button>
                    </div>

                    {/* Broadcast Button */}
                    <div className="space-y-4">
                        <button
                            onClick={handleBroadcast}
                            disabled={loading}
                            className="w-full py-8 bg-red-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 hover:bg-red-700 hover:-translate-y-1 active:translate-y-0 transition-all flex flex-col items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <Send size={24} />
                                    <span>Release to Audience</span>
                                </>
                            )}
                        </button>
                        <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-tighter px-4">
                            By clicking broadcast, you are sending emails to all verified subscribers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterManager;