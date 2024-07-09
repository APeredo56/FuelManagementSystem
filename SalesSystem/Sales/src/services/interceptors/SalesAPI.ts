import axios from "axios";

const salesAPI = axios.create({
    baseURL: 'http://127.0.0.1:8001/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});
salesAPI.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default salesAPI;