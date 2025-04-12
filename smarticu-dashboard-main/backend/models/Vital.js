const mongoose = require("mongoose");

const VitalSchema = new mongoose.Schema({
  patientName: String,
  heartRate: Number,
  bloodPressure: String, // Change from String to Number
  oxygenSaturation: Number,
  timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model("vital", VitalSchema);
