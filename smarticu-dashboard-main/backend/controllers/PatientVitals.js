const mongoose = require("mongoose");
const Vital = require("../models/Vital");


exports.registerVital=async(req,res)=>{
    try{
        const {patientName, heartRate, bloodPressure, oxygenSaturation } =req.body

        if(!patientName|| !heartRate || !bloodPressure || !oxygenSaturation)
        {
            res.status(400).json({ message: "All fields are required" });
        }

        const newVital = new Vital({
            patientName,
            heartRate,
            bloodPressure,
            oxygenSaturation,
            timestamp:Date.now()
        })

        const savedVital = await newVital.save()
        res.status(201).json({ message: "Vital registered successfully", Vital: savedVital });

    }
    catch(error)
    {
        console.error("Error creating :", error);
        res.status(500).json({ error: "Failed to register Vital" });
    
    }
}


exports.getVitals = async (req, res) => {
  try {
    const { patientId, patientName } = req.body;

    console.log(patientName)

    // Validate input
    if (!patientId && !patientName) {
      return res.status(400).json({ error: "Patient ID or name required" });
    }

    // Query MongoDB
    let query = {};
    if (patientName) query.patientName = patientName;
    console.log(query)

    const vitals = await Vital.findOne(query)
      .sort({ timestamp: -1 }) // Get most recent first
      .limit(50); // Limit to 50 readings

    // if (!vitals.length) {
    //   return res.status(404).json({ error: "No vitals found" });
    // }

    // Format data for frontend charts
    const response = {
    timestamp: vitals.timestamp.toLocaleTimeString(),
      heartRates: vitals.heartRate,
      bloodPressures: vitals.bloodPressure,
      oxygenLevels: vitals.oxygenSaturation
    };

    res.json(response);
    console.log(response)

  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({ error: "Server error" });
  }
};

