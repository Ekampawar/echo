import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setUserData(user);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>User Dashboard</h1>
          {userData ? (
            <div className="user-info">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>

              <button onClick={() => navigate('/profile')} className="btn">Edit Profile</button>
              <button onClick={handleLogout} className="btn logout-btn">Logout</button>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
