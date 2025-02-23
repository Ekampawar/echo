const Like = require('../models/like');

exports.likeBlog = async (userId, blogId) => {
    const existingLike = await Like.findOne({ user: userId, blog: blogId });
    if (existingLike) {
        throw new Error('You have already liked this blog');
    }

    const like = await Like.create({ user: userId, blog: blogId });
    return like;
};

exports.unlikeBlog = async (userId, blogId) => {
    const like = await Like.findOneAndDelete({ user: userId, blog: blogId });
    if (!like) {
        throw new Error('Like not found');
    }

    return { message: 'Blog unliked successfully' };
};

exports.getLikesForBlog = async (blogId) => {
    return await Like.find({ blog: blogId }).populate('user', 'username');
};
