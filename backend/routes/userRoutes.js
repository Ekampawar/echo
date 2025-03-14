const express = require('express');
const { 
    getUserProfile, 
    getUserProfileById, 
    updateUserProfile, 
    deleteUser, 
    changePassword 
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Get logged-in user's profile
router.get("/profile", authMiddleware, getUserProfile);

// Update logged-in user's profile (including profile photo upload)
router.put('/profile', authMiddleware, upload.single('profilePhoto'), updateUserProfile);

// Delete the logged-in user's account
router.delete('/profile', authMiddleware, deleteUser);

// Change password for logged-in user
router.put('/profile/change-password', authMiddleware, changePassword);

// Get any user profile by user ID (without authentication if needed)
router.get('/:userId', getUserProfileById); // Public profile

module.exports = router;