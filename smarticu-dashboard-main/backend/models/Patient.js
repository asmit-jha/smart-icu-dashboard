const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({

      patient_id: String,// Patient ID
      name: String, // Patient name
      age: Number, // Patient age
      vitals: { // Nested object for vital signs
        heartRate: Number, // Heart rate
        bloodPressure: String, // Blood pressure (string format like "120/80")
        oxygenLevel: Number, // Oxygen saturation level
        //lastUpdated: Date.now // Timestamp for last update
      }
    });
    
    module.exports = mongoose.model("Patient", PatientSchema);
