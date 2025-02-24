import { Link } from "react-router-dom";
import "../styles/home.css"; // Don't forget to import the CSS file

const Home = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to Our Blog Platform</h1>
        <p>Read, write, and share amazing blog posts.</p>
        <div className="hero-section-btn">
          <Link to="/signup" className="btn get-started">
            Get Started
          </Link>
          <Link to="/login" className="btn log-in">
            Log In
          </Link>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="featured-blogs">
        <h2>Featured Blogs</h2>
        <div className="blog-cards">
          {/* Example Blog Post Card */}
          <div className="blog-card">
            <h3>How to Build a Blog Platform</h3>
            <p>Learn how to create a full-stack blog using React and Node.js.</p>
            <Link to="/blogs/1">Read More →</Link>
          </div>

          <div className="blog-card">
            <h3>The Power of JavaScript</h3>
            <p>Explore why JavaScript remains the backbone of web development.</p>
            <Link to="/blogs/2">Read More →</Link>
          </div>

          <div className="blog-card">
            <h3>Mastering React Hooks</h3>
            <p>A deep dive into useState, useEffect, and custom hooks.</p>
            <Link to="/blogs/3">Read More →</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
