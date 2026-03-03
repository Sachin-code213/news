import React, { useState } from 'react';
import { API } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await API.post('/api/settings/contact', formData);
            setStatus('success');
            toast.success("Message sent to KhabarPoint Newsroom");
        } catch (err) {
            setStatus('idle');
            toast.error("Failed to send message.");
        }
    };

    if (status === 'success') {
        return (
            <div className="py-24 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-4xl font-black uppercase dark:text-white">Message Received!</h2>
                <p className="text-slate-500 mt-2">Our editors have been notified. Thank you for reaching out.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-red-600 font-bold uppercase text-xs tracking-widest">Send another message</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-2xl border dark:border-slate-800">
                <div className="space-y-6">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter dark:text-white">
                        Contact <span className="text-red-600">Us</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed">Have a news tip, business inquiry, or feedback? Use the form to reach our newsroom directly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Your Name" required
                        className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-red-600"
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email" placeholder="Email Address" required
                        className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-red-600"
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                        placeholder="Message" rows={4} required
                        className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-red-600"
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                    <button
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-red-600 text-white font-black uppercase rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send to KhabarPoint Team</>}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ContactPage;