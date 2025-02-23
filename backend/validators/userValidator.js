const { body } = require('express-validator');

const userValidator = {
    update: [
        body('username').optional().notEmpty().withMessage('Username cannot be empty'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
    ]
};

module.exports = userValidator;
