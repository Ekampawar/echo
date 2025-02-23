const express = require('express');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const blogValidator = require('../validators/blogValidator');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', authMiddleware, validate(blogValidator.create), createBlog);
router.put('/:id', authMiddleware, validate(blogValidator.update), updateBlog);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog);

module.exports = router;
