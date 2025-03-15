import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/axiosInstance';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { FaThumbsUp, FaCommentAlt, FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedin, FaArrowLeft } from 'react-icons/fa'; // Import back arrow icon
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton } from 'react-share';
import "../styles/BlogPage.css";

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); // Using useNavigate hook for navigation
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog with slug:', slug); // Log slug to confirm it's correct
        const response = await api.getBlogBySlug(slug);
        console.log('Fetched blog data:', response.data); // Log the response data
        const blogData = response.data;
  
        if (blogData && blogData.content) {
          const contentState = convertFromRaw(JSON.parse(blogData.content));
          setEditorState(EditorState.createWithContent(contentState));
          setBlog(blogData);
          setComments(blogData.comments || []);
  
          // Log likes data
          console.log('Likes data:', blogData.likes); // Log likes data
  
          // Count the likes based on the keys in the likes object
          const likes = Array.isArray(blogData.likes) ? blogData.likes : [];
          setLikeCount(likes.length);
          setLiked(likes.includes(currentUserId)); // Check if the current user has liked the blog
        }
  
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found or an error occurred');
        setLoading(false);
      }
    };
  
    if (slug) {
      fetchBlog();
    }
  }, [slug]);
  

  const handleLikeToggle = async () => {
    if (!localStorage.getItem("token")) {
      // Redirect to login if not authenticated
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
      return;
    }

    if (!blog) return;

    try {
      const updatedLiked = !liked;
      console.log('Toggling like:', updatedLiked); // Log like toggle state
      setLiked(updatedLiked); // Optimistic UI update
      setLikeCount((prevCount) => (updatedLiked ? prevCount + 1 : prevCount - 1));

      await api.likeBlog(blog._id); // Send request to backend
    } catch (err) {
      console.error("Failed to update like:", err);
      setLiked(!liked); // Revert UI if request fails
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    }
  };

  const handleAddComment = async () => {
    if (!localStorage.getItem("token")) {
      // If user is not logged in, redirect to login
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
      return;
    }

    if (newComment.trim()) {
      console.log('Adding comment:', newComment); // Log new comment text
      try {
        const response = await api.addCommentToBlog(blog._id, { text: newComment });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (err) {
        console.error('Failed to add comment:', err);
        setError('Failed to add comment');
      }
    } else {
      console.log('Comment cannot be empty');
      setError('Comment cannot be empty');
    }
  };

  if (loading) {
    console.log('Blog is loading...');
    return <p>Loading...</p>;
  }

  if (error) {
    console.log('Error:', error); // Log error message
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      {/* Back Arrow to go to the previous page */}
      <button onClick={() => {
        console.log('Navigating back to previous page...');
        navigate(-1);
      }} className="back-button">
        <FaArrowLeft /> Back
      </button>

      {blog && (
        <>
          <h1>{blog.title}</h1>
          <div className="editor-container">
            <Editor editorState={editorState} readOnly={true} />
          </div>

          {/* Like and Share Section */}
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

          {/* Comments Section */}
          <div className="comments-section">
            <h3><FaCommentAlt /> Comments</h3>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;
