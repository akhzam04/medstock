import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there's no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/users/auth/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('token', access);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (error) {
                // If refresh fails, logout the user
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await api.post('/users/auth/token/', { username, password });
        return response.data;
    },
    verifyToken: async () => {
        const response = await api.post('/users/auth/token/verify/', {
            token: localStorage.getItem('token')
        });
        return response.data;
    },
    refreshToken: async () => {
        const response = await api.post('/users/auth/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
        });
        return response.data;
    },
};

// Medicines API
export const medicinesAPI = {
    getAll: async () => {
        const response = await api.get('/inventory/medicines/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/inventory/medicines/${id}/`);
        return response.data;
    },
    create: async (medicine: any) => {
        const response = await api.post('/inventory/medicines/', medicine);
        return response.data;
    },
    update: async (id: number, medicine: any) => {
        const response = await api.put(`/inventory/medicines/${id}/`, medicine);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/inventory/medicines/${id}/`);
        return response.data;
    },
};

// Patients API
export const patientsAPI = {
    getAll: async () => {
        const response = await api.get('/prescriptions/patients/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/prescriptions/patients/${id}/`);
        return response.data;
    },
    create: async (patient: any) => {
        const response = await api.post('/prescriptions/patients/', patient);
        return response.data;
    },
    update: async (id: number, patient: any) => {
        const response = await api.put(`/prescriptions/patients/${id}/`, patient);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/prescriptions/patients/${id}/`);
        return response.data;
    },
};

// Prescriptions API
export const prescriptionsAPI = {
    getAll: async () => {
        const response = await api.get('/prescriptions/prescriptions/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/prescriptions/prescriptions/${id}/`);
        return response.data;
    },
    create: async (prescription: any) => {
        const response = await api.post('/prescriptions/prescriptions/', prescription);
        return response.data;
    },
    update: async (id: number, prescription: any) => {
        const response = await api.put(`/prescriptions/prescriptions/${id}/`, prescription);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/prescriptions/prescriptions/${id}/`);
        return response.data;
    },
};

// Inventory API
export const inventoryAPI = {
    getAll: async () => {
        const response = await api.get('/inventory/stock-movements/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`/inventory/stock-movements/${id}/`);
        return response.data;
    },
    create: async (movement: any) => {
        const response = await api.post('/inventory/stock-movements/', movement);
        return response.data;
    },
    update: async (id: number, movement: any) => {
        const response = await api.put(`/inventory/stock-movements/${id}/`, movement);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/inventory/stock-movements/${id}/`);
        return response.data;
    },
};

export default api;
