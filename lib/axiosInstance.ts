import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: Add request or response interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config before sending (e.g., add auth token)
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle response errors (e.g., refresh token, show error message)
    return Promise.reject(error);
  }
);

export default axiosInstance;
