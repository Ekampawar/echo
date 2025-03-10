const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
} = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Get all blogs
router.get('/', getAllBlogs);

// Get a single blog by ID
router.get('/:id', getBlogById);

// Get blogs by a specific user
router.get('/user/:userId', authMiddleware, getBlogsByUser);

// Create a new blog (with image upload)
router.post('/', authMiddleware, upload.array('images', 5), createBlog); // This line is fixed!

// Update a blog
router.put('/:id', authMiddleware, upload.array('images', 5), updateBlog);

// Delete a blog
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
