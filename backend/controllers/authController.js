
const authService = require('../services/authservice');
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail'

// Controller for user registration
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await authService.registerUser({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser({ email, password });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await user.findOne({email});
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now()+ 3600000; // 1 hour
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `Click on the link to reset your password: ${resetUrl}`;

        await sendEmail(user.email,"Password Reset Request", message);

        res.status(200).json({ message: "Password reset email sent."});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const { newPassword} = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update password
        user.password = await hashPassword(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};