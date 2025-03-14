const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston'); // Consider using a better logging strategy

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes'); // Combined blog, comment, and like routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRouter = require('./routes/statsRoutes');

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
app.use('/api/blogs', blogRoutes); // Blog routes now handle blog, comments, and likes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', statsRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running!" });
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