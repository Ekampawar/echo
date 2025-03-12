const { verifyToken } = require("../utils/jwt");
const User = require("../models/user"); // Ensure you import your User model

exports.authMiddleware = async (req, res, next) => {
    try {
        console.log("Headers:", req.headers); // Debugging headers
        
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

        console.log("Decoded Token:", decoded); // Debugging token content

        req.user = await User.findById(decoded.id).select("-password").lean();
        console.log("Authenticated User:", req.user); // Debugging user

        if (!req.user) {
            console.warn("User not found");
            return res.status(401).json({ error: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
