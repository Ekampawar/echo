const Comment = require('../models/comment');
const Blog = require('../models/blog');

// Add comment to a blog
exports.addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const commentData = req.body;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        const comment = new Comment({ ...commentData, user: req.user.id, blog: blogId });
        blog.comments.push(comment);
        await comment.save();
        await blog.save();
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(400).json({ error: 'Failed to add comment. Please try again.' });
    }
};

// Get comments by blog ID
exports.getCommentsByBlog = async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId }).populate('user', 'username');
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments. Please try again.' });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        await comment.remove();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment. Please try again.' });
    }
};
