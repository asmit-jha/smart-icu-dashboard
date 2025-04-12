from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model

# Load model
model = load_model('icu_status_model.keras')

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return "ICU Patient Status Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Expect JSON like:
    # {
    #     "blood_pressure": 120,
    #     "oxygen_level": 98.5,
    #     "heart_rate": 72
    # }

    try:
        bp = float(data['blood_pressure'])
        ox = float(data['oxygen_level'])
        hr = float(data['heart_rate'])

        # Format for model prediction
        features = np.array([[bp, ox, hr]])
        prediction = model.predict(features)[0][0]

        result = int(prediction > 0.5)
        return jsonify({
            "prediction": result,
            "status": "critical" if result == 1 else "stable"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)