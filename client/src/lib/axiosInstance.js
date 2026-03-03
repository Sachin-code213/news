// src/lib/axios.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000', // Your backend URL
});

// This runs before every single request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;