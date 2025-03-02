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
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// User management routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUser);
router.put('/user/:userId/role', authMiddleware, adminMiddleware, updateUserRole);
router.put('/user/:userId/ban', authMiddleware, adminMiddleware, banUser);

// Blog management routes
router.get('/blogs', authMiddleware, adminMiddleware, getAllBlogs);
router.get('/blog/:blogId', authMiddleware, adminMiddleware, getBlogById);
router.put('/blog/:blogId', authMiddleware, adminMiddleware, updateBlog);
router.delete('/blog/:id', authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
