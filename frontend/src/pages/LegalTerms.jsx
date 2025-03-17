// src/pages/LegalTerms.js
import React from "react";
import SettingsHeader from "../components/SettingsHeader"; // Import header
import "../styles/Settings.css";

const LegalTerms = ({ setSelectedComponent }) => {
  return (
    <div className="settings-page">
      <SettingsHeader title="Legal & Terms" onBack={() => setSelectedComponent("accountSettings")} />
      <p>Legal terms content will go here...</p>
      {/* Add legal terms content here */}
    </div>
  );
};

export default LegalTerms;