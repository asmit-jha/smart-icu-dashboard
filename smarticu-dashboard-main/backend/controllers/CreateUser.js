const bcrypt = require('bcryptjs');
const Users = require("../models/Users");

exports.createUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const image = req.file ? req.file.filename : "";

    // Validate required fields
    if (!name || !phone || !email || !password || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name,
      phone,
      email,
      password: hashedPassword,  // Store the hashed password
      image,
      created: Date.now(),
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
