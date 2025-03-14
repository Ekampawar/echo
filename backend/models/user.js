const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        index: true // Adding index for faster queries
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
        index: true // Adding index for faster queries
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        // Consider adding a regex for password complexity, if required
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePhoto: {
        type: String,
        default: '/uploads/profile-pictures/default-profile-pic.jpg',
        required: [true, 'Profile photo is required'],
        validate: {
          validator: function (v) {
            // This will validate file paths like '/uploads/profile-pictures/1234567890.jpg'
            return /^\/uploads\/profile-pictures\/[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/.test(v);
          },
          message: 'Invalid profile photo URL!',
        },
      },      
    resetPasswordToken: {
        type: String,
        unique: true, // Ensures each reset token is unique
    },
    resetPasswordExpire: {
        type: Date,
        validate: {
            validator: function (v) {
                return v > Date.now(); // Ensures expiry date is in the future
            },
            message: 'Reset password token has expired.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
