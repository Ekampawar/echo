const express = require('express');
const {
    getAllUsers,
    deleteUser,
    deleteBlog,
    updateUserRole,
    getAllBlogs,
    getBlogById,
    updateBlog,
    banUser
} = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// User management routes
router.get('/users', authMiddleware, getAllUsers);
router.delete('/user/:id', authMiddleware, deleteUser);
router.put('/user/:userId/role', authMiddleware, updateUserRole);
router.put('/user/:userId/ban', authMiddleware, banUser);

// Blog management routes
router.get('/blogs', authMiddleware, getAllBlogs);
router.get('/blog/:blogId', authMiddleware, getBlogById);
router.put('/blog/:blogId', authMiddleware, updateBlog);
router.delete('/blog/:id', authMiddleware, deleteBlog);

module.exports = router;
