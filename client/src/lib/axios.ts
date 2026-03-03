import axios from 'axios';

// 🚀 Use the environment variable for production, fallback to localhost for dev
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export default api;