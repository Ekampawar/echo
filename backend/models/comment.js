const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: [true, 'Blog reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);