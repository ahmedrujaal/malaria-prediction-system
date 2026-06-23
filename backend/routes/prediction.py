from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Patient, Prediction
import joblib
import numpy as np
import os

prediction_bp = Blueprint('prediction', __name__)

# Load ML model
MODEL_PATH = os.getenv('MODEL_PATH', './models/malaria_model.pkl')
try:
    model = joblib.load(MODEL_PATH)
except:
    model = None
    print(f"Warning: Could not load model from {MODEL_PATH}")

@prediction_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['patient_id', 'fever', 'headache', 'chills', 'sweating', 'vomiting', 'fatigue']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    patient = Patient.query.filter_by(id=data['patient_id'], user_id=current_user_id).first()
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404
    
    if model is None:
        return jsonify({'message': 'ML model not available'}), 500
    
    # Prepare features for prediction
    features = np.array([[
        patient.age,
        1 if patient.gender.lower() == 'male' else 0,
        int(data['fever']),
        int(data['headache']),
        int(data['chills']),
        int(data['sweating']),
        int(data['vomiting']),
        int(data['fatigue'])
    ]])
    
    # Make prediction
    prediction_result = model.predict(features)[0]
    prediction_proba = model.predict_proba(features)[0]
    confidence = float(max(prediction_proba))
    
    result = 'Positive' if prediction_result == 1 else 'Negative'
    
    # Save prediction to database
    prediction = Prediction(
        patient_id=data['patient_id'],
        fever=data['fever'],
        headache=data['headache'],
        chills=data['chills'],
        sweating=data['sweating'],
        vomiting=data['vomiting'],
        fatigue=data['fatigue'],
        result=result,
        confidence=confidence
    )
    
    db.session.add(prediction)
    db.session.commit()
    
    return jsonify({
        'message': 'Prediction completed',
        'prediction': prediction.to_dict()
    }), 201

@prediction_bp.route('/history/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_prediction_history(patient_id):
    current_user_id = get_jwt_identity()
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user_id).first()
    
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404
    
    predictions = Prediction.query.filter_by(patient_id=patient_id).order_by(Prediction.created_at.desc()).all()
    
    return jsonify([pred.to_dict() for pred in predictions]), 200
