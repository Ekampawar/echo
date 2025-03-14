const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads/profile-pictures' directory exists
const uploadDir = 'uploads/profile-pictures';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Store in the 'uploads/profile-pictures' folder
  },
  filename: (req, file, cb) => {
    if (req.user && req.user._id) {
      const filename = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);  // Set the filename
    } else {
      cb(new Error('User ID is missing!'), null); // Handle error if user ID is missing
    }
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed!'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;