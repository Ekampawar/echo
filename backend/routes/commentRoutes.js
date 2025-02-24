const express = require('express');
const { addComment, getCommentsByBlog, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const commentValidator = require('../validators/commentValidator');

const router = express.Router();

router.get('/:blogId', getCommentsByBlog);
router.post('/:blogId', authMiddleware, validate(commentValidator.add), addComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
