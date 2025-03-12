import axios from "axios";

// Fetch the API URL from the environment variables (assuming VITE_API_URL is set)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json", // Default content type for JSON data
  },
  withCredentials: true, // Include credentials (cookies) in requests (e.g., for authentication)
});

// Request Interceptor to add the authorization token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Fetch token from localStorage (if available)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error); // Log request error if any
    return Promise.reject(error); // Reject promise if error occurs
  }
);

// Response Interceptor to handle API response errors
axiosInstance.interceptors.response.use(
  (response) => response, // Return response directly if successful
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data); // Log error response
      // Handle token expiration (401 error)
      if (error.response.status === 401) {
        console.warn("Token expired or unauthorized. Logging out...");
        localStorage.removeItem("token"); // Remove token from localStorage
        window.location.href = "/login"; // Redirect to login page
      }
    } else {
      console.error("Network/Server Error:", error.message); // Log network/server errors
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

// Centralized API functions for making requests
const api = {
  // Get user profile by user ID
  getUserProfile: (userId) => axiosInstance.get(`/users/${userId}`),

  // Create a new blog post
  createBlog: (blogData) => axiosInstance.post("/blogs", blogData),

  // Update a specific blog post
  updateBlog: (blogId, blogData) => axiosInstance.put(`/blogs/${blogId}`, blogData),

  // Get a specific blog post by blog ID
  getBlogById: (blogId) => axiosInstance.get(`/blogs/${blogId}`),

  // Get a list of all blogs
  getBlogs: () => axiosInstance.get("/blogs"),

  // Delete a specific blog post by blog ID
  deleteBlog: (blogId) => axiosInstance.delete(`/blogs/${blogId}`),

  // Get all comments
  getComments: () => axiosInstance.get("/comments"),

  // Delete a specific comment by comment ID
  deleteComment: (commentId) => axiosInstance.delete(`/comments/${commentId}`),

  // Get all users (Admin)
  getUsers: () => axiosInstance.get("/admin/users"),

  // Delete a specific user by user ID (Admin)
  deleteUser: (userId) => axiosInstance.delete(`/users/${userId}`),

  // Get current authenticated user details
  getCurrentUser: () => axiosInstance.get("/auth/user"),

  // Get blogs of a specific user by user ID
  getUserBlogs: (userId) => axiosInstance.get(`/blogs/user/${userId}`),

  // Get comments made by a specific user by user ID
  getUserComments: (userId) => axiosInstance.get(`/users/${userId}/comments`),

  // Get blog by slug (for dynamic routing, if slug is used)
  getBlogBySlug: (slug) => axiosInstance.get(`/blogs/slug/${slug}`),
};

export { axiosInstance, api };
