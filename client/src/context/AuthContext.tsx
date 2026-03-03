import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the API instance
export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
});

// 2. The Interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🚀 Updated Interface to return objects instead of booleans
interface AuthContextType {
    user: any;
    token: string | null;
    loading: boolean;
    error: any;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await API.get('/api/auth/me');
            setUser(data.data);
        } catch (err: any) {
            console.error("❌ refreshUser Failed:", err.response?.status);
            logout();
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            await refreshUser();
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await API.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true };
        } catch (err: any) {
            // 🚀 Returns the specific "Invalid ID/Password" message from backend
            const message = err.response?.data?.message || 'Invalid email or password';
            return { success: false, message };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const { data } = await API.post('/api/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (err: any) {
            // 🚀 Returns "User already exists" message from backend
            const message = err.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            login,
            register,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};