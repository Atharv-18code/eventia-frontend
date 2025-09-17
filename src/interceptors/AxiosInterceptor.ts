import axios from 'axios';
import toast from 'react-hot-toast';

const apiUrl = "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && error.response?.data?.error === 'Invalid token') {
            localStorage.clear();
            window.location.href = '/login';
            toast.error("Session expired. Please log in again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
