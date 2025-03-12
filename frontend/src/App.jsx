import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';  // Make sure this is correctly imported
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import WriteBlog from './pages/WriteBlog';
import EditBlog from './pages/EditBlog';
import Blogs from './pages/Blogs';
import BlogPage from './pages/BlogPage'; 
import PrivateRoute from './context/PrivateRoute';  // Import PrivateRoute

function App() {
  return (
    <Router>
      <AuthProvider>  {/* Wrap the routes with AuthProvider */}
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPage />} />
          {/* Private Pages */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/write" element={<PrivateRoute><WriteBlog /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
