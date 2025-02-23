const express = require('express');
const { deleteUser, deleteBlog } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUser);
router.delete('/blog/:id', authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
