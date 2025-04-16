const express = require("express");
const { createUser } = require("../controllers/CreateUser.js");
const upload = require("../middlewares/upload");
const { loginUser } = require('../controllers/LoginUser.js');
const axios = require('axios');
const router = express.Router();

// Use multer to handle the 'image' field from the form
router.post("/api/users/create", upload.single('image'), createUser);
router.post("/api/users/login", loginUser); 

router.post('/api/predict', async (req, res) => {
    try {
      const { blood_pressure, oxygen_level, heart_rate } = req.body;
  
      const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', {
        blood_pressure,
        oxygen_level,
        heart_rate
      });
  
      res.status(200).json(flaskResponse.data);
    } catch (error) {
      console.error('Error forwarding to Flask API:', error.message);
      res.status(500).json({ error: 'Failed to get prediction from AI model' });
    }
  });

module.exports = router;