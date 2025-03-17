// src/pages/AccountSettings.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/AccountSettings.css";  // Your custom styles

const AccountSettings = ({ setSelectedComponent }) => {
  return (
    <div className="account-settings">
      <div className="settings-header">
        <h3> <b>Account Settings</b></h3>
      </div>
      {/* Navigation List */}
      <div className="settings-list">
        <ul className="settings-link">
          <li>
            <Link to="#" onClick={() => setSelectedComponent("profileSettings")}>Edit Profile</Link>
          </li>
          <li>
            <Link to="#" onClick={() => setSelectedComponent("passwordSettings")}>Password Settings</Link>
          </li>
          <li>
            <Link to="#" onClick={() => setSelectedComponent("notificationSettings")}>Notification Settings</Link>
          </li>
          <li>
            <Link to="#" onClick={() => setSelectedComponent("legalTerms")}>Legal & Terms</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountSettings;
