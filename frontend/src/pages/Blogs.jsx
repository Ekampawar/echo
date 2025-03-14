import React, { useState, useEffect } from 'react';
import { api } from "../utils/axiosInstance"; // Importing the api object
import { Link } from 'react-router-dom';
import { convertFromRaw } from 'draft-js';
import Navbar from "../components/Navbar";
import "../styles/Blogs.css";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.getBlogs(); // Using the correct API function
                setBlogs(response.data.data);  // Set blogs data
                setLoading(false);
            } catch (err) {
                setError('Failed to load blogs. Please try again later.');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const renderBlogContent = (rawContent) => {
        try {
            const contentState = convertFromRaw(JSON.parse(rawContent));
            const content = contentState.getPlainText();
            return content.length > 150 ? `${content.slice(0, 150)}...` : content; // Display a preview
        } catch (err) {
            return "Unable to render content";
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>; // Optionally replace with a spinner
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            {blogs.length === 0 ? (
                <p>No blogs available.</p>
            ) : (
                <div className="blog-list">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="blog-card">
                            <h2>{blog.title}</h2>
                            <p>{renderBlogContent(blog.content)}</p>
                            <Link to={`/blogs/${blog.slug}`} className="read-more">
                                Read more...
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;