import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/axiosInstance';
import BlogLayout from '../components/BlogLayout';
import "../styles/BlogForm.css";

const EditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.getBlog(blogId);
        const { title, content, image, tags } = response.data;
        setTitle(title);
        setContent(content);
        setImage(image); // Assuming image URL is provided
        setTags(tags || []);
        if (image) setImagePreview(image); // Set preview if image is already present
      } catch (err) {
        setError('Failed to fetch blog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    setLoading(true); // Show loading state

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags.join(','));
      if (image && typeof image !== 'string') formData.append('image', image); // If image is updated

      await api.updateBlog(blogId, formData);
      setSuccess('Blog updated successfully.');
      setTimeout(() => navigate('/blogs'), 2000);
    } catch (err) {
      setError('Failed to update blog. Please try again.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  if (loading) return <p>Loading...</p>;

  const sidebarContent = (
    <div className="sidebar-controls">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button onClick={handleUpdate} className="submit-button" disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
      
      <label>Upload Image</label>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setImagePreview(URL.createObjectURL(file)); // Preview the selected image
        }}
      />
      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
      
      <label>Tags</label>
      <input
        type="text"
        value={tags.join(', ')}
        placeholder="Comma-separated tags"
        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
      />
    </div>
  );

  return (
    <BlogLayout title="Edit Blog" sidebarContent={sidebarContent}>
      <div className="blog-editor">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-title-input"
          placeholder="Edit blog title"
        />
        
        <textarea
          className="blog-content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Update your blog content..."
        />
      </div>
    </BlogLayout>
  );
};

export default EditBlog;
