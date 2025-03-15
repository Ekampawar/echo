import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/UserBlogs.css';

const UserBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false); // For handling delete loading

  useEffect(() => {
    if (!user?._id) {
      navigate('/login'); // Redirect to login if user is not authenticated
      return;
    }

    const fetchUserBlogs = async () => {
      try {
        const response = await api.getUserBlogs(user._id);
        console.log("Response data:", response.data); // Log response for debugging
        if (Array.isArray(response.data.data)) {  // Accessing 'data' property inside the response
          setBlogs(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
          setError('Invalid data format received');
        }        
      } catch (err) {
        setError('Failed to fetch blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user, navigate]);

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    setDeleting(true); // Set deleting state to true

    try {
      await api.deleteBlog(blogId);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      setError('Failed to delete blog.');
    } finally {
      setDeleting(false); // Reset deleting state
    }
  };

  const handleWriteBlog = () => {
    navigate('/write'); // Navigate to the create blog page
  };

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-blogs-container">
      <h2 className="user-blogs-title">My Blogs</h2>
      {blogs.length === 0 ? (
        <div>
          <p className="no-blogs-message">You haven't written any blogs yet.</p>
          <button className="write-blog-button" onClick={handleWriteBlog}>Write a Blog</button> {/* Button to navigate to blog creation */}
        </div>
      ) : (
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
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(blog._id)}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserBlogs;
