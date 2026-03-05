import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth, API } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, Radio, Image as ImageIcon, Loader2, Save, FileText, Globe, Video, Newspaper, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ArticleEditor: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { token } = useAuth();
    const { lang } = useLanguage();
    const isNew = !id;

    const [titleEn, setTitleEn] = useState('');
    const [titleNe, setTitleNe] = useState('');
    const [contentEn, setContentEn] = useState('');
    const [contentNe, setContentNe] = useState('');
    const [excerptEn, setExcerptEn] = useState('');
    const [excerptNe, setExcerptNe] = useState('');
    const [category, setCategory] = useState('');
    const [isBreaking, setIsBreaking] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [type, setType] = useState<'text' | 'video'>('text');
    const [videoUrl, setVideoUrl] = useState('');

    // YouTube Metadata Fetcher
    const handleFetchYoutubeDetails = async () => {
        if (!videoUrl) return toast.warning("Please paste a YouTube URL first");
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = videoUrl.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            if (!videoId) return toast.error("Invalid YouTube URL");

            const response = await fetch(`https://www.youtube.com/oembed?url=${videoUrl}&format=json`);
            const data = await response.json();
            if (data.title) setTitleEn(data.title);

            const highResThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            setPreviewUrl(highResThumb);
            toast.success("Details fetched from YouTube!");
        } catch (error) {
            toast.error("Could not fetch video details automatically");
        }
    };

    const { data: dbCategories = [] } = useQuery({
        queryKey: ['categories-list'],
        queryFn: async () => {
            const res = await API.get(`/api/categories?t=${Date.now()}`);
            return res.data?.data || res.data?.categories || res.data || [];
        },
    });

    const { data: article, isLoading } = useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            if (isNew) return null;
            const { data } = await API.get(`/api/articles/${id}`);
            return data.data;
        },
        enabled: !isNew
    });

    useEffect(() => {
        if (article) {
            setTitleEn(article.titleEn || '');
            setTitleNe(article.titleNe || '');
            setContentEn(article.contentEn || '');
            setContentNe(article.contentNe || '');
            setExcerptEn(article.excerptEn || '');
            setExcerptNe(article.excerptNe || '');
            setCategory(article.category?._id || article.category || '');
            setIsBreaking(article.isBreaking || false);
            setIsLive(article.isLive || false);
            setPreviewUrl(article.image || null);
            setType(article.type || 'text');
            setVideoUrl(article.videoUrl || '');
        }
    }, [article]);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
            return isNew ? API.post('/api/articles', formData, config) : API.put(`/api/articles/${id}`, formData, config);
        },
        onSuccess: () => {
            toast.success(isNew ? 'Article published!' : 'Article updated!');
            queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            setTimeout(() => navigate('/admin/articles'), 1000);
        },
        onError: (error: any) => toast.error(error.response?.data?.message || "Error saving article")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return toast.warning("Please select a valid Category");

        // 🚀 DATA FIX: Prevents empty tags like <p><br></p> from being saved as "content"
        const cleanHtml = (html: string) => {
            if (!html) return "";
            const textOnly = html.replace(/<[^>]*>?/gm, '').trim();
            return textOnly.length === 0 ? "" : html;
        };

        const fd = new FormData();
        fd.append('titleEn', titleEn.trim());
        fd.append('titleNe', titleNe.trim());
        fd.append('excerptEn', excerptEn.trim());
        fd.append('excerptNe', excerptNe.trim());
        fd.append('contentEn', cleanHtml(contentEn));
        fd.append('contentNe', cleanHtml(contentNe));
        fd.append('category', category);
        fd.append('isBreaking', String(isBreaking));
        fd.append('isLive', String(isLive));
        fd.append('type', type);
        fd.append('videoUrl', videoUrl);

        if (image) {
            fd.append('image', image);
        } else if (previewUrl && (previewUrl.startsWith('http'))) {
            fd.append('image', previewUrl);
        }

        mutation.mutate(fd);
    };

    if (isLoading) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4 dark:text-white font-bold">
            <Loader2 className="animate-spin h-10 w-10 text-red-600" />
            <p className="animate-pulse tracking-widest uppercase text-xs">Syncing KhabarPoint DB...</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto p-4 pb-20 transition-all duration-300">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-2">
                        <FileText className="text-red-600 h-6 w-6" /> {isNew ? 'New Entry' : 'Update Content'}
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Globe size={10} className="text-slate-400" /> Editor Mode: <span className="text-red-600 font-black">{lang === 'en' ? 'ENGLISH' : 'NEPALI'}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" type="button" onClick={() => navigate('/admin/articles')} className="dark:text-white border-slate-200 dark:border-slate-700 h-11 px-6 font-bold uppercase text-[10px] tracking-widest">Discard</Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-black px-8 h-11 uppercase text-[10px] tracking-widest shadow-lg shadow-red-600/20" disabled={mutation.isPending}>
                        {mutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="w-4 h-4 mr-2" /> Save Article</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="dark:bg-slate-900 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm rounded-2xl">
                        <div className="flex h-14">
                            <button type="button" onClick={() => setType('text')} className={`flex-1 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all ${type === 'text' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-400'}`}>
                                <Newspaper size={14} /> News Article
                            </button>
                            <button type="button" onClick={() => setType('video')} className={`flex-1 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all ${type === 'video' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400'}`}>
                                <Video size={14} /> YouTube News
                            </button>
                        </div>
                    </Card>

                    {type === 'video' && (
                        <Card className="dark:bg-slate-900 border-red-200 dark:border-red-900 shadow-lg animate-in slide-in-from-top-3">
                            <CardHeader className="bg-red-50 dark:bg-red-950/20 py-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-600">YouTube Configuration</CardTitle>
                                <Button type="button" onClick={handleFetchYoutubeDetails} className="h-8 bg-white dark:bg-slate-800 text-red-600 border border-red-200 hover:bg-red-50 text-[9px] font-black px-4 rounded-full gap-2 shadow-sm">
                                    <Sparkles size={12} /> Auto-Fetch
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">YouTube Link</label>
                                    <Input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="dark:bg-slate-800 border-red-100 focus:ring-red-600 font-bold h-11" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="dark:bg-slate-900 dark:border-slate-800 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Metadata & Headlines</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">English Title</label>
                                    <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Headline..." className="dark:bg-slate-800 border-slate-100 dark:border-slate-700 font-bold rounded-xl h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Nepali Title</label>
                                    <Input value={titleNe} onChange={(e) => setTitleNe(e.target.value)} placeholder="शीर्षक..." className="dark:bg-slate-800 border-slate-100 dark:border-slate-700 font-bold rounded-xl h-11" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <textarea className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl h-24 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600 dark:text-white" value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} placeholder="English Summary..." />
                                <textarea className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl h-24 text-sm font-medium outline-none focus:ring-2 focus:ring-red-600 dark:text-white" value={excerptNe} onChange={(e) => setExcerptNe(e.target.value)} placeholder="नेपाली सारांश..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden border-slate-100">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Body</CardTitle>
                            <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">Editing: {lang === 'en' ? 'English' : 'Nepali'}</span>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Key added to force refresh when switching languages */}
                            <RichTextEditor
                                key={lang}
                                content={lang === 'en' ? contentEn : contentNe}
                                onChange={lang === 'en' ? setContentEn : setContentNe}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden border-slate-100">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800 py-3">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publishing Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer border border-transparent hover:border-red-100">
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-4 h-4 ${isBreaking ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                                        <span className="text-[11px] font-black uppercase tracking-tighter">Breaking News</span>
                                    </div>
                                    <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="accent-red-600 h-4 w-4" />
                                </label>
                                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer border border-transparent hover:border-red-100">
                                    <div className="flex items-center gap-2">
                                        <Radio className={`w-4 h-4 ${isLive ? 'text-red-600 animate-pulse' : 'text-slate-300'}`} />
                                        <span className="text-[11px] font-black uppercase tracking-tighter">Live Update</span>
                                    </div>
                                    <input type="checkbox" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} className="accent-red-600 h-4 w-4" />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                                <select className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[11px] font-black outline-none focus:ring-2 focus:ring-red-600 cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Choose Section</option>
                                    {dbCategories.map((cat: any) => (
                                        <option key={cat._id} value={cat._id}>{lang === 'en' ? cat.nameEn : cat.nameNe}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Header Thumbnail</label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 text-center relative rounded-[32px] hover:border-red-600 transition-all bg-slate-50/30">
                                    {previewUrl ? (
                                        <div className="relative group">
                                            <img src={previewUrl.startsWith('blob') || previewUrl.startsWith('http') ? previewUrl : `${import.meta.env.VITE_API_URL}${previewUrl}`} alt="Preview" className="h-44 w-full object-cover rounded-2xl" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-all">
                                                <p className="text-white text-[9px] font-black uppercase tracking-widest">Change Media</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center gap-2 text-slate-300">
                                            <ImageIcon className="w-8 h-8" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Upload Cover</p>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setImage(file); setPreviewUrl(URL.createObjectURL(file)); }
                                    }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
};

export default ArticleEditor;