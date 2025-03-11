const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user._id.toString(), role: user.role }, // Fix: Ensure id is included
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
    );
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Invalid or expired token');
    }
};
