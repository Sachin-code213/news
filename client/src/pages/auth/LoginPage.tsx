import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AlertCircle, Lock, Mail } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        // 1. Clean the data to prevent 400 Validation Errors
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        try {
            const success = await login(cleanEmail, cleanPassword);
            if (success) {
                // 2. Redirect to the admin dashboard
                navigate('/admin');
            }
        } catch (err: any) {
            setLocalError('An unexpected error occurred. Please try again.');
        }
    };

    // Use either the local error or the error message from AuthContext
    const displayError = localError || authError;

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        KHABAR <span className="text-red-600">POINT</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Admin & Staff Login
                    </p>
                </div>

                {displayError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-pulse">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{displayError}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="Email address"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="Password"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 h-11 text-base font-bold transition-all shadow-md active:scale-95"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="text-center text-xs text-slate-400">
                    <p>Protected by KhabarPoint Security</p>
                    <Link to="/" className="mt-4 block hover:text-red-600 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;