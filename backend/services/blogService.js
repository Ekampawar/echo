const Blog = require('../models/blog');

exports.createBlog = async (blogData) => {
    const blog = await Blog.create(blogData);
    return blog;
};

exports.getAllBlogs = async () => {
    return await Blog.find().populate('author', 'username email');
};

exports.getBlogById = async (id) => {
    return await Blog.findById(id).populate('author', 'username email');
};

exports.updateBlog = async (id, blogData, userId) => {
    const blog = await Blog.findById(id);
    if (!blog) {
        throw new Error('Blog not found');
    }
    if (blog.author.toString() !== userId) {
        throw new Error('Unauthorized action');
    }
    Object.assign(blog, blogData);
    await blog.save();
    return blog;
};

exports.deleteBlog = async (id, userId) => {
    const blog = await Blog.findById(id);
    if (!blog) {
        throw new Error('Blog not found');
    }
    if (blog.author.toString() !== userId) {
        throw new Error('Unauthorized action');
    }
    await blog.remove();
    return { message: 'Blog deleted successfully' };
};
