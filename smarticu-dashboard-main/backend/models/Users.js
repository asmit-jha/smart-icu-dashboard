const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // Added password field
    type: String,
    required: true,
  },
  phone: {
    type: String, // Changed to String to support leading zeros and flexible formats
    required: true,
  },
  image: {
    type: String, // This would typically be a path or URL to the uploaded image
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);
