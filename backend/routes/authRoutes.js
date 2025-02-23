const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const authValidator = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(authValidator.register), register);
router.post('/login', validate(authValidator.login), login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
