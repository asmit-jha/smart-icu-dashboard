import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import MonitoringDashboardWithBeep from './MonitoringDashboardWithBeep'
import Dashboard from './Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/monitor" element={<MonitoringDashboardWithBeep />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
