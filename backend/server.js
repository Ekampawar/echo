const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Use a more advanced logging strategy in production

// Security Middleware (Helmet with some disabled headers)
app.use(
  helmet({
    contentSecurityPolicy: false,
    xssFilter: false,
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running!" });
});

// Unified Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// MongoDB Connection with Retry Logic
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
      console.error(`🚨 MongoDB Connection Failed (Attempt ${attempts}):`, error);
      if (attempts >= maxAttempts) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait before retrying
    }
  }
};

connectDB();

// Graceful Shutdown Logic (for production)
process.on('SIGINT', async () => {
  console.log('🔴 Gracefully shutting down...');
  await mongoose.connection.close();  // Close DB connections
  process.exit(0);  // Exit the process
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
