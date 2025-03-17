// src/pages/NotificationSettings.js
import React from "react";
import SettingsHeader from "../components/SettingsHeader"; // Import header
import "../styles/Settings.css";

const NotificationSettings = ({ setSelectedComponent }) => {
  return (
    <div className="settings-page">
      <SettingsHeader title="Notification Settings" onBack={() => setSelectedComponent("accountSettings")} />
      <p>Notification settings form will go here...</p>
      {/* Add the form or content for notification settings here */}
    </div>
  );
};

export default NotificationSettings;
