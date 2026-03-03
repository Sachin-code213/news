import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth, API } from './context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Layouts & Pages
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import StaticPage from './pages/StaticPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ContactPage from './pages/frontend/ContactPage';
import ProReportsPage from './pages/ProReportsPage';
import MaintenancePage from './pages/frontend/MaintenancePage';

// Components
import ProtectedRoute from './pages/auth/ProtectedRoute';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import ArticleManager from './pages/admin/ArticleManager';
import ArticleEditor from './pages/admin/ArticleEditor';
import AdManager from './pages/admin/AdManager';
import UsersPage from './pages/admin/UsersPage';
import Settings from './pages/admin/Settings';
import MediaManager from './pages/admin/MediaManager';
import Inbox from './pages/admin/Inbox';
import SubscriberList from './pages/admin/SubscriberList';
import ElectionManager from './pages/admin/ElectionManager'; // 🇳🇵 NEW: Import the Manager

const App: React.FC = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 🚀 1. Fetch Global Settings
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data } = await API.get('/api/settings');
      return data.data;
    }
  });

  // 🚀 2. Sync Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // 🚀 3. Maintenance Mode Logic
  const isMaintenanceActive = settings?.maintenanceMode && user?.role !== 'admin';

  if (isSettingsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
        Syncing KhabarPoint System...
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Toaster position="top-center" richColors closeButton />
      <div className="min-h-screen transition-colors duration-300 dark:bg-slate-950 bg-slate-50">
        <Routes>
          {/* 🔐 Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="articles" element={<ArticleManager />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
            <Route path="ads" element={<AdManager />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="subscribers" element={<SubscriberList />} />

            {/* 🇳🇵 NEW: Election Manager Route */}
            <Route path="election" element={<ElectionManager />} />
          </Route>

          {/* 🚪 Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {isMaintenanceActive ? (
            <Route path="*" element={<MaintenancePage />} />
          ) : (
            <>
              <Route element={<MainLayout toggleDarkMode={() => setDarkMode(!darkMode)} darkMode={darkMode} />}>
                <Route index element={<HomePage />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="article/:slug" element={<ArticlePage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="contact" element={<ContactPage />} />

                <Route
                  path="pro-reports"
                  element={
                    <ProtectedRoute requirePro={true}>
                      <ProReportsPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="about" element={<StaticPage slug="about" />} />
                <Route path="privacy" element={<StaticPage slug="privacy" />} />
                <Route path="terms" element={<StaticPage slug="terms" />} />
                <Route path="advertise" element={<StaticPage slug="advertise" />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </LanguageProvider>
  );
};

export default App;