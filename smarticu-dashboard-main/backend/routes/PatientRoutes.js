const express = require("express");
const { registerVital } = require('../controllers/PatientVitals.js')
const { registerPatient } = require('../controllers/RegisterPatient.js')
const { getAllPatients } = require("../controllers/RegisterPatient.js")
const { getVitals } = require('../controllers/PatientVitals.js');


const router = express.Router();

router.post("/api/vitals/create", registerVital); // Route for creating a vitals
router.post("/api/patients/register", registerPatient);
router.get("/api/patients",getAllPatients )
router.post('/api/vitals', getVitals);

module.exports = router;
