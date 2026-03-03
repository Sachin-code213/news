import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🚀 result is an object: { success: boolean, message: string }
            const result = isLogin
                ? await login(formData.email, formData.password)
                : await register(formData.name, formData.email, formData.password);

            console.log("📩 Auth Result:", result); // Debugging log

            if (result.success) {
                toast.success(isLogin ? "Welcome back!" : "Account created!");
                onClose();
            } else {
                // ✅ This is where the message is shown
                toast.error(result.message || "Authentication failed", {
                    description: isLogin ? "Invalid ID or Password" : "User already exists",
                });
            }
        } catch (err) {
            toast.error("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                        {isLogin ? "Welcome Back" : "Join KhabarPoint"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {isLogin
                            ? "Login to manage your Pro waitlist status."
                            : "Create an account to join the Pro waitlist."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative animate-in slide-in-from-top-2 duration-300">
                            <User className="absolute left-4 top-4 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-red-500 transition-all text-slate-900 dark:text-white"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-red-500 transition-all text-slate-900 dark:text-white"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-red-500 transition-all text-slate-900 dark:text-white"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Create Account")}
                    </button>
                </form>

                {/* Toggle Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2 w-full"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;