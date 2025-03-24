// utils/redisClient.js
const redis = require('redis');

// Initialize Redis client
const client = redis.createClient({
  host: 'localhost', // Adjust based on your Redis setup
  port: 6379, // Default Redis port
});

// Connect to Redis
client.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle Redis connection errors
client.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = client;
