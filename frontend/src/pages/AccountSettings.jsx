import React from "react";
import "../styles/AccountSettings.css"; // Your custom styles

const AccountSettings = ({ setSelectedComponent }) => {
  const handleOptionSelect = (option) => {
    // Update selectedComponent state in Dashboard to show appropriate content
    setSelectedComponent(option); // This will display the content directly in the Dashboard
  };

  return (
    <div className="account-settings">
      <h1>Account Settings</h1>

      {/* Navigation Tabs */}
      <div className="settings-tabs">
        <button onClick={() => handleOptionSelect("profile")}>Edit Profile</button>
        <button onClick={() => handleOptionSelect("password")}>Password Settings</button>
        <button onClick={() => handleOptionSelect("notifications")}>Notification Settings</button>
        <button onClick={() => handleOptionSelect("security")}>Security Settings</button>
        <button onClick={() => handleOptionSelect("legal")}>Legal & Terms</button>
      </div>
    </div>
  );
};

export default AccountSettings;
