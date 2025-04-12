const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String, // Change from String to Number
  image: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", UserSchema);