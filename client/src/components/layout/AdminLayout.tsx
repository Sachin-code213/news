import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../pages/admin/AdminSidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { AlertTriangle, Power, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
    const queryClient = useQueryClient();

    // 1. Fetch current settings
    const { data: settings } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await API.get('/api/settings');
            return data.data;
        }
    });

    // 2. Mutation to turn maintenance OFF
    const disableMaintenance = useMutation({
        mutationFn: () => API.put('/api/settings', { maintenanceMode: false }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            toast.success("Site is now LIVE");
        },
        onError: () => toast.error("Failed to disable maintenance mode")
    });

    const isMaintenanceOn = settings?.maintenanceMode;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* 🚧 Maintenance Mode Warning Banner with Quick Action */}
                {isMaintenanceOn && (
                    <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-between shadow-md z-50">
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={18} className="shrink-0 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Maintenance Mode Active: Public access restricted
                            </span>
                        </div>

                        <button
                            onClick={() => disableMaintenance.mutate()}
                            disabled={disableMaintenance.isPending}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/40 px-3 py-1 rounded-full transition-all border border-white/30 group"
                        >
                            {disableMaintenance.isPending ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Power size={12} className="group-hover:text-red-200" />
                            )}
                            <span className="text-[9px] font-black uppercase tracking-widest">Go Live</span>
                        </button>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;