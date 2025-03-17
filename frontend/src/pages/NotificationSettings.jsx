import React, { useState } from "react";
import SettingsHeader from "../components/SettingsHeader"; // Import header
import "../styles/Settings.css";

const NotificationSettings = ({ setSelectedComponent }) => {
  // State for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Function to handle saving settings
  const handleSave = () => {
    console.log("Saved settings:", { emailNotifications, pushNotifications });
    alert("Notification settings updated!");
  };

  return (
    <div className="settings-page">
      {/* Back Button & Header */}
      <SettingsHeader
        title="Notification Settings"
        onBack={() => setSelectedComponent("accountSettings")}
      />
      {/* Form Container */}
      <div className="form-container">
        {/* Email Notifications */}
        <div className="form-checkbox-group">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <label>Email Notifications</label>
        </div>

        {/* Push Notifications */}
        <div className="form-checkbox-group">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <label>Push Notifications</label>
        </div>

        {/* Save Button */}
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default NotificationSettings;
