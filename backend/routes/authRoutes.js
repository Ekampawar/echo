const express = require('express');
const { register, login, forgotPassword, resetPassword, getUserData} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/user', authMiddleware, getUserData);

module.exports = router;
