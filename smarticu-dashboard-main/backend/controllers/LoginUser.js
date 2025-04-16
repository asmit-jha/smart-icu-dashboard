const bcrypt = require('bcryptjs');
const Users = require('../models/Users');

exports.loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find the user by name
    const user = await Users.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
