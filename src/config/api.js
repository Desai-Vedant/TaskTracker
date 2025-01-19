const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
import axios from 'axios';

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const apiEndpoints = {
    login: `${API_URL}/user/login`,
    logout: `${API_URL}/user/logout`,
    register: `${API_URL}/user/register`,
    tasks: `${API_URL}/tasks`,
};

export { apiClient };
export default API_URL;
