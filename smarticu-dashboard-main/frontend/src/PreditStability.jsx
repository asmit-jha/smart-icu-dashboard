import React, { useState } from 'react';
import axios from 'axios';

const PredictButton = ({ currentVitals, onPrediction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    try {
      // Convert and validate all inputs
      const predictionData = {
        heart_rate: Number(currentVitals.heart_rate) || 0,
        blood_pressure:Number(currentVitals.blood_pressure) || 0,
        oxygen_level: Number(currentVitals.oxygen_level) || 0,
      };

      console.log('Sending to prediction API:', predictionData);

      const response = await axios.post('http://localhost:3001/api/predict', 
        predictionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (!response.data?.prediction) {
        throw new Error('Invalid prediction response');
      }

      console.log('Prediction result:', response.data);
      onPrediction(response.data);

    } catch (err) {
      console.error('Prediction failed:', {
        error: err.message,
        response: err.response?.data
      });
      setError(err.response?.data?.message || 'Prediction service unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: '20px 0',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '15px' }}>Patient Stability Prediction</h3>
      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
      >
        {loading ? (
          <span>Predicting... <i className="fas fa-spinner fa-spin"></i></span>
        ) : (
          <span>Run Prediction <i className="fas fa-chart-line"></i></span>
        )}
      </button>
      
      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default PredictButton;