import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import BlogLayout from '../components/BlogLayout';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import TextToolbar from '../components/TextToolbar';
import ErrorModal from '../components/ErrorModal';
import TagInput from '../components/TagInput';
import "../styles/BlogForm.css";

const EditBlog = () => {
  const { blogId } = useParams(); // Extract blogId from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  console.log("Editing Blog ID:", blogId); // Debugging log

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log(`Fetching blog data for ID: ${blogId}...`);
        
        const response = await api.getBlogById(blogId); 
        console.log("API Response:", response);
    
        // Extract the correct data
        const blogData = response.data?.data || response.data;  
        console.log("Extracted Blog Data:", blogData);
    
        if (!blogData || !blogData._id) {
          console.error("Blog data is missing or invalid:", blogData);
          setError("Invalid blog data received.");
          return;
        }
    
        setTitle(blogData.title || "");
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(blogData.content))));
        setTags(blogData.tags || []);
    
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
        setError("Failed to fetch blog data.");
      }
    };    
    fetchBlog();
  }, [blogId]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      setShowErrorModal(true);
      return;
    }

    const content = convertToRaw(editorState.getCurrentContent());

    const hasText = content.blocks.some(block => block.text.trim() !== '');
    if (!hasText) {
      setError('Content cannot be empty.');
      setShowErrorModal(true);
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    setError('');

    const updatedBlogData = {
      title,
      content: JSON.stringify(content),
      author: user?._id, 
      tags,
    };

    console.log('Updated Blog Data:', updatedBlogData);

    try {
      await api.updateBlog(blogId, updatedBlogData);
      setLoading(false);
      navigate('/blogs');
    } catch (err) {
      console.error('Failed to update blog:', err);
      setError('Failed to update blog.');
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const sidebarContent = (
    <div className="sidebar-controls">
      <div className='sidebar-header'>
        <button onClick={handleUpdate} className="publish-button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Blog'}
        </button>
      </div>
      <div className='sidebar-body'>
        <label>Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
    </div>
  );

  if (error) {
    return <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />;
  }

  return (
    <BlogLayout sidebarContent={sidebarContent}>
      <div className="blog-editor">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-title-input"
          placeholder="Title"
        />
        <TextToolbar editorState={editorState} setEditorState={setEditorState} />
        <div className="editor-container">
          <Editor editorState={editorState} onChange={setEditorState} placeholder="Edit your content..." />
        </div>
      </div>
    </BlogLayout>
  );
};

export default EditBlog;