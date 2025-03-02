const express = require('express');
const { register, login, forgotPassword, resetPassword, getUserData} = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const authValidator = require('../validators/authValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', validate(authValidator.register), register);
router.post('/login', validate(authValidator.login), login);
router.post('/forgot-password', validate(authValidator.forgotPassword), forgotPassword);
router.post('/reset-password/:token', validate(authValidator.resetPassword), resetPassword);
router.get('/user', authMiddleware, getUserData);

module.exports = router;
