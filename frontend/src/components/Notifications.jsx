import React, { useEffect, useState } from 'react';
import { api } from '../utils/axiosInstance'; // Assuming api.js contains the updated API methods
import '../styles/Notifications.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications for the current user
    const userId = localStorage.getItem('userId'); // Assuming the user ID is saved in localStorage
    if (userId) {
      fetchNotifications(userId);
    }
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const response = await api.getNotifications(userId);
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      // Update the notification state to reflect the change
      setNotifications(notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleLikeNotification = async (userId, blogId) => {
    try {
      await api.likeNotification(userId, blogId);
      // You can handle UI update after liking, such as showing a success message or updating the notification
    } catch (err) {
      setError('Failed to send like notification');
    }
  };

  const handleCommentNotification = async (userId, blogId, commentText) => {
    try {
      await api.commentNotification(userId, blogId, commentText);
      // Handle UI update after sending comment notification
    } catch (err) {
      setError('Failed to send comment notification');
    }
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {loading }
      {error && <p className="error-message">{error}</p>}
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <p>{notification.message}</p>
              {!notification.read && (
                <button
                  className="mark-as-read-button"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;