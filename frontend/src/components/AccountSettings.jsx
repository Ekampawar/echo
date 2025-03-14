import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Profile.css';
import ErrorModal from './ErrorModel'; // Import ErrorModal

const AccountSettings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // State for showing error modal

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || !user._id) {
        setError('User data is missing or invalid.');
        setShowErrorModal(true); // Show the error modal
        setLoading(false);
        return;
      }

      try {
        const response = await api.getUserProfile();
        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile data.');
        setShowErrorModal(true); // Show the error modal
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size > 5 * 1024 * 1024) {
          setError('File size should be less than 5MB.');
          setShowErrorModal(true); // Show the error modal
          return;
        }

        setProfilePic(file);
      } else {
        setError('Please upload a valid image file.');
        setShowErrorModal(true); // Show the error modal
      }
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePic) {
      setError('Please select a profile picture first.');
      setShowErrorModal(true); // Show the error modal
      return;
    }

    const formData = new FormData();
    formData.append('username', profileData.username);
    formData.append('email', profileData.email);
    formData.append('profilePhoto', profilePic);

    try {
      await api.updateUserProfile(formData);
      setProfileData((prevData) => ({
        ...prevData,
        profilePhoto: `/uploads/profile_pics/${profilePic.name}`,
      }));
      setProfilePic(null);
      toast.success('Profile updated successfully!');
      setIsEditing(false); // Close the edit mode after upload
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture.');
      setShowErrorModal(true); // Show the error modal
      toast.error('Error uploading profile picture');
      console.error('Error uploading profile picture:', err);
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...profileData };

    try {
      await api.updateUserProfile(updatedData);
      toast.success('Profile saved successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile data.');
      setShowErrorModal(true); // Show the error modal
      toast.error('Error saving profile');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing
  };

  const closeErrorModal = () => {
    setShowErrorModal(false); // Close the error modal
  };

  if (loading) {
    return <div className="loader">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <h2>Account Settings</h2>

      <div className="profile-pic-section">
        <div className="profile-pic">
          <img
            src={profileData?.profilePhoto ? `http://localhost:5000${profileData.profilePhoto}` : '/default-profile-pic.jpg'}
            alt="Profile"
            className="profile-pic-image"
          />
        </div>
        {isEditing && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              id="profile-pic-upload"
              className="profile-pic-upload"
            />
            <label htmlFor="profile-pic-upload" className="change-profile-link">
              Upload a Profile Picture
            </label>
          </>
        )}
      </div>

      <div className="profile-details">
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          {isEditing ? (
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            />
          ) : (
            <span className="profile-value">{profileData.username}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          {isEditing ? (
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          ) : (
            <span className="profile-value">{profileData.email}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="profile-label">Role:</span>
          <span className="profile-value">{profileData.role}</span>
        </div>
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button onClick={handleProfilePicUpload} className="save-button">Save Profile Picture</button>
            <button onClick={handleSaveChanges} className="save-button">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </>
        ) : (
          <button onClick={handleEditClick} className="edit-button">Edit Profile</button>
        )}
      </div>

      {/* Conditionally render the ErrorModal if an error occurs */}
      {showErrorModal && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
};

export default AccountSettings;
