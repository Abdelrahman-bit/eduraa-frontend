import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
   baseURL,
   withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
   if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
   }
   return config;
});

apiClient.interceptors.response.use(
   (response) => response,
   (error) => {
      // Extract error message from various possible locations
      const message =
         error.response?.data?.message ||
         error.response?.data?.error?.message ||
         error.message ||
         'Something went wrong, please try again';

      // Log the full error in development for debugging
      if (process.env.NODE_ENV === 'development') {
         console.error('API Error:', {
            message,
            status: error.response?.status,
            data: error.response?.data,
            fullError: error,
         });
      }

      return Promise.reject(new Error(message));
   }
);
