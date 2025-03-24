// middlewares/cacheMiddleware.js
const redisClient = require('../utils/redisClient');

// Middleware to check Redis cache first
const checkCache = async (req, res, next) => {
  const key = req.originalUrl || req.url; // Generate cache key based on URL

  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log(`Cache hit for ${key}`);
      return res.status(200).json(JSON.parse(cachedData)); // Return cached data if available
    }

    console.log(`Cache miss for ${key}`);
    // Proceed to database call if no cache hit
    next();
  } catch (err) {
    console.error('Error checking Redis cache:', err);
    next(); // Proceed to DB if there's an error in the cache check
  }
};

// Middleware to cache the response data in Redis
const cacheResponse = async (req, res, next) => {
  const key = req.originalUrl || req.url; // Generate cache key based on URL
  const ttl = 3600; // Set TTL (time-to-live) in seconds for the cache

  try {
    const sendResponse = res.json;

    res.json = (body) => {
      redisClient.setEx(key, ttl, JSON.stringify(body)); // Cache the data in Redis
      sendResponse.call(res, body); // Send the response after caching
    };

    next();
  } catch (err) {
    console.error('Error caching the response:', err);
    next();
  }
};

module.exports = { checkCache, cacheResponse };
