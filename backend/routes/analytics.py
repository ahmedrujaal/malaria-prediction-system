from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Patient, Prediction, User
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    
    # Total patients for current user
    total_patients = Patient.query.filter_by(user_id=current_user_id).count()
    
    # Get all predictions for current user's patients
    user_patients = db.session.query(Patient.id).filter_by(user_id=current_user_id).all()
    patient_ids = [p[0] for p in user_patients]
    
    if not patient_ids:
        return jsonify({
            'total_patients': 0,
            'total_predictions': 0,
            'positive_cases': 0,
            'negative_cases': 0,
            'positive_percentage': 0,
            'negative_percentage': 0
        }), 200
    
    total_predictions = Prediction.query.filter(Prediction.patient_id.in_(patient_ids)).count()
    positive_cases = Prediction.query.filter(
        Prediction.patient_id.in_(patient_ids),
        Prediction.result == 'Positive'
    ).count()
    negative_cases = Prediction.query.filter(
        Prediction.patient_id.in_(patient_ids),
        Prediction.result == 'Negative'
    ).count()
    
    positive_percentage = (positive_cases / total_predictions * 100) if total_predictions > 0 else 0
    negative_percentage = (negative_cases / total_predictions * 100) if total_predictions > 0 else 0
    
    return jsonify({
        'total_patients': total_patients,
        'total_predictions': total_predictions,
        'positive_cases': positive_cases,
        'negative_cases': negative_cases,
        'positive_percentage': round(positive_percentage, 2),
        'negative_percentage': round(negative_percentage, 2)
    }), 200

@analytics_bp.route('/recent-predictions', methods=['GET'])
@jwt_required()
def recent_predictions():
    current_user_id = get_jwt_identity()
    
    user_patients = db.session.query(Patient.id).filter_by(user_id=current_user_id).all()
    patient_ids = [p[0] for p in user_patients]
    
    if not patient_ids:
        return jsonify([]), 200
    
    predictions = Prediction.query.filter(
        Prediction.patient_id.in_(patient_ids)
    ).order_by(Prediction.created_at.desc()).limit(10).all()
    
    return jsonify([pred.to_dict() for pred in predictions]), 200
