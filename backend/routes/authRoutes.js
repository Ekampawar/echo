const express = require('express');
const { register, login} = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const authValidator = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validate(authValidator.register), register);
router.post('/login', validate(authValidator.login), login);

module.exports = router;
