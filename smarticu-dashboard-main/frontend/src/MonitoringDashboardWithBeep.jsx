import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PredictButton from "./PreditStability";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MonitoringDashboardWithBeep = () => {
  const location = useLocation();
  const { patientId, patientName: passedName } = location.state || {};
  
  // State initialization
  const [heartWave, setHeartWave] = useState([]);
  const [bloodPressure, setBloodPressure] = useState([]);
  const [oxygenSaturation, setOxygenSaturation] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState(passedName || "Unknown Patient");
  const [prediction, setPrediction] = useState(null);
  const beepRef = useRef(null);

  // Fetch vitals data
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3001/api/vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientName: passedName }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vitals");
        }

        const data = await response.json();
        
        // Update states with new data (keeping last 50 readings)
        setTimestamps(prev => [...prev.slice(-49), data.timestamp]);
        setHeartWave(prev => [...prev.slice(-49), data.heartRates]);
        setBloodPressure(prev => [...prev.slice(-49), data.bloodPressures]);
        setOxygenSaturation(prev => [...prev.slice(-49), data.oxygenLevels]);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching vitals:", err);
      } finally {
        setLoading(false);
      }
    };

    if (passedName) {
      fetchVitals();
      // Set up polling every 5 seconds
      const interval = setInterval(fetchVitals, 5000);
      return () => clearInterval(interval);
    }
  }, [passedName]);

  // Handle prediction from PredictButton
  const handlePrediction = (predictionData) => {
    setPrediction(predictionData);
  };

  // Get current vitals for PredictButton
  const currentVitals = {
    heart_rate: heartWave[heartWave.length - 1] || 0,
    blood_pressure: bloodPressure[bloodPressure.length - 1] || "0/0",
    oxygen_level: oxygenSaturation[oxygenSaturation.length - 1] || 0
  };

  // Chart configurations
  // const chartData = {
  //   heartRate: {
  //     labels: timestamps,
  //     datasets: [{
  //       label: "Heart Rate (bpm)",
  //       data: heartWave,
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //       borderWidth: 2,
  //       tension: 0.4
  //     }]
  //   },
  //   // bloodPressure: {
  //   //   labels: timestamps,
  //   //   datasets: [{
  //   //     label: "Blood Pressure (mmHg)",
  //   //     data: bloodPressure.map(bp => parseInt(bp?.split('/')[0]) || 0),
  //   //     backgroundColor: "rgba(54, 162, 235, 0.5)",
  //   //     borderColor: "rgba(54, 162, 235, 1)",
  //   //     borderWidth: 1
  //   //   }]
  //   // },
  //   oxygen: {
  //     labels: timestamps,
  //     datasets: [{
  //       label: "Oxygen Saturation (%)",
  //       data: oxygenSaturation,
  //       backgroundColor: "rgba(75, 192, 192, 0.5)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       borderWidth: 1
  //     }]
  //   }
  // };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
      y: { beginAtZero: false }
    },
    plugins: {
      legend: { display: true, position: "top" }
    }
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "white",
      overflowY: "auto"
    }}>
      {/* Header section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{ margin: 0 }}>Live Monitoring Dashboard</h2>
        <div style={{
          backgroundColor: "#4CAF50",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          fontWeight: "bold",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          Patient: {patientName}
        </div>
      </div>

      {/* Prediction Section */}
      <PredictButton 
        currentVitals={currentVitals} 
        onPrediction={handlePrediction}
      />

      {prediction && (
        <div style={{
          margin: "20px 0",
          padding: "15px",
          backgroundColor: "#e8f5e9",
          borderRadius: "5px"
        }}>
          <h3>Prediction Results</h3>
          <p>Status: {prediction.status}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          marginBottom: "20px",
          borderRadius: "5px"
        }}>
          Error: {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          Loading patient data...
        </div>
      )}

      {/* Current Vitals Display */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px" }}>
          <h3>Current Heart Rate</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {heartWave[heartWave.length - 1] || "--"} bpm
          </p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px" }}>
          <h3>Current Blood Pressure</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {bloodPressure[bloodPressure.length - 1] || "--/--"} mmHg
          </p>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "5px" }}>
          <h3>Current Oxygen Saturation</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {oxygenSaturation[oxygenSaturation.length - 1] || "--"}%
          </p>
        </div>
      </div>

      {/* Charts Section */}
      {/* <div style={{ height: "400px", marginBottom: "40px" }}>
        <h3 style={{ textAlign: "center" }}>Heart Rate Monitoring</h3>
        <Line data={chartData.heartRate} options={commonOptions} />
      </div>

      <div style={{ height: "400px", marginBottom: "40px" }}>
        <h3 style={{ textAlign: "center" }}>Blood Pressure Monitoring</h3>
        <Bar data={chartData.bloodPressure} options={commonOptions} />
      </div>

      <div style={{ height: "400px", marginBottom: "40px" }}>
        <h3 style={{ textAlign: "center" }}>Oxygen Saturation Monitoring</h3>
        <Bar data={chartData.oxygen} options={commonOptions} />
      </div> */}

      {/* Audio Beep */}
      <audio ref={beepRef}>
        <source src="beep-01a.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MonitoringDashboardWithBeep;