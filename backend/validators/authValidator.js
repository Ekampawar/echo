const { body } = require('express-validator');

exports.register = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.login = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.forgotPassword = [
    body('email').isEmail().withMessage('Email is invalid')
];

exports.resetPassword = [
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
