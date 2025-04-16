import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../frontend/src/App.css';
import logo from '../src/hospital-4-xxl.png';

const MonitoringDashboardWithBeep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId, patientName: passedName } = location.state || {};
  
  const [patientName, setPatientName] = useState(passedName || "Loading...");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleView = (patientId, patientName) => {
    navigate('/monitor', { state: { patientId, patientName } });
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: 'white' }}>
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="dashboard-title">STAFF DASHBOARD (SMART ICU)</h1>
      </header>

      <main className="dashboard-main">
        {patients.map((patient, index) => (
          <div key={index} className="patient-card">
            <span className="patient-name">{patient.name}</span>
            <button
              className="view-button"
              onClick={() => handleView(patient._id, patient.name)}
            >
              View
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default MonitoringDashboardWithBeep;