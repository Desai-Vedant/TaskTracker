const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiEndpoints = {
    login: `${API_URL}/user/login`,
    logout: `${API_URL}/user/logout`,
    register: `${API_URL}/user/register`,
    tasks: `${API_URL}/tasks`,
};

export default API_URL;
