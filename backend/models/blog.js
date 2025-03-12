const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
  },
  slug: {
    type: String,
    unique: true, // Ensure slug is unique
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  tags: { 
    type: [String], 
    default: [] 
  }, 
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Middleware to generate slug before saving
BlogSchema.pre("validate", async function(next) {
  if (!this.slug) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special chars with hyphens
      .replace(/(^-|-$)/g, ""); // Remove leading/trailing hyphens

    // Ensure uniqueness by appending a number if slug already exists
    let existing = await mongoose.model("Blog").findOne({ slug });
    let count = 1;
    while (existing) {
      let newSlug = `${slug}-${count}`;
      existing = await mongoose.model("Blog").findOne({ slug: newSlug });
      if (!existing) {
        slug = newSlug;
      }
      count++;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);