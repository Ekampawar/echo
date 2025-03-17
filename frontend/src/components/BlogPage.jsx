import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/axiosInstance';
import { FaThumbsUp, FaCommentAlt, FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedin, FaArrowLeft } from 'react-icons/fa';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton } from 'react-share';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import "../styles/BlogPage.css";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="spinner">
    Loading...
  </div>
);

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsLimit, setCommentsLimit] = useState(5);
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Draft-js editor state

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.getBlogBySlug(slug);
        const blogData = response.data;
        if (blogData) {
          setBlog(blogData);
          setComments(blogData.comments || []);
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const currentUserId = currentUser?.id;
          const likes = Array.isArray(blogData.likes) ? blogData.likes : [];
          setLikeCount(likes.length);
          setLiked(likes.includes(currentUserId));

          // Convert the raw content to EditorState
          if (blogData.content) {
            const contentState = convertFromRaw(JSON.parse(blogData.content));
            setEditorState(EditorState.createWithContent(contentState));
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Blog not found or an error occurred");
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const handleLikeToggle = async () => {
    if (!localStorage.getItem("token")) {
      navigate('/login');
      return;
    }

    if (!blog) return;

    try {
      const updatedLiked = !liked;
      setLiked(updatedLiked);
      setLikeCount((prevCount) => (updatedLiked ? prevCount + 1 : prevCount - 1));
      await api.likeBlog(blog._id);
    } catch (err) {
      console.error("Failed to update like:", err);
      setLiked(!liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    }
  };
  const handleAddComment = async () => {
    if (!localStorage.getItem("token")) {
      navigate('/login');
      return;
    }

    if (newComment.trim()) {
      if (newComment.trim().length < 5) {
        setError('Comment must be at least 5 characters long');
        return;
      }

      const commentData = { content: newComment.trim() }; // Ensure this structure is correct

      try {
        const response = await api.addCommentToBlog(blog._id, commentData);
        setComments([...comments, response.data]);
        setNewComment('');
        setError('');
      } catch (err) {
        console.error("Failed to add comment:", err);
        setError('Failed to add comment');
      }
    } else {
      setError('Comment cannot be empty');
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back
      </button>

      {blog && (
        <>
          <h1>{blog.title}</h1>

          {/* Render content with DraftJS Editor */}
          <div className="blog-content">
            <Editor
              editorState={editorState}
              onChange={handleEditorChange}
              readOnly={true} // Make the editor read-only to display the content
            />
          </div>

          <div className="blog-actions">
            <div className="like-section">
              <button onClick={handleLikeToggle} className={`like-button ${liked ? "liked" : ""}`}>
                <FaThumbsUp className={liked ? "liked-icon" : ""} /> {likeCount}
              </button>
            </div>
            <div className="share-section">
              <p>Share this blog:</p>
              <div className="share-buttons">
                <FacebookShareButton url={window.location.href} quote={blog.title}><FaFacebookF /></FacebookShareButton>
                <TwitterShareButton url={window.location.href} title={blog.title}><FaTwitter /></TwitterShareButton>
                <WhatsappShareButton url={window.location.href} title={blog.title}><FaWhatsapp /></WhatsappShareButton>
                <LinkedinShareButton url={window.location.href} title={blog.title}><FaLinkedin /></LinkedinShareButton>
              </div>
            </div>
          </div>

          <div className="comments-section">
            <h3><FaCommentAlt /> Comments</h3>

            {/* Comment Input Box */}
            <div className="comment-input">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {comments.slice(0, commentsLimit).map((comment, index) => (
                <div key={comment._id || index} className="comment-card">
                  <p><strong>{comment.author?.name || "Anonymous"}</strong></p>
                  <p>{comment.text}</p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small> {/* Format date & time */}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {comments.length > commentsLimit && (
              <button onClick={() => setCommentsLimit(commentsLimit + 5)}>Load More Comments</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;
