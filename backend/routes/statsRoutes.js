const express = require('express');
const router = express.Router();
const { getAdminStats, getUserStats } = require("../controllers/statsController");
const { authMiddleware } = require('../middleware/authMiddleware'); // Assuming you have an authMiddleware to check if the user is admin or authenticated

// Admin Dashboard Stats
router.get("/admin", authMiddleware, getAdminStats);

// User Dashboard Stats
router.get("/user/:userId", authMiddleware, getUserStats);

module.exports = router;
