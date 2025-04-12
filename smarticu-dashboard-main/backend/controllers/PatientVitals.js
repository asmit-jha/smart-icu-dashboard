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