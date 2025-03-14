const User = require('../models/user');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Utility function for handling errors
const handleError = (res, errorMessage, statusCode = 500) => {
    console.error(errorMessage);
    return res.status(statusCode).json({ error: errorMessage });
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : null, // Full URL for profile photo
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// Get user profile by ID
exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return handleError(res, 'User not found', 404);
    res.status(200).json(user);
  } catch (error) {
    handleError(res, 'Failed to fetch user profile by ID. Please try again.');
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile photo if it exists
    if (user.profilePhoto) {
      const oldProfilePhotoPath = path.join(__dirname, 'uploads', user.profilePhoto);
      if (fs.existsSync(oldProfilePhotoPath)) {
        fs.unlinkSync(oldProfilePhotoPath); // Delete old profile photo file
      }
    }

    // If a new profile photo was uploaded, update the user's profilePhoto field
    if (req.file) {
      user.profilePhoto = `/uploads/profile-pictures/${req.file.filename}`; // Save new file path
    }

    // Validate and update other fields if necessary (e.g., username or email)
    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    // Save the updated user document
    await user.save();

    // Return the updated profile data to the client
    res.json({
      profilePhoto: user.profilePhoto ? `http://localhost:5000${user.profilePhoto}` : null,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return handleError(res, 'User not found', 404);

    // Optionally, delete the user's profile photo if necessary
    if (user.profilePhoto) {
      const profilePhotoPath = path.join(__dirname, 'uploads', user.profilePhoto);
      if (fs.existsSync(profilePhotoPath)) {
        fs.unlinkSync(profilePhotoPath); // Delete the profile photo file
      }
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, 'Failed to delete user. Please try again.');
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Validate input data (e.g., password length check or using express-validator)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return handleError(res, 'User not found', 404);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return handleError(res, 'Old password is incorrect', 400);

    user.password = await hashPassword(newPassword);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    handleError(res, 'Failed to change password. Please try again.');
  }
};