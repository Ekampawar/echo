import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { convertFromRaw } from "draft-js";
import "../styles/home.css";
import Footer from "../components/Footer";

// Function to render the blog content, with error handling
const renderBlogContent = (rawContent) => {
    if (!rawContent) return "No content available";
    try {
        const contentState = convertFromRaw(JSON.parse(rawContent));
        const content = contentState.getPlainText();
        return content.length > 150 ? `${content.slice(0, 150)}...` : content;
    } catch (err) {
        return "Unable to render content";
    }
};

// Reusable Swiper component for displaying blog sections
const BlogSwiper = ({ blogs }) => (
    <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }}
    >
        {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
                <div className="blog-card">
                    <h3>{blog.title}</h3>
                    <p>{renderBlogContent(blog.content)}</p>
                    <Link to={`/blogs/${blog.slug}`}>Read More →</Link>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>
);

const Home = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [mostLikedBlogs, setMostLikedBlogs] = useState([]);
    const [trendingBlogs, setTrendingBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const [featuredRes, likedRes, trendingRes] = await Promise.all([
                    api.getFeaturedBlogs(),
                    api.getMostLikedBlogs(),
                    api.getTrendingBlogs(),
                ]);

                setFeaturedBlogs(featuredRes.data.data);
                setMostLikedBlogs(likedRes.data.data);
                setTrendingBlogs(trendingRes.data.data);
            } catch (err) {
                setError(err.message || "Error fetching blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="min-h-screen">
            <Navbar />
            <section className="hero-section">
                <h1>Welcome to Our Blog Platform</h1>
                <p>Read, write, and share amazing blog posts.</p>
                <div className="hero-section-btn">
                    <Link to="/signup" className="btn get-started">Get Started</Link>
                    <Link to="/login" className="btn log-in">Log In</Link>
                </div>
            </section>

            {/* Featured Blogs Section */}
            <section className="featured-blogs">
                <h2>Featured Blogs</h2>
                {featuredBlogs.length === 0 ? (
                    <div className="empty-state">No featured blogs available 🛑</div>
                ) : (
                    <BlogSwiper blogs={featuredBlogs} />
                )}
            </section>

            {/* Two-Column Layout: Most Liked & Trending */}
            <section className="popular-blogs">
                <div className="blogs-container">
                    {/* Most Liked Blogs */}
                    <div className="blogs-section">
                        <h2>🔥 Most Liked Blogs</h2>
                        {mostLikedBlogs.length === 0 ? (
                            <div className="empty-state">No liked blogs available 🛑</div>
                        ) : (
                            <ul>
                                {mostLikedBlogs.map((blog) => (
                                    <li key={blog._id}>
                                        <Link to={`/blogs/${blog.slug}`}>
                                            <h3>{blog.title}</h3>
                                            <p>{renderBlogContent(blog.content)}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Most Trending Blogs */}
                    <div className="blogs-section">
                        <h2>🚀 Trending Blogs</h2>
                        {trendingBlogs.length === 0 ? (
                            <div className="empty-state">No trending blogs available 🛑</div>
                        ) : (
                            <ul>
                                {trendingBlogs.map((blog) => (
                                    <li key={blog._id}>
                                        <Link to={`/blogs/${blog.slug}`}>
                                            <h3>{blog.title}</h3>
                                            <p>{renderBlogContent(blog.content)}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
