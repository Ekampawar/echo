const Like = require('../models/like');

exports.likeBlog = async (req, res) => {
    try {
        const existingLike = await Like.findOne({ blog: req.params.blogId, user: req.user.id });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this blog' });
        }
        const like = await Like.create({ blog: req.params.blogId, user: req.user.id });
        res.status(201).json(like);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.unlikeBlog = async (req, res) => {
    try {
        await Like.findOneAndDelete({ blog: req.params.blogId, user: req.user.id });
        res.json({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLikesByBlog = async (req, res) => {
    try {
        const likes = await Like.find({ blog: req.params.blogId }).populate('user', 'username');
        res.json(likes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
