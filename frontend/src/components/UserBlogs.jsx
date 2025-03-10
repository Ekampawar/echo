import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import '../styles/UserBlogs.css';

const UserBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await api.getUserBlogs(user._id);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blogs.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const handleDelete = async (blogId) => {
    try {
      await api.deleteBlog(blogId);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      setError('Failed to delete blog.');
    }
  };

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-blogs-container">
      <h2 className="user-blogs-title">My Blogs</h2>
      <table className="blogs-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="edit-button" onClick={() => navigate(`/edit/${blog._id}`)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(blog._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserBlogs;
