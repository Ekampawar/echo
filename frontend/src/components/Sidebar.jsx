import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css'; // Import the CSS file for styling the sidebar

const Sidebar = ({ setSelectedComponent }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <button onClick={() => setSelectedComponent('profile')}>Profile</button>
          </li>
          {user && user.role === 'admin' ? (
            <>
              <li>
                <button onClick={() => setSelectedComponent('manageUsers')}>Manage Users</button>
              </li>
              <li>
                <button onClick={() => setSelectedComponent('manageBlogs')}>Manage Blogs</button>
              </li>
              <li>
                <button onClick={() => setSelectedComponent('manageComments')}>Manage Comments</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => setSelectedComponent('userComments')}>Comments on My Blogs</button>
              </li>
            </>
          )}
          <li>
            <button onClick={() => setSelectedComponent('userBlogs')}>My Blogs</button>
          </li>
          <li>
            <button onClick={() => navigate('/write')}>Write</button>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;