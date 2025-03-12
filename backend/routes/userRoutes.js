const express = require('express');
const { 
    getUserProfile, 
    getUserProfileById, 
    updateUserProfile, 
    deleteUser, 
    changePassword, 
    } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/profileMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, upload.single('profilePhoto'), updateUserProfile);
router.delete('/profile', authMiddleware, deleteUser);
router.put('/change-password', authMiddleware, changePassword);
router.get('/:userId', authMiddleware, getUserProfileById);

module.exports = router;