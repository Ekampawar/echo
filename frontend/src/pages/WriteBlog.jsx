import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import BlogLayout from '../components/BlogLayout';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import TextToolbar from '../components/TextToolbar';
import ErrorModal from '../components/ErrorModal';
import TagInput from '../components/TagInput'; // Import the TagInput component
import "../styles/BlogForm.css";

const WriteBlog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Handle text editor changes
  const onEditorChange = (newState) => {
    setEditorState(newState);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty.');
      setShowErrorModal(true);
      return;
    }

    const content = convertToRaw(editorState.getCurrentContent());

    // Ensure the content has meaningful text
    const hasText = content.blocks.some(block => block.text.trim() !== '');
    if (!hasText) {
      setError('Content cannot be empty.');
      setShowErrorModal(true);
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    setError('');

    const blogData = {
      title,
      content: JSON.stringify(content),
      author: user?._id, // Ensure `user` is defined
      tags,  // Send tags as an array (no `.join(',')`)
    };

    console.log('Blog Data:', blogData);

    try {
      await api.createBlog(blogData); // Use the api function for creating the blog
      setLoading(false);
      setTitle('');
      setTags([]);
      setEditorState(EditorState.createEmpty());
      navigate('/blogs'); // Redirect to blogs page
    } catch (err) {
      setError('Failed to publish blog.');
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  const sidebarContent = (
    <div className="sidebar-controls">
      <div className='sidebar-header'>
        <button onClick={handlePublish} className="publish-button" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
      <div className='sidebar-body'>
        <label>Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
    </div>
  );

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
          <Editor editorState={editorState} onChange={onEditorChange} placeholder="Write your content here..." />
        </div>
      </div>

      {showErrorModal && (
        <ErrorModal message={error} onClose={() => setShowErrorModal(false)} />
      )}
    </BlogLayout>
  );
};

export default WriteBlog;
