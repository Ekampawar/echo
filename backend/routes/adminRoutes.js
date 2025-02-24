const express = require('express');
const { deleteUser, deleteBlog } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.delete('/user/:id', authMiddleware, deleteUser);
router.delete('/blog/:id', authMiddleware, deleteBlog);

module.exports = router;
