const express = require('express');
const mongoose = require('mongoose');
const redisClient = require('./utils/redisClient');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston'); // Consider using a better logging strategy

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes'); 
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require("./routes/statsRoutes");
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Consider using Winston or Pino for production logging

// Security Middleware (Helmet with some disabled headers)
app.use(
  helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], imgSrc: ["'self'", 'data:'] } },  // Use a more restrictive policy for security
    xssFilter: true,  // Enable XSS Filter for additional protection
  })
);

// CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy Violation"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/stats", statsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Route with Redis and MongoDB status check
app.get('/api/health', async (req, res) => {
  try {
    // MongoDB Status Check
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Redis Status Check
    const redisStatus = await new Promise((resolve, reject) => {
      redisClient.ping((err, response) => {
        if (err) {
          reject('disconnected');
        } else {
          resolve(response); // Should return "PONG" if Redis is working
        }
      });
    });

    res.status(200).json({
      status: "OK",
      message: "Server is running",
      dbStatus: dbStatus,
      redisStatus: redisStatus === 'PONG' ? 'connected' : 'disconnected',
    });
  } catch (error) {
    res.status(500).json({ message: "Health check failed", error: error.message });
  }
});

// Unified Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// MongoDB Connection with Retry Logic and Specific Error Handling
const connectDB = async () => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Connected');      
      break; // Exit loop on success
    } catch (error) {
      attempts++;
      console.error(`🚨 MongoDB Connection Failed (Attempt ${attempts}):`, error.message);
      if (attempts >= maxAttempts) {
        console.error("🚨 Max connection attempts reached. Exiting...");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait before retrying
    }
  }
};

// Redis Connection Handling and Logging
redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('error', (err) => {
  console.error('🚨 Redis Connection Error:', err);
});

connectDB();

// Graceful Shutdown Logic with Timeout (for production)
process.on('SIGINT', async () => {
  console.log('🔴 Gracefully shutting down...');
  try {
    await mongoose.connection.close();  // Close DB connections
    console.log('✅ MongoDB connection closed');
  } catch (err) {
    console.error('🚨 Error closing MongoDB connection:', err);
  }
  process.exit(0);  // Exit the process
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
