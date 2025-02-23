const Comment = require('../models/comment');

exports.addComment = async (commentData) => {
    const comment = await Comment.create(commentData);
    return comment;
};

exports.getCommentsForBlog = async (blogId) => {
    return await Comment.find({ blog: blogId }).populate('user', 'username');
};

exports.deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.user.toString() !== userId) {
        throw new Error('Unauthorized action');
    }
    await comment.remove();
    return { message: 'Comment deleted successfully' };
};
