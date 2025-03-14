const express = require('express');
const Blog = require('../models/blog'); // Assuming you have a Blog model

const router = express.Router();

// Route to get statistics
router.get('/stats', async (req, res) => {
  try {
    // Fetch the total number of blogs
    const totalBlogs = await Blog.countDocuments();

    // Fetch the total number of likes (count the number of users who liked blogs)
    const totalLikes = await Blog.aggregate([
      { $project: { totalLikes: { $size: { $objectToArray: "$likes" } } } },
      { $group: { _id: null, totalLikes: { $sum: "$totalLikes" } } }
    ]);

    // Fetch the total number of views (assuming each blog has a views field)
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    // Fetch the top 5 blogs by likes
    const topBlogs = await Blog.find()
      .sort({ "likes.size": -1 }) // Sort by the number of likes in descending order
      .limit(5)
      .select("title likes views");

    // Return the stats
    res.json({
      totalBlogs,
      totalLikes: totalLikes[0]?.totalLikes || 0, // Safe handling in case of no result
      totalViews: totalViews[0]?.totalViews || 0, // Safe handling in case of no result
      topBlogs
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Error fetching statistics." });
  }
});

module.exports = router;