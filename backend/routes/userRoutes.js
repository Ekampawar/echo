const express = require('express');
const { getUserProfile, updateUserProfile, deleteUser, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const userValidator = require('../validators/userValidator');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, upload.single('profilePhoto'), validate(userValidator.update), updateUserProfile);
router.delete('/profile', authMiddleware, deleteUser);
router.put('/change-password', authMiddleware, validate(userValidator.changePassword), changePassword);

module.exports = router;
