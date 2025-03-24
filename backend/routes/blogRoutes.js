const express = require('express');
const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  getBlogsByUser,
  getBlogBySlug,
  addComment,
  getCommentsByBlog,
  toggleLike,
  getLikesByBlog,
  getFeaturedBlogs,
  getMostLikedBlogs,
  getTrendingBlogs
} = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { body, param } = require('express-validator');
const { checkCache, cacheResponse } = require('../middleware/cacheMiddleware');

const router = express.Router();

// Validation for creating and updating a blog
const createUpdateBlogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('tags').optional().isArray().withMessage('Tags should be an array of strings')
];

// Get all blogs (no authentication needed)
router.get('/', checkCache, getAllBlogs);

router.get("/most-liked", getMostLikedBlogs); 

router.get("/trending", getTrendingBlogs);


// Route to get featured blogs
router.get('/featured', checkCache , getFeaturedBlogs)

// Get blogs by a specific user (authentication required)
router.get('/user/:userId', authMiddleware, param('userId').isMongoId().withMessage('Invalid user ID'), getBlogsByUser);

// Create a new blog (authentication required)
router.post('/', authMiddleware, createUpdateBlogValidation, createBlog);

// Update a blog (authentication required)
router.put('/:id', authMiddleware, param('id').isMongoId().withMessage('Invalid blog ID'), updateBlog);

// Delete a blog (authentication required)
router.delete('/:id', authMiddleware, param('id').isMongoId().withMessage('Invalid blog ID'), deleteBlog);

router.get('/slug/:slug', checkCache, getBlogBySlug);

// Get a single blog by ID (no authentication needed)
router.get('/:id', param('id').isMongoId().withMessage('Invalid blog ID'), checkCache ,getBlogById);

// 🔹 Validation for Adding Comments
router.post(
  '/:blogId/comments',
  authMiddleware,
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('content').notEmpty().withMessage('Comment content is required'),
  addComment
);

// Get comments for a blog
router.get('/:blogId/comments', param('blogId').isMongoId().withMessage('Invalid blog ID'), checkCache, getCommentsByBlog);

// 🔹 Validation for Likes
router.post(
  '/:blogId/like',
  authMiddleware,
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  toggleLike
);

// Get likes for a blog
router.get('/:blogId/likes', param('blogId').isMongoId().withMessage('Invalid blog ID'), getLikesByBlog);

module.exports = router;