import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/axiosInstance';
import BlogLayout from '../components/BlogLayout';
import '../styles/BlogForm.css';

const EditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.getBlog(blogId);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to fetch blog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdate = async (image, tags) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags.join(','));

      if (image) {
        formData.append('image', image);
      }

      await api.updateBlog(blogId, formData);
      setSuccess('Blog updated successfully.');
      setTimeout(() => navigate('/blogs'), 2000);
    } catch (err) {
      setError('Failed to update blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <BlogLayout title="Edit Blog" onSubmit={handleUpdate} buttonText="Update">
      <div className="blog-editor">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-title-input"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="blog-content-input"
        />
      </div>
    </BlogLayout>
  );
};

export default EditBlog;
