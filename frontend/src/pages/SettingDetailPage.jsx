import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated to use useNavigate
import { useAuth } from "../context/AuthContext"; // Assuming useAuth is a custom hook for user auth
import "../styles/AccountSettings.css"; // Your custom styles

const SettingDetailPage = () => {
  const { option } = useParams(); // Get the selected option from the URL
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const { user, updateUserProfile, changePassword } = useAuth(); // Assuming the user data and functions
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    profilePic: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!option) {
      navigate("/settings"); // Use navigate instead of history.push
    }
  }, [option, navigate]);

  // Handle profile change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateUserProfile(profileData);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile. Please try again.");
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    try {
      await changePassword(passwordData.newPassword);
      setSuccess("Password updated successfully!");
    } catch (err) {
      setError("Error updating password. Please try again.");
    }
  };

  // Dynamic rendering based on selected option
  const renderSelectedOption = () => {
    switch (option) {
      case "profile":
        return (
          <div>
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="profilePic">Profile Picture:</label>
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  onChange={(e) => {
                    setProfileData((prevState) => ({
                      ...prevState,
                      profilePic: e.target.files[0],
                    }));
                  }}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Save Changes</button>
            </form>
          </div>
        );
      case "password":
        return (
          <div>
            <h2>Password Settings</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="input-group">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="submit">Save Changes</button>
            </form>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2>Notification Settings</h2>
            <p>Customize your notification preferences here.</p>
            {/* Example of notification settings */}
            <label>
              <input type="checkbox" /> Email Notifications
            </label>
            <label>
              <input type="checkbox" /> Push Notifications
            </label>
            <button>Save Notifications Settings</button>
          </div>
        );
      case "security":
        return (
          <div>
            <h2>Security Settings</h2>
            <p>Update your security preferences here.</p>
            {/* Example of security settings */}
            <label>
              <input type="checkbox" /> Two-Factor Authentication
            </label>
            <button>Save Security Settings</button>
          </div>
        );
      case "legal":
        return (
          <div>
            <h2>Legal & Terms</h2>
            <p>Read our terms and privacy policy.</p>
            <a href="/terms" target="_blank">Terms of Service</a>
            <a href="/privacy-policy" target="_blank">Privacy Policy</a>
          </div>
        );
      default:
        return <p>Please select an option from the menu.</p>;
    }
  };

  return (
    <div className="account-settings-detail">
      <h1>Account Settings</h1>
      <button onClick={() => navigate("/settings")}>Back to Settings</button>

      {/* Dynamic Content based on selected option */}
      <div className="settings-content">
        {renderSelectedOption()}
      </div>
    </div>
  );
};

export default SettingDetailPage;
