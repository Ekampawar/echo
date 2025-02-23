const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({ ...req.body, user: req.user.id });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCommentsByBlog = async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId }).populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
