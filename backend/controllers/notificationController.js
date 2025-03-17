const Notification = require('../models/notification');
const Blog = require('../models/blog');

// Fetch notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.userId })
      .populate('sender', 'name') // Populating sender name
      .populate('blog', 'title') // Populating blog title
      .sort({ createdAt: -1 }); // Most recent first
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read', error: err });
  }
};

// Create a notification (for like or comment)
const createNotification = async (type, senderId, recipientId, blogId) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: type,
      blog: blogId,
    });
    await notification.save();
  } catch (err) {
    console.error('Error creating notification:', err);
  }
};

// Handle like notification
const handleLikeNotification = async (req, res) => {
  const { userId, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if user has already liked the blog
    if (blog.likes.includes(userId)) {
      return res.status(400).json({ message: 'User has already liked this blog' });
    }

    // Add like to the blog
    blog.likes.push(userId);
    await blog.save();

    // Create a notification for the blog author
    await createNotification('like', userId, blog.author, blogId);

    res.json({ message: 'Blog liked and notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Error liking blog', error: err });
  }
};

// Handle comment notification
const handleCommentNotification = async (req, res) => {
  const { userId, blogId, commentText } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Add comment to the blog
    blog.comments.push({ userId, text: commentText });
    await blog.save();

    // Create a notification for the blog author
    await createNotification('comment', userId, blog.author, blogId);

    res.json({ message: 'Comment posted and notification created' });
  } catch (err) {
    res.status(500).json({ message: 'Error posting comment', error: err });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  handleLikeNotification,
  handleCommentNotification,
};
