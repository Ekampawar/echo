const Blog = require('../models/blog');
const mongoose = require('mongoose');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      tags,
      slug: title.toLowerCase().replace(/ /g, '-') // Basic slug generation
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email');
    res.status(200).json({ data: blogs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// Get blog by its slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog by slug', error: err.message });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this blog' });
    }

    const { title, content, tags } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;

    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

// Get blogs by a specific user
exports.getBlogsByUser = async (req, res) => {
  try {
    // Check if userId is valid
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find blogs by user ID
    const blogs = await Blog.find({ author: userId })
      .populate('author', 'name email')  // Assuming 'author' is a reference to the User model

    // If no blogs found
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found for this user' });
    }

    // Return blogs data
    res.status(200).json({ data: blogs });
  } catch (err) {
    // Enhanced error logging in development mode for better debugging
    console.error(err);
    res.status(500).json({ message: 'Error fetching blogs by user', error: err.message });
  }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
  try {
    // Log incoming request body and params
    console.log('Request to add comment received');
    console.log('Blog ID from params:', req.params.blogId);
    console.log('Comment content from body:', req.body.content);

    const { blogId } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      console.log('Comment content is empty or invalid');
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Find the blog by ID
    console.log('Attempting to find blog in database');
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log blog found
    console.log('Blog found:', blog);

    // Prepare new comment
    const newComment = {
      userId: req.user._id,  // Ensure req.user is available
      text: content,
    };

    // Log the new comment being added
    console.log('Adding new comment:', newComment);

    // Add the new comment to the blog
    blog.comments.push(newComment);
    await blog.save();

    console.log('New comment added successfully');
    
    // Respond with the new comment
    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (err) {
    // Log error
    console.error('Error adding comment:', err);
    res.status(500).json({
      message: 'Error adding comment',
      error: err.message || err
    });
  }
};

exports.getCommentsByBlog = async (req, res) => {
  try {
    // Log incoming request params
    console.log('Request to fetch comments received');
    console.log('Blog ID from params:', req.params.blogId);

    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Log the blog object
    console.log('Blog found:', blog);

    // Check if there are comments
    if (!blog.comments || blog.comments.length === 0) {
      console.log('No comments found for this blog');
      return res.status(404).json({ message: 'No comments available' });
    }

    // Log the comments array
    console.log('Comments found:', blog.comments);
    
    res.status(200).json({ data: blog.comments });
  } catch (err) {
    // Log error
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};


// Toggle like for a blog
exports.toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike (remove user from array)
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like (add user ID)
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Get likes for a blog
exports.getLikesByBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    const likes = Array.from(blog.likes.keys());
    res.status(200).json({ likes });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching likes', error: err.message });
  }
};
