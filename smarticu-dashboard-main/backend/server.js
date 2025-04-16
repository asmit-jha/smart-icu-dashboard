const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const axios = require('axios');
require("../backend/db/db.js")
const userRoutes = require('../backend/routes/UserRoutes.js')
const patientRoutes = require('../backend/routes/PatientRoutes.js')
const path = require("path");


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Define Schema and Models


// API to Calculate and Save 10-Minute Averages
// app.post("/api/vitals/average", async (req, res) => {
//   try {
//     // Get the time range (last 10 minutes)
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

//     // Find vitals within the last 10 minutes
//     const vitals = await Vital.find({ timestamp: { $gte: tenMinutesAgo } });

//     if (vitals.length === 0) {
//       return res.status(404).json({ message: "No vitals data found in the last 10 minutes" });
//     }

//     // Calculate averages
//     const avgHeartRate = vitals.reduce((sum, vital) => sum + vital.heartRate, 0) / vitals.length;
//     const avgBloodPressure = vitals.reduce((sum, vital) => sum + vital.bloodPressure, 0) / vitals.length;
//     const avgOxygenSaturation = vitals.reduce((sum, vital) => sum + vital.oxygenSaturation, 0) / vitals.length;

//     // Save averages to the database
//     const averageVital = new AverageVital({
//       patientName: vitals[0].patientName, // Assuming the same patient for the last 10 minutes
//       avgHeartRate,
//       avgBloodPressure,
//       avgOxygenSaturation,
//     });

//     await averageVital.save();

//     res.status(201).json({ message: "Average vitals saved successfully!", averageVital });
//   } catch (error) {
//     console.error("Error calculating averages:", error);
//     res.status(500).json({ error: "Failed to calculate averages" });
//   }
// });
app.use(userRoutes)
app.use(patientRoutes)



const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const cron = require("node-cron");

// Schedule job to run every 10 minutes
// cron.schedule("*/10 * * * *", async () => {
//   try {
//     const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
//     const vitals = await Vital.find({ timestamp: { $gte: tenMinutesAgo } });

//     if (vitals.length === 0) {
//       console.log("No vitals data found in the last 10 minutes");
//       return;
//     }

//     const avgHeartRate = vitals.reduce((sum, vital) => sum + vital.heartRate, 0) / vitals.length;
//     const avgBloodPressure = vitals.reduce((sum, vital) => sum + vital.bloodPressure, 0) / vitals.length;
//     const avgOxygenSaturation = vitals.reduce((sum, vital) => sum + vital.oxygenSaturation, 0) / vitals.length;

//     const averageVital = new AverageVital({
//       patientName: vitals[0].patientName,
//       avgHeartRate,
//       avgBloodPressure,
//       avgOxygenSaturation,
//     });

//     await averageVital.save();
//     console.log("Average vitals saved:", averageVital);
//   } catch (error) {
//     console.error("Error saving average vitals:", error);
//   }
// });



app.get("/api/vitals/average/latest", async (req, res) => {
  try {
    const latestAverage = await AverageVital.findOne().sort({ timestamp: -1 }); // Get the most recent average
    if (!latestAverage) {
      return res.status(404).json({ message: "No average vitals data found" });
    }
    res.json(latestAverage);
  } catch (error) {
    console.error("Error fetching latest average:", error);
    res.status(500).json({ error: "Failed to fetch latest average" });
  }
});



async function predictPatientStatus(vitals) {
  try {
    console.log(vitals)
    const response = await axios.post('http://127.0.0.1:5000/predict', {
      blood_pressure: vitals.blood_pressure,
      oxygen_level: vitals.oxygen_level,
      heart_rate: vitals.heart_rate
    });

    console.log(response.data)

    // You get this from Flask: { prediction: 0, status: "stable" }
    return response.data;

  } catch (error) {
    console.error('Prediction API error:', error.message);
    throw error;
  }
}

app.post('/api/vitals', async (req, res) => {
  const { blood_pressure, oxygen_level, heart_rate } = req.body;

  try {
    const prediction = await predictPatientStatus({ blood_pressure, oxygen_level, heart_rate });

    res.json({
      message: 'Prediction successful',
      prediction
    });
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});