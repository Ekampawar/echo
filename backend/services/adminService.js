const User = require('../models/user');
const Blog = require('../models/blog');

exports.getAllUsers = async () => {
    return await User.find().select('-password');
};

exports.deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    await user.remove();
    return { message: 'User deleted successfully' };
};

exports.deleteAnyBlog = async (blogId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new Error('Blog not found');
    }
    await blog.remove();
    return { message: 'Blog deleted successfully by admin' };
};
