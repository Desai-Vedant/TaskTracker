import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
import axios from "axios";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and local storage
      Cookies.remove("localToken");
      Cookies.remove("token");
      localStorage.clear();

      // Redirect to login page
      Navigate("/login");
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  login: `${API_URL}/user/login`,
  logout: `${API_URL}/user/logout`,
  register: `${API_URL}/user/register`,
  tasks: `${API_URL}/tasks`,
};

export { apiClient };
export default API_URL;
