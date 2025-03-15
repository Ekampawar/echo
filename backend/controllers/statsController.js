const Blog = require("../models/blog");
const User = require("../models/user");

// Get Admin Stats (Overall platform stats)
const getAdminStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalLikes = await Blog.aggregate([{ $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } }]);
    const totalViews = await Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]);

    const topBlogs = await Blog.find().sort({ likes: -1 }).limit(5).select("title likes views");

    res.json({
      totalBlogs,
      totalUsers,
      totalLikes: totalLikes.length ? totalLikes[0].totalLikes : 0,
      totalViews: totalViews.length ? totalViews[0].totalViews : 0,
      topBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
};

// Get User-Specific Stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const totalBlogs = await Blog.countDocuments({ author: userId });

    const userBlogs = await Blog.find({ author: userId });
    const totalLikes = userBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
    const totalViews = userBlogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
    const topBlogs = userBlogs.sort((a, b) => b.likes.length - a.likes.length).slice(0, 5);

    res.json({
      totalBlogs,
      totalLikes,
      totalViews,
      topBlogs: topBlogs.map((blog) => ({ title: blog.title, likes: blog.likes.length, views: blog.views })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats", error });
  }
};

module.exports = { getAdminStats, getUserStats };
