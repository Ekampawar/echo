const express = require('express');
const { likeBlog, unlikeBlog } = require('../controllers/likeController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:blogId/like', authMiddleware, likeBlog);
router.post('/:blogId/unlike', authMiddleware, unlikeBlog);

module.exports = router;
