const Like = require('../models/like');
const Blog = require('../models/blog');

// Like a blog
exports.likeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const existingLike = await Like.findOne({ blog: blogId, user: req.user.id });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this blog' });
        }
        const like = await Like.create({ blog: blogId, user: req.user.id });
        res.status(201).json(like);
    } catch (error) {
        console.error('Error liking blog:', error);
        res.status(500).json({ error: 'Failed to like blog. Please try again.' });
    }
};

// Unlike a blog
exports.unlikeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const like = await Like.findOneAndDelete({ blog: blogId, user: req.user.id });
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }
        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error unliking blog:', error);
        res.status(500).json({ error: 'Failed to unlike blog. Please try again.' });
    }
};

// Get likes by blog ID
exports.getLikesByBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const likes = await Like.find({ blog: blogId }).populate('user', 'username');
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Failed to fetch likes. Please try again.' });
    }
};
