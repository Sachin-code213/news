import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    Settings,
    Users,
    LogOut,
    Megaphone,
    Mail,
    Vote, // 🇳🇵 Added for Election Manager
    Bell
} from 'lucide-react';
import { useAuth, API } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // 🚀 Fetch messages to calculate unread badge count
    const { data: messages } = useQuery({
        queryKey: ['admin-messages-count'],
        queryFn: async () => {
            const { data } = await API.get('/api/settings/messages');
            return data.data;
        },
        refetchInterval: 30000,
    });

    const unreadCount = messages?.filter((m: any) => !m.isRead).length || 0;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Articles', icon: FileText, path: '/admin/articles' },
        { name: 'Inbox', icon: Mail, path: '/admin/inbox', badge: unreadCount },
        { name: 'Subscribers', icon: Users, path: '/admin/subscribers' },
        { name: 'Ad Manager', icon: Megaphone, path: '/admin/ads' },
        { name: 'Media', icon: ImageIcon, path: '/admin/media' },
        // 🇳🇵 NEW: Election Manager Link
        { name: 'Election 2082', icon: Vote, path: '/admin/election' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 h-screen flex flex-col text-white sticky top-0 transition-colors z-50">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">
                    KHABAR<span className="text-red-600">CMS</span>
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    Control Panel v1.0
                </p>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            {item.name}
                        </div>

                        {/* 🚀 DYNAMIC BADGE */}
                        {item.badge && item.badge > 0 ? (
                            <span className="bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                {item.badge > 9 ? '9+' : item.badge}
                            </span>
                        ) : null}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-slate-400 hover:bg-red-900/20 hover:text-red-500 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;