import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading, token } = useAuth();

    // 1. Show a loading spinner while checking auth state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 2. If no token or user is not an admin, redirect
    // Based on your DB, your role is 'admin'
    if (!token || !user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    // 3. If authenticated as admin, render the child routes
    return <Outlet />;
};

export default AdminRoute;