const multer = require('multer');
const path = require('path');

// Set the storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add a timestamp to the filename to prevent overwriting
  },
});

// Filter files to only allow images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

// Initialize multer with the storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
