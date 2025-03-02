const { body } = require('express-validator');

exports.add = [
    body('content').notEmpty().withMessage('Content is required')
];
