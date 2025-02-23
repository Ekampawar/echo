const { body } = require('express-validator');

const commentValidator = {
    add: [
        body('text').notEmpty().withMessage('Comment text is required'),
    ]
};

module.exports = commentValidator;
