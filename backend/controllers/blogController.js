const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');

// Get all blogs with pagination
exports.getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Validate pagination input
    const validatedLimit = Math.max(1, Math.min(Number(limit) || 10, 100)); // Limit between 1 and 100
    const validatedPage = Math.max(1, Number(page) || 1); // Page should be greater than 0

    const blogs = await Blog.find()
      .skip((validatedPage - 1) * validatedLimit)
      .limit(validatedLimit)
      .populate('author', 'username email -_id'); // Populate author details

    res.status(200).json({
      status: 'success',
      data: blogs,
      message: 'Blogs fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch blogs. Please try again later.' });
  }
});

// Get a single blog by ID
exports.getBlogById = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email -_id');

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blog. Please try again later.',
    });
  }
});

// Function to get a blog by its slug
exports.getBlogBySlug = async (req, res) => {
  try {
      const slug = req.params.slug;  // Get slug from request params

      // Find blog by slug
      const blog = await Blog.findOne({ slug });

      if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
      }

      // Return the blog data
      res.json(blog);
  } catch (err) {
      console.error('Error fetching blog:', err);
      res.status(500).json({ message: 'Server error' });
  }
};

// Get blogs by a specific user
exports.getBlogsByUser = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).populate('author', 'username email -_id');

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No blogs found for this user',
      });
    }

    res.status(200).json({
      status: 'success',
      data: blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs by user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blogs by user. Please try again later.',
    });
  }
});

// Create a new blog post
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, tags } = req.body;

  // Validate required fields
  if (!title || !content || !author) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Ensure tags are unique
  const uniqueTags = Array.isArray(tags) ? [...new Set(tags)] : [];

  // Create a new blog post
  const newBlog = new Blog({
    title,
    content,
    author,
    tags: uniqueTags, // Ensure tags are unique
  });

  await newBlog.save();
  res.status(201).json({ message: "Blog created successfully", blog: newBlog });
});

// Update a blog post
exports.updateBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, tags, featured } = req.body;

    // Find the blog post by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found',
      });
    }

    // Update blog fields with provided data
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;      // Update tags if provided
    blog.featured = featured || blog.featured;  // Update featured status if provided

    await blog.save();
    res.status(200).json({
      status: 'success',
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update blog. Please try again later.',
    });
  }
});

// Delete a blog
exports.deleteBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found',
      });
    }

    // Ensure the authenticated user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this blog',
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete blog. Please try again later.',
    });
  }
});
