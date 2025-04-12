import React, { useState, useEffect, useRef } from "react";
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

// Register Chart.js components
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
  const [heartWave, setHeartWave] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [bloodPressure, setBloodPressure] = useState([]);
  const [oxygenSaturation, setOxygenSaturation] = useState([]);
  const [patientName, setPatientName] = useState("Loading..."); // Patient name state
  const beepRef = useRef(null); // Reference for audio element

  // Fetch the first patient's name from backend
  useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vitals/first");
        const data = await response.json();
        setPatientName(data.patientName || "Unknown"); // Update patient name or show "Unknown"
      } catch (error) {
        console.error("Error fetching patient name:", error);
        setPatientName("Unknown"); // Fallback value
      }
    };
    fetchPatientName();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextTime = heartWave.length; // Time increment
      const nextHeartValue = 10 * Math.sin(nextTime * 0.2) + Math.random() * 2; // Sinusoidal data with noise
      const nextBloodPressure = Math.floor(Math.random() * 40) + 80; // Random blood pressure value (80–120)
      const nextOxygenSaturation = Math.floor(Math.random() * 5) + 95; // Random oxygen saturation value (95–100)

      // Update values
      setHeartWave((prevWave) => [...prevWave.slice(-50), nextHeartValue]);
      setBloodPressure((prevBP) => [...prevBP.slice(-50), nextBloodPressure]);
      setOxygenSaturation((prevOxygen) => [
        ...prevOxygen.slice(-50),
        nextOxygenSaturation,
      ]);
      setTimestamps((prevTimestamps) => [
        ...prevTimestamps.slice(-50),
        new Date().toLocaleTimeString(),
      ]);

      // Play beep sound
      if (beepRef.current) {
        beepRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  // Data for Heart Rate (Line Chart)
  const heartRateData = {
    labels: timestamps, // X-axis labels
    datasets: [
      {
        label: "Heart Wave (bpm)",
        data: heartWave, // Y-axis data
        borderColor: "rgba(255, 99, 132, 1)", // Line color
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Line fill color
        borderWidth: 2,
        pointRadius: 0, // Remove points for smoother line
        tension: 0.4, // Smooth curve
      },
    ],
  };

  // Data for Blood Pressure (Bar Graph)
  const bloodPressureData = {
    labels: timestamps, // X-axis labels
    datasets: [
      {
        label: "Blood Pressure (mmHg)",
        data: bloodPressure, // Y-axis data
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Bar color
        borderColor: "rgba(54, 162, 235, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  // Data for Oxygen Saturation (Bar Graph)
  const oxygenSaturationData = {
    labels: timestamps, // X-axis labels
    datasets: [
      {
        label: "Oxygen Saturation (%)",
        data: oxygenSaturation, // Y-axis data
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1,
      },
    ],
  };

  // Options shared across charts
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div
      style={{
        width: "800px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative", // Add relative positioning
      }}
    >
      {/* Patient Name on Top-Right */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          fontWeight: "bold",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        Patient: {patientName}
      </div>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Live Monitoring Dashboard
      </h2>

      {/* Audio element for beep sound */}
      <audio ref={beepRef}>
        <source src="beep-01a.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Heart Rate Chart */}
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Heart Rate Monitoring
        </h3>
        <Line data={heartRateData} options={commonOptions} />
      </div>

      {/* Blood Pressure Bar Graph */}
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Blood Pressure Monitoring
        </h3>
        <Bar data={bloodPressureData} options={commonOptions} />
      </div>

      {/* Oxygen Saturation Bar Graph */}
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Oxygen Saturation Monitoring
        </h3>
        <Bar data={oxygenSaturationData} options={commonOptions} />
      </div>
    </div>
  );
};

export default MonitoringDashboardWithBeep;
