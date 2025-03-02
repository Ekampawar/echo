const express = require('express');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const blogValidator = require('../validators/blogValidator');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', authMiddleware, upload.array('images', 5), validate(blogValidator.create), createBlog);
router.put('/:id', authMiddleware, upload.array('images', 5), validate(blogValidator.update), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
