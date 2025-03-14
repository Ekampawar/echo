const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters long'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    likes: {
      type: [String], // Array of user IDs who liked the blog
      default: [],
    },    
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index the slug field for better performance
BlogSchema.index({ slug: 1 }, { unique: true });

// Middleware to generate slug before saving
BlogSchema.pre('validate', async function (next) {
  if (!this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let count = 1;

    while (await mongoose.model('Blog').exists({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }
  next();
});

// Method to increment views
BlogSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Method to toggle like
BlogSchema.methods.toggleLike = function (userId) {
  if (this.likes.has(userId)) {
    this.likes.delete(userId); // Unlike
  } else {
    this.likes.set(userId, true); // Like
  }
  return this.save();
};

// Method to add a comment
BlogSchema.methods.addComment = function (userId, text) {
  this.comments.push({ userId, text });
  return this.save();
};

module.exports = mongoose.model('Blog', BlogSchema);