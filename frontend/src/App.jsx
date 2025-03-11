import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import WriteBlog from './pages/WriteBlog';
import EditBlog from './pages/EditBlog';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/write" element={<WriteBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
