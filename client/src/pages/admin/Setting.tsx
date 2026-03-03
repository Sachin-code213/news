import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Switch } from '../../components/ui/switch';
import { Loader2, Construction, Globe, Search, Save } from 'lucide-react';

const Settings = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        siteName: '',
        siteDescription: '',
        maintenanceMode: false
    });

    // 1. Fetch current settings
    const { data: settings, isLoading: isFetching } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const { data } = await API.get('/api/settings');
            return data.data;
        }
    });

    // Sync fetched data to local state
    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || '',
                siteDescription: settings.siteDescription || '',
                maintenanceMode: settings.maintenanceMode || false
            });
        }
    }, [settings]);

    // 2. Setup the Mutation 
    const updateSettingsMutation = useMutation({
        mutationFn: (newSettings: any) => API.put('/api/settings', newSettings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            toast.success("Settings saved successfully");
        },
        onError: () => toast.error("Failed to update settings")
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettingsMutation.mutate(formData);
    };

    const handleMaintenanceToggle = (enabled: boolean) => {
        // Update local state and immediately trigger mutation for the toggle
        setFormData(prev => ({ ...prev, maintenanceMode: enabled }));
        updateSettingsMutation.mutate({ ...formData, maintenanceMode: enabled });
    };

    if (isFetching) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter dark:text-white text-slate-900">System Settings</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Configuration & Controls</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* 🚧 Maintenance Mode Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600">
                                <Construction size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold dark:text-white text-slate-800">Maintenance Mode</h3>
                                <p className="text-xs text-slate-500">Block public access while updating the site.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {updateSettingsMutation.isPending && <Loader2 size={16} className="animate-spin text-slate-400" />}
                            <Switch
                                disabled={updateSettingsMutation.isPending}
                                checked={formData.maintenanceMode}
                                onCheckedChange={handleMaintenanceToggle}
                            />
                        </div>
                    </div>
                </div>

                {/* 🌍 General Settings Section */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="text-blue-500" size={20} />
                        <h3 className="font-black uppercase text-sm tracking-widest dark:text-white">General Info</h3>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Site Title</label>
                            <input
                                type="text"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 text-sm font-bold outline-none transition-all dark:text-white"
                                placeholder="e.g., KhabarPoint"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">SEO Description</label>
                            <textarea
                                rows={3}
                                value={formData.siteDescription}
                                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 text-sm font-bold outline-none transition-all dark:text-white"
                                placeholder="Describe your news portal..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updateSettingsMutation.isPending}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all disabled:opacity-50"
                    >
                        {updateSettingsMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;