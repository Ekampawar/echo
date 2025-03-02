const { body } = require('express-validator');

exports.update = [
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').optional().isEmail().withMessage('Email is invalid')
];

exports.changePassword = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];
