import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../utils/axiosInstance"; 
import { convertFromRaw } from 'draft-js';
import "../styles/BlogPage.css";

const BlogPage = () => {
    const { slug } = useParams();  // Get slug from URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.getBlogBySlug(slug);
                setBlog(response.data);  // Assume response contains a single blog object
                setLoading(false);
            } catch (err) {
                setError('Failed to load blog');
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const renderBlogContent = (rawContent) => {
        try {
            const contentState = convertFromRaw(JSON.parse(rawContent));
            return contentState.getPlainText();
        } catch (err) {
            console.error("Error rendering content:", err);
            return "Unable to display content";
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="blog-page">
            <h1>{blog.title}</h1>
            <div>{renderBlogContent(blog.content)}</div>
        </div>
    );
};

export default BlogPage;
