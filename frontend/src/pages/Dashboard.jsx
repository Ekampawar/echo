import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import ManageUser from '../components/ManageUser';
import ManageBlogs from '../components/ManageBlogs';
import ManageComments from '../components/ManageComments';
import UserBlogs from '../components/UserBlogs';
import UserComments from '../components/UserComments';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState('profile');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'profile':
        return <Profile />;
      case 'manageUsers':
        return <ManageUser />;
      case 'manageBlogs':
        return <ManageBlogs />;
      case 'manageComments':
        return <ManageComments />;
      case 'userBlogs':
        return <UserBlogs />;
      case 'userComments':
        return <UserComments />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <div className="dashboard-content">
        <h2>Welcome to the Dashboard</h2>
        {loading ? (
          <p>Loading user data...</p>
        ) : (
          renderComponent()
        )}
      </div>
    </div>
  );
};

export default Dashboard;