// src/axiosInstance.js

import axios from 'axios';

// Accessing the environment variable in Vite
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export default axiosInstance;
