import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* 🚀 Using the imported Sidebar Component */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8">
                    {/* 🚀 This renders Dashboard, Articles, etc. based on the URL */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
