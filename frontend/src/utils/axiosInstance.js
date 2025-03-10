import axios from "axios";

// Fetch the API URL from the environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials if using HTTP-only cookies
});

// Request Interceptor to add authorization token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage?.getItem("token"); // Optional chaining for safety
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
      if (error.response.status === 401) {
        console.warn("Token expired or unauthorized! Logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      }
    } else {
      console.error("Network/Server error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Centralized API Functions for making requests
const api = {
  // Get user profile by user ID
  getUserProfile: (userId) => axiosInstance.get(`/users/${userId}`),

  // Create a new blog post (supports images)
  createBlog: (blogData) =>
    axiosInstance.post("/blogs", blogData, {
      headers: { "Content-Type": "multipart/form-data" }, // Important for file uploads
    }),

  // Update a specific blog post (supports images)
  updateBlog: (blogId, blogData) =>
    axiosInstance.put(`/blogs/${blogId}`, blogData, {
      headers: { "Content-Type": "multipart/form-data" }, // For file uploads
    }),

  // Get a specific blog post by blog ID
  getBlog: (blogId) => axiosInstance.get(`/blogs/${blogId}`),

  // Get a list of all blogs
  getBlogs: () => axiosInstance.get("/blogs"),

  // Delete a specific blog post by blog ID
  deleteBlog: (blogId) => axiosInstance.delete(`/blogs/${blogId}`),

  // Get all comments
  getComments: () => axiosInstance.get("/comments"),

  // Delete a specific comment by comment ID
  deleteComment: (commentId) => axiosInstance.delete(`/comments/${commentId}`),

  // Get all users
  getUsers: () => axiosInstance.get("/admin/users"),

  // Delete a specific user by user ID
  deleteUser: (userId) => axiosInstance.delete(`/users/${userId}`),

  // Get current authenticated user details
  getCurrentUser: () => axiosInstance.get("/auth/user"),

  // Get blogs of a specific user by user ID
  getUserBlogs: (userId) => axiosInstance.get(`/blogs/user/${userId}`), // Fixed endpoint

  // Get comments made by a specific user by user ID
  getUserComments: (userId) => axiosInstance.get(`/users/${userId}/comments`),
};

export { axiosInstance, api };
