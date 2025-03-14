const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN = '15d' } = process.env;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // Use the ObjectId directly without converting it to string
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error.message);
        return null; // Return null instead of throwing an error
    }
};
