const express = require('express');
const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  getBlogsByUser,
  getBlogBySlug
} = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { body, param } = require('express-validator');

const router = express.Router();

// Validation for creating and updating a blog
const createUpdateBlogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('tags').optional().isArray().withMessage('Tags should be an array of strings')
];

// Get all blogs (no authentication needed)
router.get('/', getAllBlogs);

// Get a single blog by ID (no authentication needed)
router.get('/:id', param('id').isMongoId().withMessage('Invalid blog ID'), getBlogById);

// Get blogs by a specific user (authentication required)
router.get('/user/:userId', authMiddleware, param('userId').isMongoId().withMessage('Invalid user ID'), getBlogsByUser);

// Create a new blog (authentication required)
router.post('/', authMiddleware, createUpdateBlogValidation, createBlog);

// Update a blog (authentication required)
router.put('/:id', authMiddleware, param('id').isMongoId().withMessage('Invalid blog ID'), createUpdateBlogValidation, updateBlog);

// Delete a blog (authentication required)
router.delete('/:id', authMiddleware, param('id').isMongoId().withMessage('Invalid blog ID'), deleteBlog);

router.get('/slug/:slug', getBlogBySlug);

module.exports = router;
