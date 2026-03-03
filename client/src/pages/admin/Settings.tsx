import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth, API } from '../../context/AuthContext';
import {
    Globe,
    Share2,
    Search,
    Save,
    ShieldAlert,
    Camera,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('branding');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 🚀 State for all setting fields
    const [formData, setFormData] = useState({
        siteName: '',
        footerText: '',
        facebookUrl: '',
        twitterUrl: '',
        youtubeUrl: '',
        instagramUrl: '',
        metaTitle: '',
        metaKeywords: '',
        maintenanceMode: false,
        enableComments: true
    });

    // 1. Fetch existing settings on load
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const { data } = await API.get('/api/settings');
                if (data.success) {
                    setFormData(data.data);
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // 2. Handle Save Logic
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await API.put('/api/settings', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("KhabarPoint Configuration Updated!");
        } catch (err) {
            toast.error("Failed to sync with database.");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'branding', label: 'Site Identity', icon: <Globe size={16} /> },
        { id: 'social', label: 'Social Media', icon: <Share2 size={16} /> },
        { id: 'seo', label: 'SEO & Meta', icon: <Search size={16} /> },
        { id: 'system', label: 'System', icon: <ShieldAlert size={16} /> },
    ];

    if (isLoading) return <div className="p-10 text-center animate-pulse dark:text-white">Loading System Config...</div>;

    return (
        <div className="p-6 space-y-8 transition-colors duration-300">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter dark:text-white uppercase text-slate-900">Site Configuration</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global news portal settings</p>
                </div>
                <Button
                    onClick={handleSave}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 shadow-lg shadow-red-600/20"
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </header>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <Card className="dark:bg-slate-900 dark:border-slate-800 border-none shadow-sm">
                <CardContent className="pt-8 min-h-[400px]">

                    {/* 🚀 Tab 1: Branding */}
                    {activeTab === 'branding' && (
                        <div className="max-w-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Portal Name</label>
                                <Input
                                    value={formData.siteName}
                                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                    placeholder="KhabarPoint"
                                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Footer Copyright Text</label>
                                <Input
                                    value={formData.footerText}
                                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                                    placeholder="© 2026 KhabarPoint. All Rights Reserved."
                                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* 🚀 Tab 2: Social Media */}
                    {activeTab === 'social' && (
                        <div className="max-w-2xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Facebook URL</label>
                                    <Input
                                        value={formData.facebookUrl}
                                        onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Twitter (X) URL</label>
                                    <Input
                                        value={formData.twitterUrl}
                                        onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                        placeholder="https://x.com/..."
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">YouTube Channel</label>
                                    <Input
                                        value={formData.youtubeUrl}
                                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Instagram Handle</label>
                                    <Input
                                        value={formData.instagramUrl}
                                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🚀 Tab 3: SEO Master */}
                    {activeTab === 'seo' && (
                        <div className="max-w-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Meta Title</label>
                                <Input
                                    value={formData.metaTitle}
                                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                    placeholder="KhabarPoint | Nepal's Leading News Portal"
                                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400">Meta Keywords</label>
                                <textarea
                                    value={formData.metaKeywords}
                                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm outline-none dark:text-white border dark:border-slate-700"
                                    placeholder="news, nepal, politics, tech..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}

                    {/* 🚀 Tab 4: System Toggle */}
                    {activeTab === 'system' && (
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                                <div>
                                    <p className="text-sm font-bold text-red-900 dark:text-red-400">Maintenance Mode</p>
                                    <p className="text-[10px] text-red-700/60 dark:text-red-400/60 font-medium">Take the site offline for public users</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.maintenanceMode}
                                    onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                                    className="accent-red-600 h-5 w-5"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold dark:text-white">Enable Comments</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Allow registered users to comment on news</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.enableComments}
                                    onChange={(e) => setFormData({ ...formData, enableComments: e.target.checked })}
                                    className="accent-red-600 h-5 w-5"
                                />
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;