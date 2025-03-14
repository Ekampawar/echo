import axios from "axios";

// Fetch the API URL from environment variables (assuming VITE_API_URL is set)
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
    const token = localStorage.getItem("token"); // Fetch token from localStorage
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
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    console.error("API Error:", errorMessage); // Log error message

    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Token expired or unauthorized. Logging out...");
        localStorage.removeItem("token"); // Remove token from localStorage
        window.location.href = "/login"; // Redirect to login page
      } else if (error.response.status === 500) {
        console.error("Server error, please try again later.");
      } else if (error.response.status === 403) {
        console.error("Forbidden access, please check your permissions.");
      }
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

// Centralized API functions for making requests
const api = {
  // Auth API
  login: (email, password) => axiosInstance.post("/auth/login", { email, password }),
  signup: (username, email, password) => axiosInstance.post("/auth/register", { username, email, password }),
  forgotPassword: (email) => axiosInstance.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) => axiosInstance.post(`/auth/reset-password/${token}`, { newPassword }),
  getCurrentUser: () => axiosInstance.get("/auth/user"),

  // User API
  getUserProfile: () => axiosInstance.get("/users/profile"),
  updateUserProfile: (profileData) => {
    const formData = new FormData();
    formData.append('username', profileData.username);
    formData.append('email', profileData.email);

    if (profileData.profilePic) {
      formData.append('profilePhoto', profileData.profilePic); // Only append profilePhoto if it's available
    }

    return axiosInstance.put("/users/profile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Content type for file upload
      },
    });
  },
  changePassword: (newPassword) => axiosInstance.put("/users/profile/change-password", { newPassword }),
  deleteUser: () => axiosInstance.delete("/users/profile"),

  // Admin API
  getAllUsers: () => axiosInstance.get("/admin/users"),
  deleteUserById: (userId) => axiosInstance.delete(`/admin/user/${userId}`),
  updateUserRole: (userId, role) => axiosInstance.put(`/admin/user/${userId}/role`, { role }),
  banUser: (userId) => axiosInstance.put(`/admin/user/${userId}/ban`),

  // Blog API
  createBlog: (blogData) => axiosInstance.post("/blogs", blogData),
  getBlogs: () => axiosInstance.get("/blogs"),
  getBlogById: (blogId) => axiosInstance.get(`/blogs/${blogId}`),
  updateBlog: (blogId, blogData) => axiosInstance.put(`/blogs/${blogId}`, blogData),
  deleteBlog: (blogId) => axiosInstance.delete(`/blogs/${blogId}`),
  likeBlog: (blogId) => axiosInstance.post(`/blogs/${blogId}/like`), // Merged like functionality
  getBlogsByTag: (tag) => axiosInstance.get(`/blogs/tags/${tag}`),

  // Comment API (Merging with Blog functionality)
  addCommentToBlog: (blogId, commentData) => axiosInstance.post(`/blogs/${blogId}/comments`, commentData), // Added comments inside blog routes
  getCommentsByBlogId: (blogId) => axiosInstance.get(`/blogs/${blogId}/comments`), // Get comments from the same blog endpoint
  deleteComment: (commentId) => axiosInstance.delete(`/blogs/comments/${commentId}`), // Assuming it's merged within blog

  // Blog Views API (Increment views)
  viewBlog: (slug) => axiosInstance.get(`/blogs/view/${slug}`),

  // Get blog by slug (dynamic routing)
  getBlogBySlug: (slug) => axiosInstance.get(`/blogs/slug/${slug}`),

  // Get Stats API
  getStats: () => axiosInstance.get('/stats'), // Fetch statistics (total blogs, likes, views, top blogs)
};

export { axiosInstance, api };