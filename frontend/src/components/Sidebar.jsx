import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ setSelectedComponent }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const defaultImage = '/default-profile-pic.jpg'; // Default profile picture
  const [profileImage, setProfileImage] = useState(defaultImage);

  useEffect(() => {
    setProfileImage(user?.profilePhoto || defaultImage);
  }, [user?.profilePhoto]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="profile-avatar">
          <img
            src={profileImage}
            alt="User Avatar"
            onError={() => setProfileImage(defaultImage)}
          />
        </div>
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          <li>
            <span className="sidebar-link" onClick={() => setSelectedComponent('dashboard')}>
              Dashboard
            </span>
          </li>
          <li>
            <span className="sidebar-link" onClick={() => setSelectedComponent('userBlogs')}>
              My Blogs
            </span>
          </li>
          <li>
            <Link to="/write" className="sidebar-link">Write</Link>
          </li>
          <li>
            <Link to="/blogs" className="sidebar-link">Explore</Link>
          </li>
          {user?.role === 'admin' ? (
            <>
              <li>
                <span className="sidebar-link" onClick={() => setSelectedComponent('manageUsers')}>
                  Manage Users
                </span>
              </li>
              <li>
                <span className="sidebar-link" onClick={() => setSelectedComponent('manageBlogs')}>
                  Manage Blogs
                </span>
              </li>
              <li>
                <span className="sidebar-link" onClick={() => setSelectedComponent('manageComments')}>
                  Manage Comments
                </span>
              </li>
            </>
          ) : (
            <li>
              <span className="sidebar-link" onClick={() => setSelectedComponent('notifications')}>
                Notifications
              </span>
            </li>
          )}
          <li>
            <span className="sidebar-link" onClick={() => setSelectedComponent('accountSettings')}>
              Account Settings
            </span>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;