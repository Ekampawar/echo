// src/pages/PasswordSettings.js
import React from "react";
import SettingsHeader from "../components/SettingsHeader"; // Import header
import "../styles/Settings.css";

const PasswordSettings = ({ setSelectedComponent }) => {
  return (
    <div className="settings-page">
      <SettingsHeader title="Password Settings" onBack={() => setSelectedComponent("accountSettings")} />
      <p>Password change form will go here...</p>
      {/* Add the form or content for changing the password here */}
    </div>
  );
};

export default PasswordSettings;
