const express = require('express');
const { addComment, getCommentsByBlog, deleteComment } = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:blogId', getCommentsByBlog);
router.post('/:blogId', authMiddleware, addComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
