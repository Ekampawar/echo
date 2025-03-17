// src/components/SettingsHeader.js
import React from "react";
import { FaArrowLeft } from "react-icons/fa";  // Import back arrow icon
import "../styles/Settings.css";  // Add any styling you need

const SettingsHeader = ({ title, onBack }) => {
  return (
    <div className="settings-header">
      <FaArrowLeft 
        className="back-arrow" 
        onClick={() => {
          console.log("Back arrow clicked!");  // Debugging line
          onBack();  // Execute onBack function when clicked
        }} 
        aria-label="Go back to previous page" 
      />
      <h3><b>{title}</b></h3>
    </div>
  );
};

export default SettingsHeader;
