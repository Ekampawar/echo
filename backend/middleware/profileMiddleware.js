const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory to save the uploaded file
    cb(null, 'uploads/profilePhotos'); // Store profile photos in the 'uploads/profilePhotos' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only image files (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png) are allowed.'));
  }
};

// Create the multer upload instance with the defined storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
