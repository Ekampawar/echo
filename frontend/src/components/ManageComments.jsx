import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance'; // Import the centralized API functions
import '../styles/ManageComments.css'; // Import the CSS file for styling the manage comments page

const ManageComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.getComments(); // Use the centralized API function
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments.');
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDelete = async (commentId) => {
    try {
      await api.deleteComment(commentId); // Use the centralized API function
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <p>Access denied. Only admins can manage comments.</p>;
  }

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="manage-comments-container">
      <h2 className="manage-comments-title">Manage Comments</h2>
      <table className="comments-table">
        <thead>
          <tr>
            <th>Comment</th>
            <th>Author</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.text}</td>
              <td>{comment.author}</td>
              <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(comment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageComments;