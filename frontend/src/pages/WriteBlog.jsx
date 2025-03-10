import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import BlogLayout from '../components/BlogLayout';
import '../styles/BlogForm.css';

const WriteBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (image, tags) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      if (!user || !user._id) throw new Error('User not authenticated.');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', user._id);
      formData.append('image', image);
      formData.append('tags', tags.join(','));

      await api.createBlog(formData); // Use FormData to handle image upload
      setSuccess('Blog published successfully.');
      setTimeout(() => navigate('/blogs'), 2000);
    } catch (err) {
      setError('Failed to publish blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogLayout title="Write a Blog" onSubmit={handleSubmit} buttonText="Publish">
      <div className="blog-editor">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <input
          type="text"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-title-input"
        />

        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="blog-content-input"
        />
      </div>
    </BlogLayout>
  );
};

export default WriteBlog;
