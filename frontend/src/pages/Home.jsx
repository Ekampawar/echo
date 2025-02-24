import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Blog Platform</h1>
        <p className="mt-2 text-lg">Read, write, and share amazing blog posts.</p>
        <div className="mt-6">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold mr-4"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-white px-6 py-2 rounded-md font-semibold"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Featured Blogs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Example Blog Post Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">How to Build a Blog Platform</h3>
            <p className="text-gray-600 mt-2">
              Learn how to create a full-stack blog using React and Node.js.
            </p>
            <Link to="/blogs/1" className="text-blue-600 mt-4 block font-semibold">
              Read More →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">The Power of JavaScript</h3>
            <p className="text-gray-600 mt-2">
              Explore why JavaScript remains the backbone of web development.
            </p>
            <Link to="/blogs/2" className="text-blue-600 mt-4 block font-semibold">
              Read More →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Mastering React Hooks</h3>
            <p className="text-gray-600 mt-2">
              A deep dive into useState, useEffect, and custom hooks.
            </p>
            <Link to="/blogs/3" className="text-blue-600 mt-4 block font-semibold">
              Read More →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;