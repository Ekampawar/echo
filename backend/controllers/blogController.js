const Blog = require('../models/blog');
const redisClient = require('../utils/redisClient');

// Function to get from Redis cache or database
const getFromCacheOrDatabase = async (key, fetchFromDb) => {
  try {
    let data = await redisClient.get(key);
    if (data) {
      console.log(`Cache hit for ${key}`);
      return JSON.parse(data); // Return data from cache
    }

    console.log(`Cache miss for ${key}`);
    data = await fetchFromDb();
    if (data) {
      await redisClient.setEx(key, 3600, JSON.stringify(data)); // Cache data for 1 hour
    }

    return data;
  } catch (err) {
    console.error(`Error in Redis cache: ${err.message}`);
    return fetchFromDb(); // Fallback to DB if Redis fails
  }
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id, // Make sure req.user is populated
      tags,
      slug: title.toLowerCase().replace(/ /g, '-'),
    });

    await newBlog.save();
    await redisClient.del('allBlogs'); // Clear cache for all blogs

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Error creating blog', error: err.message });
  }
};

// Get all blogs (from cache or database)
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await getFromCacheOrDatabase('allBlogs', async () => {
      return await Blog.find().populate('author', 'name email');
    });

    res.status(200).json({ data: blogs });
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const key = `blog:${req.params.id}`;
    const blog = await getFromCacheOrDatabase(key, async () => {
      return await Blog.findById(req.params.id).populate('author', 'name email');
    });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog by ID', error: err.message });
  }
};

// Get blog by its slug
const getBlogBySlug = async (req, res) => {
  try {
    const key = `slug:${req.params.slug}`;
    const blog = await getFromCacheOrDatabase(key, async () => {
      return await Blog.findOne({ slug: req.params.slug }).populate('author', 'name email');
    });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog by slug', error: err.message });
  }
};

// Get Featured Blogs
const getFeaturedBlogs = async (req, res) => {
  try {
    const featuredBlogs = await getFromCacheOrDatabase('featuredBlogs', async () => {
      return await Blog.find({ featured: true }).populate('author', 'name email');
    });

    if (!featuredBlogs.length) {
      return res.status(404).json({ message: 'No featured blogs found' });
    }
    res.status(200).json({ data: featuredBlogs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching featured blogs', error: err.message });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;

    await blog.save();
    await redisClient.del(`blog:${id}`); // Clear cache for this specific blog
    await redisClient.del('allBlogs'); // Clear cache for all blogs

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await blog.deleteOne();
    await redisClient.del(`blog:${id}`); // Clear cache for this specific blog
    await redisClient.del('allBlogs'); // Clear cache for all blogs

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

// Get blogs by a specific user
const getBlogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const blogs = await Blog.find({ author: userId })
      .populate('author', 'name email');

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found for this user' });
    }

    res.status(200).json({ data: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching blogs by user', error: err.message });
  }
};

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = { userId: req.user._id, text: content };
    blog.comments.push(newComment);
    await blog.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};

// Get comments for a blog
const getCommentsByBlog = async (req, res) => {
  try {
    const key = `comments:${req.params.blogId}`;
    const cachedComments = await redisClient.get(key);

    if (cachedComments) {
      return res.status(200).json(JSON.parse(cachedComments));
    }

    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.comments || blog.comments.length === 0) {
      return res.status(404).json({ message: 'No comments available' });
    }

    await redisClient.setEx(key, 1800, JSON.stringify(blog.comments)); // Cache for 30 min

    res.status(200).json({ data: blog.comments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

// For most liked 
const getMostLikedBlogs = async (req, res) => {
  try {
      const blogs = await Blog.find().sort({ likes: -1 }).limit(5); // Get top 5 most liked
      res.status(200).json({ success: true, data: blogs });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching most liked blogs", error: error.message });
  }
};

// Controller for Trending Blogs (Based on Views)
const getTrendingBlogs = async (req, res) => {
  try {
      const blogs = await Blog.find().sort({ views: -1 }).limit(5); // Get top 5 most viewed
      res.status(200).json({ success: true, data: blogs });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching trending blogs", error: error.message });
  }
};


// Toggle like for a blog
const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const likeIndex = blog.likes.indexOf(userId);
    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1); // Unlike (remove user from array)
    } else {
      blog.likes.push(userId); // Like (add user ID)
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get likes for a blog
const getLikesByBlog = async (req, res) => {
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

// Export functions using module.exports
module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogsByUser,
  addComment,
  getCommentsByBlog,
  toggleLike,
  getLikesByBlog,
  getFeaturedBlogs,
  getMostLikedBlogs,
  getTrendingBlogs
};
