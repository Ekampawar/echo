const User = require('../models/user');
const { hashPassword, comparePassword } = require('../utils/hash');  // Import hash utilities
const { generateToken } = require('../utils/jwt');  // Import JWT utility

// Register user logic
exports.registerUser = async ({ username, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = await User.create({ username, email, password: hashedPassword });

    return newUser;
};

// Login user logic
exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
        throw new Error('Invalid email or password');
    }

    // Generate a JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return { token, user };
};
