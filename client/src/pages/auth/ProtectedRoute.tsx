import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requirePro?: boolean; // If true, only isPro users can enter
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requirePro = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <Loader2 className="animate-spin text-red-600" size={40} />
            </div>
        );
    }

    // 1. Not logged in? Go to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Logged in but not Pro (and Pro is required)? Go to Upgrade page
    if (requirePro && !user.isPro) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="bg-amber-100 p-4 rounded-full">
                    <Sparkles className="text-amber-600" size={40} />
                </div>
                <h2 className="text-3xl font-black dark:text-white">Exclusive Pro Content</h2>
                <p className="text-slate-500 max-w-md">
                    This report is reserved for KhabarPoint Pro members. Upgrade your account to continue reading.
                </p>
                <button
                    onClick={() => window.location.href = '/upgrade'}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition-all"
                >
                    Upgrade Now
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;