import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance'; // Import the centralized API functions
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  console.log('Current user:', user); // Debugging statement to check the user object

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('Fetching profile data for user:', user); // Log the user object
        const response = await api.getUserProfile(user._id);
        console.log('Profile data fetched:', response.data); // Log the response data
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err); // Log the error
        setError('Failed to fetch profile data.');
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{profileData.username}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{profileData.email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Role:</span>
          <span className="profile-value">{profileData.role}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;