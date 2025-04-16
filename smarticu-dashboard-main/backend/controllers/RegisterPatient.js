const mongoose = require("mongoose");
const Patient = require("../models/Patient.js"); // Import the Patient model

exports.registerPatient = async (req, res) => {
  try {
    const { patient_id, name, age, vitals } = req.body;

    // Validate request body
    if (!patient_id || !name || !age || !vitals) {
      return res.status(400).json({ message: "All fields (patient_id, name, age) are required" });
    }

    // // Check if the patient already exists
    // const existingPatient = await Patient.findById(patient_id);
    // if (existingPatient) {
    //   return res.status(409).json({ message: "Patient already exists" });
    // }

    // Create a new patient document
    const newPatient = new Patient({
        patient_id,
      name,
      age,
      vitals: {
        heartRate: vitals.heartRate || null,
        bloodPressure: vitals.bloodPressure || null,
        oxygenLevel: vitals.oxygenLevel || null,
        lastUpdated: Date.now(), // Set to null initially or use the current timestamp
      },
    });

    // Save the new patient to the database
    const savedPatient = await newPatient.save();

    res.status(201).json({ message: "Patient registered successfully", patient: savedPatient });
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ error: "Failed to register patient" });
  }
};


exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find(); // Fetch all patients
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
