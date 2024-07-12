import axios from "axios";

const refineryAPI = axios.create({
    baseURL: 'http://127.0.0.1:8002/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

refineryAPI.interceptors.request.use(
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

refineryAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error',error);
        if (error.response?.status === 401) {
            let response;
            try {
                if(!sessionStorage.getItem('refresh_token')){
                    console.log("refresh token vacío")
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error)
                }
                response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: sessionStorage.getItem('refresh_token')
                })
            } catch (authError) {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                console.log("auth error", authError)
                return Promise.reject(authError)
            }

            sessionStorage.setItem('access_token', response?.data.access)
            return refineryAPI.request(error.config)
        }
        
        return Promise.reject(error)
    });

export default refineryAPI;