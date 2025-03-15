import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { api } from "../utils/axiosInstance";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import UserBlogs from "../components/UserBlogs";
import Notification from "../components/Notifications";
import AccountSettings from "./AccountSettings"; // Import AccountSettings

const Dashboard = () => {
  const { user, loading, error } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [stats, setStats] = useState({
    topBlogs: [],
    totalLikes: 0,
    totalViews: 0,
    totalBlogs: 0,
    totalUsers: 0, // Admin only
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (selectedComponent === "dashboard" && stats.totalBlogs === 0) {
      const fetchStats = async () => {
        try {
          setLoadingStats(true);
          if (user?.role === "admin") {
            const response = await api.getAdminStats();
            setStats({
              topBlogs: response.data.topBlogs || [],
              totalLikes: response.data.totalLikes || 0,
              totalViews: response.data.totalViews || 0,
              totalBlogs: response.data.totalBlogs || 0,
              totalUsers: response.data.totalUsers || 0, // Admin stat
            });
          } else {
            const response = await api.getUserStats(user._id);
            setStats({
              topBlogs: response.data.topBlogs || [],
              totalLikes: response.data.totalLikes || 0,
              totalViews: response.data.totalViews || 0,
              totalBlogs: response.data.totalBlogs || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching statistics:", error);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [selectedComponent, stats.totalBlogs, user]);

  // Define components for sidebar navigation
  const components = {
    dashboard: (
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Blogs</h3>
          <p>{stats.totalBlogs}</p>
        </div>
        {user?.role === "admin" && (
          <div className="dashboard-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        )}
        <div className="dashboard-card">
          <h3>Total Likes</h3>
          <p>{stats.totalLikes}</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Views</h3>
          <p>{stats.totalViews}</p>
        </div>
        <div className="dashboard-card top-blogs">
          <h3>Top Blogs</h3>
          <ul>
            {stats.topBlogs.length > 0 ? (
              stats.topBlogs.map((blog, index) => (
                <li key={index}>
                  <strong>{blog.title || "Untitled"}</strong> - {blog.likes || 0} likes, {blog.views || 0} views
                </li>
              ))
            ) : (
              <li>No blogs available</li>
            )}
          </ul>
        </div>
      </div>
    ),
    userBlogs: <UserBlogs />,
    notifications: <Notification />,
    accountSettings: <AccountSettings setSelectedComponent={setSelectedComponent} />, // Pass setSelectedComponent here
  };

  if (loading || loadingStats) return <div className="loading-message">Loading...</div>;
  if (error || !user) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <div className="dashboard-content">
        {components[selectedComponent] || components.dashboard} {/* Dynamically render the selected component */}
      </div>
    </div>
  );
};

export default Dashboard;