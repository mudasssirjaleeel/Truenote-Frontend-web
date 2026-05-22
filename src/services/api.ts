import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto logout on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            const currentPath = window.location.pathname;
            
            // Clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect based on where the user was
            if (currentPath.startsWith('/admin')) {
                // If on any admin page, go to admin login
                window.location.href = '/admin/login';
            } else {
                // Otherwise go to regular user login
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;