const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");

exports.authMiddleware = async (req, res, next) => {
    try {
        console.log("Headers:", req.headers);  // Log headers to check if token is coming in correctly

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("No token provided");
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        
        if (!decoded) {
            console.warn("Invalid or expired token");
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        console.log("Decoded Token:", decoded);

        // Ensure the decoded object contains the ID
        if (!decoded.id) {
            console.error("Decoded token does not contain user ID");
            return res.status(401).json({ error: "User ID missing in token" });
        }

        // Fetch user from the database using decoded.id
        req.user = await User.findById(decoded.id).select("-password").lean();
        console.log("Authenticated User:", req.user);  // Log user to verify it's populated correctly

        if (!req.user) {
            console.warn("User not found");
            return res.status(401).json({ error: "User not found" });
        }

        console.log("✅ Calling next()");  // Successful user authentication
        next();  // Continue to next middleware

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
