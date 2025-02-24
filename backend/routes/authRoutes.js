const express = require('express');
const { register, login, forgotPassword} = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const authValidator = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(authValidator.register), register);
router.post('/login', validate(authValidator.login), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
