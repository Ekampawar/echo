const { body } = require('express-validator');

exports.create = [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('content').notEmpty().withMessage('Content is required')
];

exports.update = [
    body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('content').optional().notEmpty().withMessage('Content is required')
];
