const express = require("express");
const { registerVital } = require('../controllers/PatientVitals.js')
const { registerPatient } = require('../controllers/RegisterPatient.js')

const router = express.Router();

router.post("/api/vitals/create", registerVital); // Route for creating a vitals
router.post("/api/patients/register", registerPatient);

module.exports = router;
