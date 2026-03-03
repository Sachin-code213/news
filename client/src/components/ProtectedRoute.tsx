import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!user || user.role !== 'admin') {
        // Redirect them if they aren't an admin
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};