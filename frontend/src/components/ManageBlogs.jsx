import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance'; // Import the centralized API functions
import '../styles/ManageBlogs.css'; // Import the CSS file for styling the manage blogs page

const ManageBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.getBlogs(); // Use the centralized API function
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blogs.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    try {
      await api.deleteBlog(blogId); // Use the centralized API function
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      setError('Failed to delete blog.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <p>Access denied. Only admins can manage blogs.</p>;
  }

  if (loading) {
    return <p>Loading blogs...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="manage-blogs-container">
      <h2 className="manage-blogs-title">Manage Blogs</h2>
      <table className="blogs-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.author.username}</td> {/* Render the author's username */}
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="edit-button">Edit</button>
                <button className="delete-button" onClick={() => handleDelete(blog._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBlogs;