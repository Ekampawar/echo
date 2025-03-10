import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance'; // Import the centralized API functions
import '../styles/UserComments.css'; // Import the CSS file for styling the user comments page

const UserComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const response = await api.getUserComments(user.id); // Use the centralized API function
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments.');
        setLoading(false);
      }
    };

    if (user) {
      fetchUserComments();
    }
  }, [user]);

  const handleDelete = async (commentId) => {
    try {
      await api.deleteComment(commentId); // Use the centralized API function
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-comments-container">
      <h2 className="user-comments-title">Comments on My Blogs</h2>
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

export default UserComments;