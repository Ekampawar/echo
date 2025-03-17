import React, { useState } from "react";
import SettingsHeader from "../components/SettingsHeader"; 
import { api } from "../utils/axiosInstance";
import ErrorModal from "../components/ErrorModal"; // ✅ Import ErrorModal
import "../styles/Settings.css";

const EditProfile = ({ setSelectedComponent }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Use ErrorModal
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Handle file upload (for profile picture)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, profilePicture: response.data.imageUrl }));
    } catch (error) {
      setErrorMessage("Failed to upload image. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.put("/user/updateProfile", formData);
      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          profilePicture: response.data.user.profilePicture,
        });
      }
    } catch (err) {
      setErrorMessage("There was an error updating your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />} {/* ✅ Show modal */}
      
      <SettingsHeader title="Edit Profile" onBack={() => setSelectedComponent("accountSettings")} />

      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" onChange={handleFileUpload} /> {/* ✅ Allow file upload */}
          {formData.profilePicture && (
            <img src={formData.profilePicture} alt="Profile Preview" className="profile-preview" />
          )}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
