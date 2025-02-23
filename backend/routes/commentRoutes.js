const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const commentValidator = require('../validators/commentValidator');

const router = express.Router();

router.get('/:blogId', getComments);
router.post('/:blogId', authMiddleware, validate(commentValidator.add), addComment);
router.delete('/:id', authMiddleware, adminMiddleware, deleteComment);

module.exports = router;
