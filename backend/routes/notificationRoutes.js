const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  handleLikeNotification,
  handleCommentNotification,
} = require('../controllers/notificationController');

// Get notifications for a user
router.get('/:userId', getNotifications);

// Mark a notification as read
router.put('/:notificationId/read', markAsRead);

// Handle like notification
router.post('/like', handleLikeNotification);

// Handle comment notification
router.post('/comment', handleCommentNotification);

module.exports = router;
