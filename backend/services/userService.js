const User = require('../models/user');

exports.getUserProfile = async (userId) => {
    return await User.findById(userId).select('-password');
};

exports.updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    Object.assign(user, updateData);
    await user.save();
    return user;
};

exports.getAllUsers = async () => {
    return await User.find().select('-password');
};
